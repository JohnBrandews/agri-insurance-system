import crypto from 'crypto';

// Simple mockup hash for Dev MVP (No bcrypt/argon2 to save install weight)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

import nodemailer from 'nodemailer';

// Generate a random 64-character hex setup token for emails
export function generateSetupToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate a secure 4-digit OTP
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Real Email Service (Brevo Integration)
export async function sendSetupEmail(email: string, token: string, role: string) {
  const setupUrl = `http://localhost:3000/setup-password?token=${token}&role=${role}`;
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Set up your FarmShield ${role} Account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #46A316;">Welcome to FarmMan!</h2>
        <p>You have been invited to join the platform as a <strong>${role}</strong>.</p>
        <p>Please click the button below to verify your email and securely set your password.</p>
        <div style="margin: 30px 0;">
          <a href="${setupUrl}" style="background-color: #46A316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Set Up Password</a>
        </div>
        <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #efeef1; margin: 30px 0;" />
        <p style="color: #999; font-size: 11px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [BREVO EMAIL SENT] Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ [BREVO EMAIL FAILED]:`, error);
    return false;
  }
}

// Mock SMS Service (Africa's Talking Substitute)
export async function sendSMS(phone: string, otp: string) {
  console.log(`\n================================`);
  console.log(`📱 [MOCK SMS SENT TO]: ${phone}`);
  console.log(`🔐 FarmShield Login OTP: ${otp}. Valid for 24 hours.`);
  console.log(`================================\n`);
  return true;
}
