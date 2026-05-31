const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  /**
   * @desc Get or initialize Nodemailer transporter (cached)
   */
  async getTransporter() {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Check if the user has filled SMTP credentials in the environment
    const isRealConfigSet = user && pass &&
      !user.includes('your_email') &&
      !pass.includes('your_gmail_app_password');

    if (isRealConfigSet) {
      console.log('[EmailService] Initializing with custom SMTP settings...');
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465, // true for SSL (465), false for STARTTLS (587)
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      console.log('[EmailService] SMTP credentials are not configured. Creating Ethereal Sandbox Account...');
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log('[EmailService] Ethereal Sandbox created successfully. Credentials generated.');
      } catch (err) {
        console.error('[EmailService] Error creating Ethereal Sandbox account:', err.message);
        throw err;
      }
    }

    return this.transporter;
  }

  /**
   * @desc Send payment success notification with a state-of-the-art HTML receipt
   * @param {string} toEmail - Recipient email address
   * @param {object} details - Transaction receipt details
   */
  async sendPaymentSuccessEmail(toEmail, details) {
    try {
      const transporter = await this.getTransporter();

      const {
        studentName,
        studentId,
        amount,
        transactionId,
        receiptNumber,
        paymentDate,
        paymentDescription
      } = details;

      // Format currency in INR
      const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
      }).format(amount);

      // Format date beautifully
      const formattedDate = new Date(paymentDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const fromAddress = process.env.EMAIL_FROM || '"ERPSAA Fee Desk" <noreply@erpsaa.com>';

      const mailOptions = {
        from: fromAddress,
        to: toEmail,
        subject: `🎉 Payment Successful! Receipt #${receiptNumber} - ERPSAA Fee Portal`,
        text: `Hello ${studentName},\n\nYour payment of ${formattedAmount} for "${paymentDescription}" has been successfully completed.\n\nTransaction Summary:\n- Student Name: ${studentName}\n- Student ID: ${studentId}\n- Transaction ID: ${transactionId}\n- Receipt Number: ${receiptNumber}\n- Date: ${formattedDate}\n\nThank you for your payment.\n\nBest regards,\nERPSAA Accounts Department`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful - Receipt #${receiptNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 32px;
      text-align: center;
    }
    .logo-text {
      color: #38bdf8;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 0 0 8px 0;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    .content {
      padding: 40px 32px;
    }
    .success-icon-container {
      text-align: center;
      margin-bottom: 24px;
    }
    .success-icon {
      display: inline-block;
      width: 64px;
      height: 64px;
      line-height: 64px;
      border-radius: 50%;
      background-color: #ecfdf5;
      color: #10b981;
      font-size: 32px;
      text-align: center;
    }
    .welcome-text {
      font-size: 16px;
      line-height: 1.6;
      color: #475569;
      margin: 0 0 28px 0;
    }
    .welcome-text strong {
      color: #0f172a;
    }
    .amount-badge {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 1px solid #a7f3d0;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin-bottom: 32px;
    }
    .amount-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #065f46;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .amount-value {
      font-size: 36px;
      font-weight: 800;
      color: #047857;
      margin: 0;
    }
    .receipt-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    .receipt-row {
      border-bottom: 1px solid #f1f5f9;
    }
    .receipt-row:last-child {
      border-bottom: none;
    }
    .receipt-label {
      padding: 14px 0;
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
      width: 40%;
    }
    .receipt-value {
      padding: 14px 0;
      font-size: 14px;
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }
    .button-container {
      text-align: center;
      margin-bottom: 8px;
    }
    .btn {
      display: inline-block;
      background-color: #0f172a;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.15);
      transition: all 0.2s ease-in-out;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px;
      text-align: center;
      border-top: 1px solid #f1f5f9;
    }
    .footer-text {
      font-size: 12px;
      line-height: 1.5;
      color: #94a3b8;
      margin: 0 0 12px 0;
    }
    .footer-link {
      color: #0f172a;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Premium Institutional Header -->
      <div class="header">
        <div class="logo-text">Institutional Ledger Desk</div>
        <h1>ERPSAA FEE PORTAL</h1>
      </div>

      <!-- Main Receipt Body -->
      <div class="content">
        <div class="success-icon-container">
          <div class="success-icon">✓</div>
        </div>

        <p class="welcome-text">
          Dear <strong>${studentName}</strong>, <br/><br/>
          Your online payment has been successfully cleared and posted to your institutional ledger. A summary of your transaction is detailed below.
        </p>

        <!-- Bold Amount Callout Banner -->
        <div class="amount-badge">
          <div class="amount-label">Amount Cleared Successfully</div>
          <div class="amount-value">${formattedAmount}</div>
        </div>

        <!-- Professional Transaction Summary -->
        <table class="receipt-table">
          <tr class="receipt-row">
            <td class="receipt-label">Student Name</td>
            <td class="receipt-value">${studentName}</td>
          </tr>
          <tr class="receipt-row">
            <td class="receipt-label">Student ID</td>
            <td class="receipt-value">${studentId}</td>
          </tr>
          <tr class="receipt-row">
            <td class="receipt-label">Transaction ID</td>
            <td class="receipt-value" style="font-family: monospace; font-size: 13px;">${transactionId}</td>
          </tr>
          <tr class="receipt-row">
            <td class="receipt-label">Receipt Number</td>
            <td class="receipt-value" style="font-family: monospace; font-size: 13px; color: #0284c7;">${receiptNumber}</td>
          </tr>
          <tr class="receipt-row">
            <td class="receipt-label">Description</td>
            <td class="receipt-value">${paymentDescription}</td>
          </tr>
          <tr class="receipt-row">
            <td class="receipt-label">Payment Date</td>
            <td class="receipt-value">${formattedDate}</td>
          </tr>
          <tr class="receipt-row">
            <td class="receipt-label">Payment Method</td>
            <td class="receipt-value">Stripe Sandbox Online Card</td>
          </tr>
        </table>

        <!-- Styled CTA Button -->
        <div class="button-container">
          <a href="https://erpsaa-frontend.vercel.app/app/student/fees" class="btn">View Fee Portal</a>
        </div>
      </div>

      <!-- Professional Footer -->
      <div class="footer">
        <p class="footer-text">
          This email contains a digital, system-generated payment receipt and serves as official proof of payment. Please keep this copy for your academic records.
        </p>
        <p class="footer-text" style="margin-bottom: 0;">
          Need assistance? Contact our accounts helpline or visit the <a href="https://erpsaa-frontend.vercel.app" class="footer-link">ERPSAA Support Desk</a>.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] 🚀 Receipt successfully sent to ${toEmail}. Message ID: ${info.messageId}`);

      // If Ethereal Sandbox was used, print the mock email preview link to the backend console
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('\n========================================================================');
        console.log('📧  [EmailService Sandbox Alert]');
        console.log(`An email was successfully dispatched to Ethereal sandbox!`);
        console.log(`Click this link to preview the stunning HTML receipt in your browser:`);
        console.log(`👉 \x1b[36m%s\x1b[0m`, previewUrl);
        console.log('========================================================================\n');
      }

      return { success: true, messageId: info.messageId, previewUrl };
    } catch (err) {
      console.error('[EmailService] ❌ Failed to dispatch receipt email:', err.message);
      return { success: false, error: err.message };
    }
  }
}

module.exports = new EmailService();
