// Twilio SMS Service for Restaurant Stefano
import { DEMO_CONFIG, isDemoMode, COST_LIMITS } from './demo-config';

interface TwilioConfig {
  accountSid?: string;
  authToken?: string;
  phoneNumber?: string;
}

interface SMSMessage {
  to: string;
  message: string;
  type?: 'verification' | 'order' | 'loyalty' | 'promotion';
}

class SMSService {
  private config: TwilioConfig;
  private isConfigured: boolean = false;
  private dailySMSCount: number = 0;
  private lastResetDate: Date = new Date();

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER
    };
    
    this.isConfigured = !!(this.config.accountSid && this.config.authToken && this.config.phoneNumber) || isDemoMode();
  }

  private resetDailyCounterIfNeeded() {
    const today = new Date();
    if (today.getDate() !== this.lastResetDate.getDate()) {
      this.dailySMSCount = 0;
      this.lastResetDate = today;
    }
  }

  async sendSMS(message: SMSMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    this.resetDailyCounterIfNeeded();

    // Check daily limit for demo mode
    if (this.dailySMSCount >= COST_LIMITS.sms.daily) {
      console.warn(`[SMS Service] Daily limit reached (${COST_LIMITS.sms.daily} SMS)`);
      return {
        success: false,
        error: `Daily SMS limit reached (${COST_LIMITS.sms.daily}/day in demo mode)`
      };
    }

    if (!this.isConfigured) {
      return {
        success: false,
        error: "SMS service not configured - missing Twilio credentials"
      };
    }

    // Demo mode - log to console instead of sending
    if (isDemoMode() && DEMO_CONFIG.sms.provider === 'console') {
      console.log('=== DEMO MODE: SMS Output ===');
      console.log(`To: ${message.to}`);
      console.log(`Message: ${message.message}`);
      console.log(`Type: ${message.type || 'general'}`);
      console.log(`From: ${this.config.phoneNumber || 'Stefano Restaurant'}`);
      console.log('============================');
      
      this.dailySMSCount++;
      
      return {
        success: true,
        messageId: `demo-sms-${Date.now()}`
      };
    }

    try {
      // Simulate Twilio API call structure
      const response = await this.twilioApiCall({
        to: message.to,
        from: this.config.phoneNumber!,
        body: message.message
      });

      this.dailySMSCount++;

      return {
        success: true,
        messageId: response.sid
      };
    } catch (error: any) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      };
    }
  }

  getUsageStats() {
    return {
      dailySent: this.dailySMSCount,
      dailyLimit: COST_LIMITS.sms.daily,
      monthlyLimit: COST_LIMITS.sms.monthly,
      remainingToday: Math.max(0, COST_LIMITS.sms.daily - this.dailySMSCount),
      costPerSMS: COST_LIMITS.sms.costPerSMS,
      estimatedMonthlyCost: 0 // Demo mode
    };
  }

  private async twilioApiCall(params: any): Promise<any> {
    if (!this.config.accountSid || !this.config.authToken) {
      throw new Error('Twilio credentials not configured');
    }

    // This would be the actual Twilio API call
    const auth = Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64');
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API error: ${error}`);
    }

    return await response.json();
  }

  // SMS Templates for Restaurant
  async sendWelcomeSMS(phone: string, name: string): Promise<{ success: boolean; error?: string }> {
    const message = `Witaj ${name}! 🎉 Dołączyłeś do programu lojalnościowego Stefano! Otrzymujesz 100 punktów startowych. Sprawdź swój profil na stefanogroup.pl/loyalty`;
    
    return await this.sendSMS({
      to: phone,
      message,
      type: 'loyalty'
    });
  }

  async sendOrderConfirmationSMS(phone: string, orderId: string, estimatedTime: string): Promise<{ success: boolean; error?: string }> {
    const message = `Stefano: Twoje zamówienie #${orderId} zostało przyjęte! ⏰ Szacowany czas przygotowania: ${estimatedTime}. Dziękujemy!`;
    
    return await this.sendSMS({
      to: phone,
      message,
      type: 'order'
    });
  }

  async sendOrderReadySMS(phone: string, orderId: string): Promise<{ success: boolean; error?: string }> {
    const message = `Stefano: Twoje zamówienie #${orderId} jest gotowe do odbioru! 🍕 Zapraszamy po odbiór. ul. Kościuszki, Bełchatów`;
    
    return await this.sendSMS({
      to: phone,
      message,
      type: 'order'
    });
  }

  async sendLoyaltyRewardSMS(phone: string, rewardName: string, code: string): Promise<{ success: boolean; error?: string }> {
    const message = `Stefano: Gratulacje! 🏆 Odblokowałeś nagrodę: ${rewardName}. Kod: ${code}. Ważny 30 dni. Pokaż kod przy odbiorze!`;
    
    return await this.sendSMS({
      to: phone,
      message,
      type: 'loyalty'
    });
  }

  async sendPromotionSMS(phone: string, promotion: string): Promise<{ success: boolean; error?: string }> {
    const message = `Stefano: Specjalna oferta! 🔥 ${promotion} Zamów przez stefanogroup.pl lub zadzwoń 51616618. Oferta ograniczona!`;
    
    return await this.sendSMS({
      to: phone,
      message,
      type: 'promotion'
    });
  }

  async sendVerificationCodeSMS(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
    const message = `Stefano: Twój kod weryfikacyjny: ${code}. Kod jest ważny przez 10 minut. Nie udostępniaj go nikomu.`;
    
    return await this.sendSMS({
      to: phone,
      message,
      type: 'verification'
    });
  }

  // Test SMS functionality
  async testSMS(phone: string): Promise<{ success: boolean; error?: string }> {
    const message = `Test SMS od Stefano Restaurant 🍕 System komunikacji działa poprawnie! stefanogroup.pl`;
    
    return await this.sendSMS({
      to: phone,
      message,
      type: 'verification'
    });
  }

  getStatus(): { configured: boolean; missing: string[] } {
    const missing = [];
    if (!this.config.accountSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!this.config.authToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!this.config.phoneNumber) missing.push('TWILIO_PHONE_NUMBER');

    return {
      configured: this.isConfigured,
      missing
    };
  }
}

export const smsService = new SMSService();
export { SMSService, SMSMessage };