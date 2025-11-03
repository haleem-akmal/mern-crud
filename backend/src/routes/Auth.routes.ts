import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';

// Importing Router from Express
const router = Router();

// --- Authentication Routes ---

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register', // Path
  AuthController.handleRegisterUser // Controller function to call
);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
// (We will implement login later)
router.post('/login', AuthController.handleLoginUser);

/**
 * @route   GET /api/auth/activate/:token
 * @desc    Activate user account using JWT token
 * @access  Public
 */
router.get(
  '/activate/:token', // <-- We expect the token in the URL
  AuthController.handleActivateAccount
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request a password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  AuthController.handleForgotPassword
);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset the password using the token
 * @access  Public
 */
router.post(
  '/reset-password/:token',
  AuthController.handleResetPassword
);

// Exporting this router
export default router;
