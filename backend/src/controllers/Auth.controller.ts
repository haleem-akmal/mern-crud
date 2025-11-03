import { Request, Response } from 'express';
import UserService from '../services/UserService';
import EmailService from '../services/EmailService';

// EmailService only needs to be created once
// Since it's created with `new`, it's not a static class
const emailService = new EmailService();

// OOP Class for Controller
class AuthController {
  /**
   * Handles the user registration request
   * Method: POST
   * Path: /api/auth/register
   */
  public static async handleRegisterUser(req: Request, res: Response): Promise<Response> {
    try {
      // 1. First job of the controller: extract data from the request
      const { name, email, password } = req.body;

      // 2. Validation: check if required data is present
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // 3. Delegating task to the Service layer
      console.log('Controller: Calling UserService to register...');
      const newUser = await UserService.registerUser(name, email, password);

      // 4. Sending activation email (using real token)
      console.log('Controller: Calling EmailService to send activation email...');
      
      // Passing ID, name, and email from newUser to EmailService
      await emailService.sendActivationEmail({
        _id: String(newUser._id),
        name: newUser.name,
        email: newUser.email
      });
      
      // 5. Sending a response to the frontend
      return res.status(201).json({
        // Updated success message
        message: 'Registration successful! Please check your email to activate your account.',
        user: newUser, // user data is returned without the password
      });

    } catch (error: any) {
      // 6. Catching errors from the service layer
      console.error('Error in handleRegisterUser:', error.message);
      
      // Checking if the user already exists
      if (error.message.includes('User already exists')) {
        return res.status(409).json({ message: error.message }); // 409 = Conflict
      }

      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  /**
   * Handles the user login request
   * Method: POST
   * Path: /api/auth/login
   */
  public static async handleLoginUser(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Extract email and password from the request
      const { email, password } = req.body;

      // 2. Check if the data is received correctly
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // 3. Delegating work to the Service layer
      const { token, user } = await UserService.loginUser(email, password);

      // 4. Sending the token and user data to the frontend
      return res.status(200).json({
        message: 'Login successful',
        token: token,
        user: user,
      });
      
    } catch (error: any) {
      // 6. Handling errors from the service layer (e.g., incorrect password)
      console.error('Error in handleLoginUser:', error.message);

      // Catching 'Invalid email or password' type messages
      if (error.message.includes('Invalid') || error.message.includes('not activated')) {
        return res.status(401).json({ message: error.message }); // 401 = Unauthorized
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Handles account activation using the token from the email link
   * Method: GET
   * Path: /api/auth/activate/:token
   */
  public static async handleActivateAccount(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Extract the token from the URL
      const { token } = req.params;

      // 2. Delegating account activation work to UserService
      const activatedUser = await UserService.activateAccount(token);

      // 3. On success, sending a simple HTML response
      return res.status(200).send(`
        <html>
        <head><title>Account Activated</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px;">
          <h1 style="color: green;">✅ Account Activated Successfully!</h1>
          <p>Welcome back, ${activatedUser.name}!</p>
          <p>You can now close this page and login to the Hardware Inventory app.</p>
          <button onclick="window.close()" style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">Close Window</button>
        </body>
        </html>
      `);

    } catch (error: any) {
      console.error('Error during activation:', error.message);

      // Displaying error page if activation fails
      return res.status(400).send(`
        <html>
        <head><title>Activation Failed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px;">
          <h1 style="color: red;">❌ Account Activation Failed</h1>
          <p>Error: ${error.message}</p>
          <p>Please re-register or contact support.</p>
        </body>
        </html>
      `);
    }
  }

  /**
   * Handles the "forgot password" request
   * Method: POST
   * Path: /api/auth/forgot-password
   */
  public static async handleForgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // 1. Calling UserService
      const result = await UserService.requestPasswordReset(email);

      // 2. Sending email only if the user exists
      if (result) {
        const { user, resetToken } = result;
        // emailService instance is created above in this controller file
        await emailService.sendPasswordResetEmail(user, resetToken);
      }

      // 3. Respond with the same message regardless of existence (for security)
      return res.status(200).json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });

    } catch (error: any) {
      console.error('Error in handleForgotPassword:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Handles the actual password reset
   * Method: POST
   * Path: /api/auth/reset-password/:token
   */
  public static async handleResetPassword(req: Request, res: Response): Promise<Response> {
    try {
      // Token comes from URL parameters
      const { token } = req.params;
      // The new password comes from the request body
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }

      // 1. Calling UserService
      await UserService.resetPassword(token, password);

      // 2. Success message
      return res.status(200).json({
        message: 'Password reset successfully. You can now login.'
      });

    } catch (error: any) {
      console.error('Error in handleResetPassword:', error.message);
      
      // Handling token expired/invalid errors
      if (error.message.includes('expired') || error.message.includes('Invalid')) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default AuthController;
