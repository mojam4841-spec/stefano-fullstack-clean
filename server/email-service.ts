// SendGrid Email Service for Restaurant Stefano
import { DEMO_CONFIG, isDemoMode, COST_LIMITS } from './demo-config';

interface EmailConfig {
  apiKey?: string;
  fromEmail: string;
  fromName: string;
}

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  templateData?: any;
}

class EmailService {
  private config: EmailConfig;
  private isConfigured: boolean = false;
  private dailyEmailCount: number = 0;
  private lastResetDate: Date = new Date();

  constructor() {
    this.config = {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: 'noreply@stefanogroup.pl',
      fromName: 'Restaurant Stefano'
    };
    
    this.isConfigured = !!this.config.apiKey || isDemoMode();
  }

  private resetDailyCounterIfNeeded() {
    const today = new Date();
    if (today.getDate() !== this.lastResetDate.getDate()) {
      this.dailyEmailCount = 0;
      this.lastResetDate = today;
    }
  }

  async sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    this.resetDailyCounterIfNeeded();

    // Check daily limit for free tier
    if (this.dailyEmailCount >= COST_LIMITS.email.daily) {
      console.warn(`[Email Service] Daily limit reached (${COST_LIMITS.email.daily} emails)`);
      return {
        success: false,
        error: `Daily email limit reached (${COST_LIMITS.email.daily}/day in free tier)`
      };
    }

    if (!this.isConfigured) {
      return {
        success: false,
        error: "Email service not configured - missing SendGrid API key"
      };
    }

    // Demo mode - log to console instead of sending
    if (isDemoMode() && DEMO_CONFIG.email.provider === 'console') {
      console.log('=== DEMO MODE: Email Output ===');
      console.log(`To: ${message.to}`);
      console.log(`Subject: ${message.subject}`);
      console.log(`From: ${this.config.fromName} <${this.config.fromEmail}>`);
      console.log('Content:');
      console.log(message.html);
      console.log('===============================');
      
      this.dailyEmailCount++;
      
      return {
        success: true,
        messageId: `demo-${Date.now()}`
      };
    }

    try {
      const response = await this.sendGridApiCall({
        personalizations: [{
          to: [{ email: message.to }],
          ...(message.templateData && { dynamic_template_data: message.templateData })
        }],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName
        },
        subject: message.subject,
        content: [{
          type: 'text/html',
          value: message.html
        }],
        ...(message.templateId && { template_id: message.templateId })
      });

      this.dailyEmailCount++;

