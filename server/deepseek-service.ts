import { aiCache } from "./ai-cache";

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class DeepSeekService {
  private apiKey: string | undefined;
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  private model = 'deepseek-chat';
  private fallbackResponses: Record<string, string> = {
    menu: "🍕 Nasze menu z cenami:\n\n🍔 BURGERY (24-29 zł)\n🌯 TORTILLA (24-29 zł)\n🍕 PIZZA (46-72 zł) - PROMOCJA: druga duża pizza za pół ceny!\n🍟 DODATKI (4-12 zł)\n\nPełne menu dostępne na stronie lub w zakładce Menu.",
    hours: "🕐 Jesteśmy otwarci:\n• Poniedziałek-Środa: 15:00-21:00\n• Czwartek-Sobota: 15:00-24:00\n• Niedziela: 13:00-22:00",
    location: "📍 Znajdziesz nas: ul. Kościuszki 12, 97-400 Bełchatów\n📞 Telefon: 517-616-618\n🚗 Dostępny parking",
    delivery: "🚚 Dostawa na terenie Bełchatowa i okolic\n💰 Minimalne zamówienie: 35 zł\n⏱️ Czas dostawy: 30-45 minut\n💳 Płatność: gotówka, karta, BLIK",
    reservation: "📅 Rezerwacja stolika:\n📞 Zadzwoń: 517-616-618\n✉️ Email: stefano@stefanogroup.pl\n💬 Lub napisz tutaj, a przekażemy informację!",
    promotions: "🎉 Aktualne promocje:\n• 🍕 Druga duża pizza za pół ceny!\n• 🕐 Happy Hours 15:00-17:00 - 20% na napoje\n• 👨‍👩‍👧‍👦 Rodzinna niedziela - 10% dla rodzin\n• 🎮 Wtorki z grami planszowymi - 15% zniżki",
    default: "Witaj w Restauracji Stefano! 🍕 Jak mogę Ci pomóc? Mogę opowiedzieć o menu, godzinach otwarcia, dostawie lub pomóc w rezerwacji."
  };

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    if (!this.apiKey) {
      console.log('DeepSeek API key not found - using fallback responses');
    }
  }

  private getSystemPrompt(): string {
    return `Jesteś asystentem restauracji Stefano w Bełchatowie. Twoje zadania:
    
1. Informuj o menu i cenach:
   - Burgery: 24-29 zł (Classic Chicken, Big King)
   - Tortilla: 24-29 zł (Vege, Classic, Power)
   - Pizza: 46-72 zł (Mexicana, Italiana, Gusto, Melbourne, Fantasia del Mare)
   - Dodatki: 4-12 zł (frytki, krążki cebulowe, sosy)
   - PROMOCJA: Druga duża pizza za pół ceny!

2. Godziny otwarcia:
   - Poniedziałek-Środa: 15:00-21:00
   - Czwartek-Sobota: 15:00-24:00
   - Niedziela: 13:00-22:00

3. Kontakt i lokalizacja:
   - Adres: ul. Kościuszki 12, 97-400 Bełchatów
   - Telefon: 517-616-618
   - Email: stefano@stefanogroup.pl

4. Dostawa: minimum 35 zł, 30-45 minut, płatność: gotówka/karta/BLIK

5. Organizujemy: imprezy rodzinne, firmowe, komunie, urodziny, wieczory z grami planszowymi

Odpowiadaj krótko, przyjaźnie, używaj emoji. Zawsze zachęcaj do zamówienia lub rezerwacji.`;
  }

  private findFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('menu') || lowerMessage.includes('cen') || lowerMessage.includes('pizza') || lowerMessage.includes('burger')) {
      return this.fallbackResponses.menu;
    }
    if (lowerMessage.includes('godzin') || lowerMessage.includes('otwar') || lowerMessage.includes('czynne')) {
      return this.fallbackResponses.hours;
    }
    if (lowerMessage.includes('adres') || lowerMessage.includes('gdzie') || lowerMessage.includes('lokalizac')) {
      return this.fallbackResponses.location;
    }
    if (lowerMessage.includes('dostaw') || lowerMessage.includes('dowóz') || lowerMessage.includes('dowoz')) {
      return this.fallbackResponses.delivery;
    }
    if (lowerMessage.includes('rezerwac') || lowerMessage.includes('stolik')) {
      return this.fallbackResponses.reservation;
    }
    if (lowerMessage.includes('promocj') || lowerMessage.includes('rabat') || lowerMessage.includes('zniżk')) {
      return this.fallbackResponses.promotions;
    }
    
    return this.fallbackResponses.default;
  }

  async getChatResponse(message: string, conversationHistory: DeepSeekMessage[] = []): Promise<string> {
    // Check cache first
    const cachedResponse = aiCache.get(message);
    if (cachedResponse) {
      console.log('Returning cached response');
      return cachedResponse;
    }

    // If no API key, use fallback
    if (!this.apiKey) {
      console.log('Using fallback response (no API key)');
      const fallback = this.findFallbackResponse(message);
      aiCache.set(message, fallback);
      return fallback;
    }

    try {
      // Prepare messages
      const messages: DeepSeekMessage[] = [
        { role: 'system', content: this.getSystemPrompt() },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      // Call DeepSeek API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        console.error('DeepSeek API error:', response.status, response.statusText);
        const fallback = this.findFallbackResponse(message);
        return fallback;
      }

      const data: DeepSeekResponse = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        
        // Cache the response
        aiCache.set(message, reply);
        
        // Log usage if available
        if (data.usage) {
          console.log(`DeepSeek usage - Tokens: ${data.usage.total_tokens} (prompt: ${data.usage.prompt_tokens}, completion: ${data.usage.completion_tokens})`);
        }
        
        return reply;
      }

      // Fallback if no response
      return this.findFallbackResponse(message);

    } catch (error) {
      console.error('DeepSeek API error:', error);
      // Use fallback response on error
      const fallback = this.findFallbackResponse(message);
      aiCache.set(message, fallback);
      return fallback;
    }
  }

  getStatus() {
    return {
      provider: 'DeepSeek',
      model: this.model,
      apiKeyConfigured: !!this.apiKey,
      cacheStats: aiCache.getStats(),
      fallbackMode: !this.apiKey
    };
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const deepseekService = new DeepSeekService();