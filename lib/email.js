import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("Warning: RESEND_API_KEY not set. Email sending will fail.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send verification email with token
 */
export async function sendVerificationEmail(email, verificationToken) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verify-email?token=${verificationToken}`;

  try {
    const result = await resend.emails.send({
      from: "NeuroLensAI <onboarding@resend.dev>",
      to: email,
      subject: "Verify your NeuroLensAI email",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background-color: #f5f5f5;
                color: #222831;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 28px;
                font-weight: 900;
                background: linear-gradient(135deg, #00ADB5 0%, #0088a0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .content {
                text-align: center;
                margin-bottom: 30px;
              }
              h1 {
                font-size: 24px;
                margin: 0 0 10px 0;
                color: #222831;
              }
              .subtitle {
                font-size: 14px;
                color: #393E46;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                background-color: #00ADB5;
                color: white;
                text-decoration: none;
                padding: 12px 32px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
              }
              .button:hover {
                background-color: #0088a0;
              }
              .divider {
                border-top: 1px solid #e0e0e0;
                margin: 30px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #393E46;
              }
              .footer a {
                color: #00ADB5;
                text-decoration: none;
              }
              .code-block {
                background-color: #f5f5f5;
                padding: 15px;
                border-radius: 6px;
                word-break: break-all;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #222831;
                margin: 20px 0;
              }
              .trust-badge {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
                font-size: 12px;
                color: #393E46;
              }
              .badge {
                display: flex;
                align-items: center;
                gap: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">NeuroLensAI</div>
              </div>

              <div class="content">
                <h1>Verify Your Email</h1>
                <p class="subtitle">Welcome to NeuroLensAI! Click below to verify your email address and activate your account.</p>
                
                <a href="${verificationUrl}" class="button">Verify Email Address</a>

                <p class="subtitle">Or copy and paste this link in your browser:</p>
                <div class="code-block">${verificationUrl}</div>
              </div>

              <div class="divider"></div>

              <div class="footer">
                <p>This verification link will expire in 24 hours.</p>
                <p>If you didn't create this account, you can safely ignore this email.</p>
                <p style="margin-top: 20px;">
                  Questions? <a href="mailto:support@neurolensai.com">Contact support</a>
                </p>
              </div>

              <div class="trust-badge">
                <span class="badge">✓ HIPAA Compliant</span>
                <span class="badge">✓ End-to-End Encrypted</span>
                <span class="badge">✓ AI Explainable</span>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return result;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email, userName) {
  try {
    const result = await resend.emails.send({
      from: "NeuroLensAI <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to NeuroLensAI",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background-color: #f5f5f5;
                color: #222831;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 28px;
                font-weight: 900;
                background: linear-gradient(135deg, #00ADB5 0%, #0088a0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .content {
                text-align: center;
                margin-bottom: 30px;
              }
              h1 {
                font-size: 24px;
                margin: 0 0 10px 0;
                color: #222831;
              }
              .button {
                display: inline-block;
                background-color: #00ADB5;
                color: white;
                text-decoration: none;
                padding: 12px 32px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
              }
              .button:hover {
                background-color: #0088a0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">NeuroLensAI</div>
              </div>

              <div class="content">
                <h1>Welcome, ${email}!</h1>
                <p>Your email has been verified and your account is ready to use.</p>
                <p>You can now sign in and start exploring NeuroLensAI's advanced AI diagnostic platform.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login" class="button">Sign In to Dashboard</a>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return result;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
}