      return {
        success: true,
        messageId: response.messageId
      };
    } catch (error: any) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }
  }

  getUsageStats() {
    return {
      dailySent: this.dailyEmailCount,
      dailyLimit: COST_LIMITS.email.daily,
      monthlyLimit: COST_LIMITS.email.monthly,
      remainingToday: Math.max(0, COST_LIMITS.email.daily - this.dailyEmailCount),
      costPerEmail: COST_LIMITS.email.costPerEmail,
      estimatedMonthlyCost: 0 // Free tier
    };
  }

  private async sendGridApiCall(payload: any): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${error}`);
    }

    return { messageId: response.headers.get('x-message-id') };
  }

  // Email Templates for Restaurant
  async sendWelcomeEmail(to: string, name: string, loyaltyData: any): Promise<{ success: boolean; error?: string }> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #DC2626, #F59E0B); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #ffffff; }
            .footer { background: #1F2937; color: white; padding: 20px; text-align: center; }
            .avatar { width: 80px; height: 80px; margin: 20px auto; }
            .points { background: #FEF3C7; border: 2px solid #F59E0B; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Witaj w Stefano!</h1>
                <p>Dołączyłeś do ekskluzywnego programu lojalnościowego</p>
            </div>
            <div class="content">
                <h2>Cześć ${name}!</h2>
                <p>Gratulacje! Właśnie dołączyłeś do programu lojalnościowego Restaurant Stefano w Bełchatowie.</p>
                
                <div class="points">
                    <h3>🏆 Bonus powitalny: 100 punktów!</h3>
                    <p>Twój profil klienta: ${loyaltyData.customerType || 'Standard'}</p>
                    <p>Aktualny poziom: ${loyaltyData.tier || 'Bronze'}</p>
                </div>
                
                <h3>Co możesz robić z punktami:</h3>
                <ul>
                    <li>🍕 Zamawiaj jedzenie i zbieraj punkty (1 punkt = 1 zł)</li>
                    <li>🎁 Wymieniaj punkty na nagrody i zniżki</li>
                    <li>⚡ Otrzymuj ekskluzywne promocje</li>
                    <li>👑 Awansuj do wyższych poziomów (Silver, Gold, Platinum)</li>
                </ul>
                
                <p style="text-align: center; margin: 30px 0;">
                    <a href="https://stefanogroup.pl/loyalty" style="background: #DC2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Sprawdź swój profil
                    </a>
                </p>
            </div>
            <div class="footer">
                <p>Restaurant Stefano | ul. Kościuszki, Bełchatów | Tel: 51 616 618</p>
                <p>stefanogroup.pl</p>
            </div>
        </div>
    </body>
    </html>`;

    return await this.sendEmail({
      to,
      subject: '🎉 Witaj w programie lojalnościowym Stefano!',
      html
    });
  }

  async sendOrderConfirmationEmail(to: string, orderData: any): Promise<{ success: boolean; error?: string }> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #ffffff; }
            .order-summary { background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .total { background: #FEF3C7; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Zamówienie potwierdzone!</h1>
                <p>Zamówienie #${orderData.id}</p>
            </div>
            <div class="content">
                <h2>Dziękujemy za zamówienie!</h2>
                
                <div class="order-summary">
                    <h3>Szczegóły zamówienia:</h3>
                    <p><strong>Numer:</strong> #${orderData.id}</p>
                    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
                    <p><strong>Szacowany czas:</strong> ${orderData.estimatedTime || '30-45 min'}</p>
                    <p><strong>Metoda płatności:</strong> ${orderData.paymentMethod || 'Gotówka'}</p>
                </div>
                
                <div class="total">
                    <h3>Suma: ${(orderData.amount / 100).toFixed(2)} zł</h3>
                    <p>Zdobyte punkty: ${Math.floor(orderData.amount / 100)} pkt</p>
                </div>
                
                <p>Twoje zamówienie zostało przekazane do kuchni. Otrzymasz SMS gdy będzie gotowe do odbioru.</p>
                
                <p style="text-align: center;">
                    <strong>Restaurant Stefano</strong><br>
                    ul. Kościuszki, Bełchatów<br>
                    Tel: 51 616 618
                </p>
            </div>
        </div>
    </body>
    </html>`;

    return await this.sendEmail({
      to,
      subject: `✅ Potwierdzenie zamówienia #${orderData.id} - Stefano`,
      html
    });
  }

  async sendNewsletterEmail(to: string, campaign: any): Promise<{ success: boolean; error?: string }> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #DC2626, #F59E0B); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #ffffff; }
            .promotion { background: #FEF3C7; border: 2px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .menu-item { display: inline-block; width: 45%; margin: 10px; padding: 15px; border: 1px solid #E5E7EB; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍕 Nowości w Stefano!</h1>
                <p>${campaign.title}</p>
            </div>
            <div class="content">
                <div class="promotion">
                    <h2>🔥 Dzisiejsza promocja!</h2>
                    <h3>ZAMÓW DUŻĄ PIZZĘ - DRUGA ZA PÓŁ CENY!</h3>
                    <p>Oferta ważna tylko dziś. Użyj kodu: <strong>PIZZA50</strong></p>
                </div>
                
                <h3>Nasze hity:</h3>
                <div style="text-align: center;">
                    <div class="menu-item">
                        <h4>🍕 Pizza Stefano</h4>
                        <p>Nasza autorska pizza</p>
                        <strong>od 46 zł</strong>
                    </div>
                    <div class="menu-item">
                        <h4>🍔 Burger Classic</h4>
                        <p>Soczysty burger wołowy</p>
                        <strong>od 24 zł</strong>
                    </div>
                </div>
                
                <p style="text-align: center; margin: 30px 0;">
                    <a href="https://stefanogroup.pl" style="background: #DC2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Zamów teraz!
                    </a>
                </p>
                
                <p style="font-size: 12px; color: #6B7280; text-align: center;">
                    Jeśli nie chcesz otrzymywać newslettera, <a href="#">wypisz się tutaj</a>
                </p>
            </div>
        </div>
    </body>
    </html>`;

    return await this.sendEmail({
      to,
      subject: campaign.subject || '🍕 Nowości i promocje w Stefano!',
      html
    });
  }

  async sendLoyaltyRewardEmail(to: string, reward: any): Promise<{ success: boolean; error?: string }> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #7C3AED, #F59E0B); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #ffffff; }
            .reward { background: #FEF3C7; border: 2px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .code { font-size: 24px; font-weight: bold; background: #DC2626; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏆 Gratulacje!</h1>
                <p>Odblokowałeś nową nagrodę!</p>
            </div>
            <div class="content">
                <div class="reward">
                    <h2>🎁 ${reward.name}</h2>
                    <p>${reward.description}</p>
                    
                    <div class="code">${reward.code}</div>
                    
                    <p><strong>Ważność:</strong> 30 dni od otrzymania</p>
                    <p>Pokaż ten kod przy odbiorze w restauracji lub użyj podczas zamawiania online.</p>
                </div>
                
                <p>Dziękujemy za lojalność! Kontynuuj zbieranie punktów aby odblokować więcej nagród.</p>
                
                <p style="text-align: center; margin: 30px 0;">
                    <a href="https://stefanogroup.pl/loyalty" style="background: #7C3AED; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Zobacz swój profil
                    </a>
                </p>
            </div>
        </div>
    </body>
    </html>`;

    return await this.sendEmail({
      to,
      subject: `🏆 Nowa nagroda: ${reward.name} - Stefano`,
      html
    });
  }

  async testEmail(to: string): Promise<{ success: boolean; error?: string }> {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #DC2626; color: white; padding: 20px; text-align: center;">
            <h1>🍕 Test Email - Stefano</h1>
        </div>
        <div style="padding: 30px;">
            <h2>System email działa poprawnie!</h2>
            <p>To jest wiadomość testowa z Restaurant Stefano.</p>
            <p>Jeśli otrzymujesz tę wiadomość, oznacza to że konfiguracja SendGrid jest prawidłowa.</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="https://stefanogroup.pl" style="background: #DC2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
                    Odwiedź naszą stronę
                </a>
            </p>
        </div>
        <div style="background: #1F2937; color: white; padding: 20px; text-align: center;">
            <p>Restaurant Stefano | ul. Kościuszki, Bełchatów | Tel: 51 616 618</p>
        </div>
    </body>
    </html>`;

    return await this.sendEmail({
      to,
      subject: '🍕 Test Email - Restaurant Stefano',
      html
    });
  }

  getStatus(): { configured: boolean; missing: string[] } {
    const missing = [];
    if (!this.config.apiKey) missing.push('SENDGRID_API_KEY');

    return {
      configured: this.isConfigured,
      missing
    };
  }
}

export const emailService = new EmailService();
export { EmailService, EmailMessage };