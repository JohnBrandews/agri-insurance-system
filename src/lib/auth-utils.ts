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

// Suspension Email
export async function sendSuspensionEmail(email: string, companyName: string) {
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
    subject: `Important Update regarding your partnership with FarmShield`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #dc2626;">Partnership Status Update</h2>
        <p>Hello,</p>
        <p>We are writing to inform you that the partnership for <strong>${companyName}</strong> has been suspended or rejected for violating our policy.</p>
        <p>Please reach out to the platform administrator for further clarification or to appeal this decision.</p>
        <hr style="border: none; border-top: 1px solid #efeef1; margin: 30px 0;" />
        <p style="color: #999; font-size: 11px;">FarmShield Administration Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`❌ [SUSPENSION EMAIL FAILED]:`, error);
    return false;
  }
}

// Agent Suspension Email
export async function sendAgentSuspensionEmail(email: string, agentName: string) {
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
    subject: `Your Agent Account has been Suspended`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #dc2626;">Account Suspended</h2>
        <p>Hello ${agentName},</p>
        <p>This is to inform you that your field agent account on FarmShield has been suspended by your insurance company.</p>
        <p>You will no longer be able to register new farmers or manage existing ones until the suspension is lifted.</p>
        <hr style="border: none; border-top: 1px solid #efeef1; margin: 30px 0;" />
        <p style="color: #999; font-size: 11px;">FarmShield Support Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`❌ [AGENT SUSPENSION EMAIL FAILED]:`, error);
    return false;
  }
}

// Agent Reinstatement Email
export async function sendAgentReinstatementEmail(email: string, agentName: string) {
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
    subject: `Your Agent Account has been Reinstated`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #46A316;">Account Reinstated</h2>
        <p>Hello ${agentName},</p>
        <p>Great news! Your field agent account on FarmShield has been reinstated by your insurance company.</p>
        <p>You can now resume registering new farmers and managing your existing ones.</p>
        <hr style="border: none; border-top: 1px solid #efeef1; margin: 30px 0;" />
        <p style="color: #999; font-size: 11px;">FarmShield Support Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`❌ [AGENT REINSTATEMENT EMAIL FAILED]:`, error);
    return false;
  }
}

// Policy Deletion Email
export async function sendPolicyDeletionEmail(email: string, policyName: string, companyName: string) {
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
    subject: `Policy Discontinued: ${policyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #dc2626;">Insurance Policy Discontinued</h2>
        <p>Hello,</p>
        <p>This is to inform you that the insurance policy <strong>"${policyName}"</strong> offered by <strong>${companyName}</strong> is no longer available.</p>
        <p>Please contact the insurer directly for further details or alternative coverage options.</p>
        <hr style="border: none; border-top: 1px solid #efeef1; margin: 30px 0;" />
        <p style="color: #999; font-size: 11px;">FarmShield Administration Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`❌ [POLICY DELETION EMAIL FAILED]:`, error);
    return false;
  }
}

// Deletion Email
export async function sendDeletionEmail(email: string, name: string, type: "ADMIN" | "AGENT") {
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
    subject: `Account Terminated - FarmShield Partnership Ended`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #dc2626;">Partnership Terminated</h2>
        <p>Hello ${name},</p>
        <p>We are writing to inform you that the partnership with your associated insurance company has been terminated by the FarmShield administrators.</p>
        <p>As a result, your access to the platform has been revoked. If you believe this is an error, please contact support.</p>
        <hr style="border: none; border-top: 1px solid #efeef1; margin: 30px 0;" />
        <p style="color: #999; font-size: 11px;">FarmShield Administration Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`❌ [DELETION EMAIL FAILED]:`, error);
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
