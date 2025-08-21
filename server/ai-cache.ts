import { createHash } from 'crypto';
import { DEMO_CONFIG } from './demo-config';

interface CachedResponse {
  response: string;
  timestamp: number;
  hits: number;
}

class AIResponseCache {
  private cache = new Map<string, CachedResponse>();
  private readonly maxSize = 1000;
  private readonly ttl = DEMO_CONFIG.ai.cacheTTL * 1000; // Convert to ms

  // Predefined responses for common queries in demo mode
  private readonly fallbackResponses: Record<string, string> = {
    menu: "Nasza restauracja oferuje szeroki wybór dań: pizze (35-72 zł), burgery (24-29 zł), tortille (24-29 zł), oraz różnorodne dodatki. Polecamy również nasze promocje: druga duża pizza za pół ceny!",
    hours: "Restauracja Stefano jest otwarta: Poniedziałek-Czwartek: 11:00-22:00, Piątek-Sobota: 11:00-23:00, Niedziela: 12:00-22:00",
    location: "Restauracja Stefano znajduje się przy ul. Kościuszki 11 w Bełchatowie. Oferujemy zarówno jedzenie na miejscu, jak i dostawę do domu.",
    delivery: "Oferujemy dostawę na terenie Bełchatowa i okolic. Minimalna kwota zamówienia to 35 zł. Czas dostawy wynosi zazwyczaj 30-45 minut.",
    reservation: "Aby zarezerwować stolik, możesz zadzwonić pod numer 516 166 180 lub skorzystać z formularza rezerwacji na naszej stronie.",
    payment: "Akceptujemy płatności gotówką, kartą oraz BLIK. W przypadku dostawy również płatność przy odbiorze.",
    loyalty: "Nasz program lojalnościowy oferuje 1 punkt za każde wydane 1 zł. Punkty można wymieniać na nagrody: darmowa kawa (50 pkt), zniżki i darmowe dania.",
    events: "Organizujemy imprezy okolicznościowe, urodziny, spotkania firmowe. Dysponujemy salą konferencyjną dla max 50 osób.",
    promotions: "Aktualne promocje: Druga duża pizza za pół ceny, Happy Hours 15:00-17:00 - 20% zniżki na napoje, Rodzinna niedziela - 10% zniżki dla rodzin."
  };

  // Generate cache key from prompt
  private generateKey(prompt: string): string {
    return createHash('md5').update(prompt.toLowerCase().trim()).digest('hex');
  }

  // Find best matching fallback response
  private findFallbackResponse(prompt: string): string | null {
    const lowercasePrompt = prompt.toLowerCase();
    
    // Check for keywords
    const keywordMap: Record<string, string[]> = {
      menu: ['menu', 'dania', 'pizza', 'burger', 'cena', 'cennik'],
      hours: ['godziny', 'otwarcia', 'otwarte', 'czynne', 'kiedy'],
      location: ['adres', 'gdzie', 'lokalizacja', 'dojazd'],
      delivery: ['dostawa', 'dowóz', 'zamówienie', 'dowieziecie'],
      reservation: ['rezerwacja', 'stolik', 'zarezerwować', 'booking'],
      payment: ['płatność', 'zapłacić', 'karta', 'gotówka', 'blik'],
      loyalty: ['program', 'lojalnościowy', 'punkty', 'karta stałego'],
      events: ['impreza', 'urodziny', 'wydarzenie', 'sala', 'konferencyjna'],
      promotions: ['promocja', 'rabat', 'zniżka', 'oferta', 'taniej']
    };

    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => lowercasePrompt.includes(keyword))) {
        return this.fallbackResponses[key];
      }
    }

    return null;
  }

  // Get cached response or null
  get(prompt: string): string | null {
    const key = this.generateKey(prompt);
    const cached = this.cache.get(key);

    if (!cached) {
      // Try fallback responses in demo mode
      if (DEMO_CONFIG.ai.fallbackResponses) {
        return this.findFallbackResponse(prompt);
      }
      return null;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    cached.hits++;
    return cached.response;
  }

  // Store response in cache
  set(prompt: string, response: string): void {
    const key = this.generateKey(prompt);

    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      hits: 0
    });
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    const validEntries = entries.filter(e => now - e.timestamp <= this.ttl);

    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      totalHits: entries.reduce((sum, e) => sum + e.hits, 0),
      hitRate: validEntries.length > 0 
        ? (entries.reduce((sum, e) => sum + e.hits, 0) / validEntries.length).toFixed(2) 
        : 0,
      memoryUsage: `${(JSON.stringify(Array.from(this.cache.entries())).length / 1024).toFixed(2)} KB`
    };
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const aiCache = new AIResponseCache();

// Wrapper for AI calls with caching
export async function getCachedAIResponse(
  prompt: string, 
  aiFunction: () => Promise<string>
): Promise<{ response: string; cached: boolean }> {
  // Check cache first
  const cached = aiCache.get(prompt);
  if (cached) {
    console.log(`[AI Cache] Hit for prompt: "${prompt.substring(0, 50)}..."`);
    return { response: cached, cached: true };
  }

  // In demo mode with no API key, use fallback
  if (DEMO_CONFIG.mode === 'demo' && !process.env.OPENAI_API_KEY) {
    const fallback = aiCache.get(prompt); // This will try fallback responses
    if (fallback) {
      return { response: fallback, cached: true };
    }
    return { 
      response: "Przepraszamy, asystent AI jest obecnie w trybie demo. Prosimy o kontakt telefoniczny: 516 166 180.", 
      cached: false 
    };
  }

  try {
    // Make actual AI call
    console.log(`[AI Cache] Miss for prompt: "${prompt.substring(0, 50)}..."`);
    const response = await aiFunction();
    
    // Cache the response
    aiCache.set(prompt, response);
    
    return { response, cached: false };
  } catch (error) {
    console.error('[AI Cache] Error calling AI:', error);
    
    // Try fallback response on error
    const fallback = aiCache.get(prompt);
    if (fallback) {
      return { response: fallback, cached: true };
    }
    
    throw error;
  }
}

// Cost tracking for AI usage
export class AICostTracker {
  private usage = {
    cached: 0,
    api: 0,
    fallback: 0
  };

  track(cached: boolean, fallback: boolean = false) {
    if (cached) {
      this.usage.cached++;
    } else if (fallback) {
      this.usage.fallback++;
    } else {
      this.usage.api++;
    }
  }

  getStats() {
    const total = this.usage.cached + this.usage.api + this.usage.fallback;
    const savingsRate = total > 0 ? ((this.usage.cached + this.usage.fallback) / total * 100).toFixed(2) : 0;
    
    return {
      totalRequests: total,
      cachedRequests: this.usage.cached,
      apiRequests: this.usage.api,
      fallbackRequests: this.usage.fallback,
      savingsRate: `${savingsRate}%`,
      estimatedCost: (this.usage.api * 0.002).toFixed(4), // ~$0.002 per request
      estimatedSavings: ((this.usage.cached + this.usage.fallback) * 0.002).toFixed(4)
    };
  }

  reset() {
    this.usage = { cached: 0, api: 0, fallback: 0 };
  }
}

export const aiCostTracker = new AICostTracker();