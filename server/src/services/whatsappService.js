const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
        ]
      }
    });

    this.isReady = false;

    this.client.on('qr', (qr) => {
      console.log('\n[WhatsApp] QR Code generated. Please scan:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', () => {
      console.log('[WhatsApp] Authenticated successfully!');
    });

    this.client.on('ready', () => {
      console.log('[WhatsApp] Client is READY and listening for messages! ✅');
      this.isReady = true;
    });

    this.client.on('auth_failure', (msg) => {
      console.error('[WhatsApp] Authentication failure:', msg);
    });

    this.client.on('loading_screen', (percent, message) => {
      console.log('[WhatsApp] Loading:', percent, '% -', message);
    });

    this.client.on('disconnected', (reason) => {
      console.log('[WhatsApp] Disconnected:', reason);
      this.isReady = false;
      this.client.initialize();
    });

    this.client.initialize().catch(err => console.error('[WhatsApp] Initialization error:', err));
  }

  async sendOTP(phone, otp) {
    const message = `*ERPSAA Security Check*\n\nYour OTP for account verification is: *${otp}*\n\nThis OTP is valid for 15 minutes. Please do not share it with anyone.`;
    return this.sendMessage(phone, message);
  }

  async sendSuccessNotification(phone, fullName, email) {
    const message = `*Welcome to ERPSAA!*\n\nHello *${fullName}*,\n\nYour account has been successfully verified.\n\n*Login Credentials:*\nEmail: ${email}\n\nYou can now proceed to complete your admission application.`;
    return this.sendMessage(phone, message);
  }

  async sendMessage(phone, message) {
    try {
      if (!this.isReady) {
        console.error('[WhatsApp] Client not ready yet');
        return false;
      }

      let formattedPhone = phone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
        formattedPhone = '91' + formattedPhone;
      }
      formattedPhone = formattedPhone + '@c.us';
      
      console.log(`[WhatsApp] Attempting to send message to: ${formattedPhone}`);
      await this.client.sendMessage(formattedPhone, message);
      console.log(`[WhatsApp] Message sent successfully to: ${formattedPhone}`);
      return true;
    } catch (error) {
      console.error(`[WhatsApp] Send error for ${phone}:`, error);
      return false;
    }
  }
}

module.exports = new WhatsAppService();
