import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  /**
   * Handles getting the logged-in user's profile
   * Method: GET
   * Path: /api/users/profile
   */
  public static async handleGetUserProfile(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Controller task: extract data from the request
      //    'req.user' is provided by the authMiddleware (Gatekeeper).
      const userId = req.user.userId;

      // 2. Delegate work to the Service layer
      const userProfile = await UserService.getUserProfile(userId);

      // 3. Send the response to the frontend
      return res.status(200).json(userProfile);

    } catch (error: any) {
      console.error('Error in handleGetUserProfile:', error.message);
      if (error.message.includes('User not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Handles updating the logged-in user's profile
   * Method: PUT
   * Path: /api/users/profile
   */
  public static async handleUpdateUserProfile(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Extract incoming data from the request
      const userId = req.user.userId;
      const { name } = req.body; // 'name' from form-data
      const file = req.file;     // 'profileImage' from Multer

      // 2. Delegate work to the Service layer
      const updatedUser = await UserService.updateUserProfile(userId, name, file);

      // 3. Send the updated result to the frontend
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });

    } catch (error: any) {
      console.error('Error in handleUpdateUserProfile:', error.message);
      if (error.message.includes('User not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default UserController;
