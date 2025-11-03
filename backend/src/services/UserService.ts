import UserModel, { IUser } from "../models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class UserService {
  public static async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<IUser> {
    try {
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        name: name,
        email: email,
        password: hashedPassword,
        isActivated: false,
      });
      const savedUser = await newUser.save();
      savedUser.password = undefined;

      return savedUser;
    } catch (error: any) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  }

  /**
   * Login a user
   * @returns {Promise<{ token: string, user: IUser }>} - Returns JWT and user info
   */
  public static async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; user: IUser }> {
    try {
      // 1. Find the user by email
      //    Also fetch the password (since we hid it with select: false)
      const user = await UserModel.findOne({ email: email }).select("+password");

      if (!user) {
        throw new Error("Invalid email or password"); // User doesn't exist
      }

      // 2. Compare the password
      //    user.password (hashed) vs password (plain text)
      const isMatch = await bcrypt.compare(password, user.password!);
      // (user.password! - '!' tells TypeScript the password definitely exists)

      if (!isMatch) {
        throw new Error("Invalid email or password"); // Wrong password
      }

      // 3. Check if the user's account is activated (optional, but good)
      if (!user.isActivated) {
        throw new Error("Account not activated. Please check your email.");
      }
      // (We haven’t created the activate route yet, so this could be commented if needed)

      // 4. If password is correct, create the JWT
      const payload = {
        userId: user._id,
        email: user.email,
      };

      // Get the JWT Secret from .env
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      // Create the token (valid for 1 day)
      const token = jwt.sign(payload, secret, { expiresIn: "1d" });

      // Never send the password in the response
      user.password = undefined;

      return { token, user };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Get user profile by ID
   */
  public static async getUserProfile(userId: string): Promise<IUser | null> {
    try {
      // Find the user by ID.
      // Exclude the password ('-password') and bring all other fields.
      // (By default, 'password' is excluded via select: false,
      //  but this is a good double check.)
      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Update user profile (name and/or profile image)
   */
  public static async updateUserProfile(
    userId: string,
    name: string | undefined,
    file: Express.Multer.File | undefined
  ): Promise<IUser | null> {
    try {
      // 1. Find the user by ID
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // 2. Prepare data for update
      const updateData: { name?: string; profileImageUrl?: string } = {};

      // 3. If name is provided, add it to updateData
      if (name) {
        updateData.name = name;
      }

      // 4. If a file (image) is provided, build the URL and add it
      if (file) {
        // Example: 'hammer-12345.jpg'
        const filename = file.filename;
        // Full URL: 'http://localhost:5000/uploads/hammer-12345.jpg'
        updateData.profileImageUrl = file.path;
      }

      // 5. Update the document in the database
      //    'new: true' returns the updated document after modification
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password"); // Return without password

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Verify the activation token and set `isActivated: true` for the user
   */
  public static async activateAccount(token: string): Promise<IUser> {
    try {
      const secret = process.env.JWT_ACTIVATION_SECRET;
      if (!secret) {
        throw new Error("JWT_ACTIVATION_SECRET is not defined");
      }

      // 1. Verify the token and extract the 'userId' from inside
      const decoded: any = jwt.verify(token, secret);
      const userId = decoded.userId;

      // 2. Find the user and update
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { isActivated: true },
        { new: true } // Return the updated document
      ).select("-password");

      if (!user) {
        throw new Error("User not found or activation failed");
      }

      return user;
    } catch (error: any) {
      // If the token is expired or invalid
      if (error.name === "TokenExpiredError") {
        throw new Error("Activation link has expired (15 mins limit)");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid activation link");
      }
      throw new Error(error.message);
    }
  }

  /**
   * Receive a password reset request from a user
   */
  public static async requestPasswordReset(
    email: string
  ): Promise<{ user: IUser; resetToken: string } | null> {
    try {
      // 1. Find the user
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        // If no user found, don’t reveal that publicly (for security)
        // Simply return null
        return null;
      }

      // 2. Retrieve the reset secret from .env
      const resetSecret = process.env.JWT_RESET_SECRET;
      if (!resetSecret) {
        throw new Error("JWT_RESET_SECRET is not defined");
      }

      // 3. Generate a 10-minute token (10m = 10 minutes)
      const payload = { userId: user._id, email: user.email };
      const resetToken = jwt.sign(payload, resetSecret, { expiresIn: "10m" });

      return { user, resetToken };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Verify the token and set a new password
   */
  public static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<IUser> {
    try {
      // 1. Get the reset secret
      const resetSecret = process.env.JWT_RESET_SECRET;
      if (!resetSecret) {
        throw new Error("JWT_RESET_SECRET is not defined");
      }

      // 2. Verify the token; throws error if expired or invalid
      const decoded: any = jwt.verify(token, resetSecret);
      const userId = decoded.userId;

      // 3. Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 4. Find the user and update the password
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );

      // Notes:
      // In User.model.ts, 'password' has 'select: false'. 
      // But findByIdAndUpdate is sufficient for updating it — no issues.

      if (!updatedUser) {
        throw new Error("User not found");
      }

      updatedUser.password = undefined;
      return updatedUser;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Password reset link has expired (10 mins limit)");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid password reset link");
      }
      throw new Error(error.message);
    }
  }
}

export default UserService;