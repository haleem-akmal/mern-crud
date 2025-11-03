import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

class EmailService {
  private transporter: Transporter;

  constructor() {
    // Create the Nodemailer transporter
    // Get credentials from the .env file
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports (like 587)
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });
  }

  /**
   * Method to send an email
   * @param to - Recipient of the email (e.g., 'user@example.com')
   * @param subject - Subject of the email (e.g., 'Activate Your Account')
   * @param html - Email content (e.g., '<h1>Click here</h1>')
   */
  public async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Hardware Shop" <${process.env.EMAIL_USER}>`, // Sender
        to: to,
        subject: subject,
        html: html, // HTML body
      };

      // Send the email
      const info = await this.transporter.sendMail(mailOptions);

      console.log('Message sent: %s', info.messageId);

      // Ethereal provides a preview link to view the sent email
      // You can click this link to see how the email looks
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send email.');
    }
  }

  /**
   * Method to send an activation link to a new user
   */
  public async sendActivationEmail(user: { _id: string, name: string, email: string }) {
    try {
      // 1. Create an activation token
      //    Uses the User ID and our new ACTIVATION_SECRET.
      const activationToken = jwt.sign(
        { userId: user._id }, // Put the user ID inside the token
        process.env.JWT_ACTIVATION_SECRET!, // Our secret from .env
        { expiresIn: '15m' } // The link will work only for 15 minutes
      );

      // 2. Construct the activation URL (using the frontend or backend URL)
      //    (Port 5173 is the default for Vite)
      const activationLink = `${process.env.BACKEND_URL}/api/auth/activate/${activationToken}`;

      // 3. Email content (HTML)
      const subject = 'Activate Your Hardware Shop Account';
      const html = `
        <h1>Welcome, ${user.name}!</h1>
        <p>Thank you for registering. Please click the link below to activate your account within 15 minutes:</p>
        <a 
          href="${activationLink}" 
          style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;"
        >
          Activate Now
        </a>
        <p>If you did not request this, please ignore this email.</p>
      `;

      // 4. Use the existing sendMail method to send the email
      await this.sendMail(user.email, subject, html);
      
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw new Error('Could not send activation email.');
    }
  }

  /**
   * Method to send a password reset link
   */
  public async sendPasswordResetEmail(user: { name: string, email: string }, resetToken: string) {
    try {
      // 1. This is the FRONTEND URL. The user will click this link.
      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

      // 2. Email HTML content
      const subject = 'Reset Your Hardware Shop Password';
      const html = `
        <h1>Hello, ${user.name}!</h1>
        <p>Someone requested a password reset for your account.</p>
        <p>Click the link below to reset your password. This link is valid for 10 minutes:</p>
        <a 
          href="${resetLink}" 
          style="background-color: #ffc107; color: black; padding: 10px 15px; text-decoration: none; border-radius: 5px;"
        >
          Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
      `;

      // 3. Send the email
      await this.sendMail(user.email, subject, html);
      
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Could not send password reset email.');
    }
  }
}

export default EmailService;
