import { Router } from 'express';
import UserController from '../controllers/User.controller';
import authMiddleware from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = Router();

// --- User Routes ---

/**
 * @route   GET /api/users/profile
 * @desc    Get logged in user's profile
 * @access  Private
 */
router.get(
  '/profile',
  authMiddleware, // <-- 1. Gatekeeper (Check the token)
  UserController.handleGetUserProfile // 2. Call the controller
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user's profile (name & image)
 * @access  Private
 */
router.put(
  '/profile', // <-- Is '/profile' correct?
  authMiddleware,
  upload.single('profileImage'),
  UserController.handleUpdateUserProfile
);

export default router;