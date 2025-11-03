import { Router } from 'express';
import InventoryController from '../controllers/Inventory.controller';
import authMiddleware from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = Router();

// --- Inventory Routes ---

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory items
 * @access  Private (Only logged-in users)
 */
router.get(
  '/',
  authMiddleware, // <-- 1. Gatekeeper (Check the token)
  InventoryController.handleGetAllItems // 2. Call the controller
);

/**
 * @route   POST /api/inventory
 * @desc    Create a new inventory item
 * @access  Private (Only logged-in users)
 */
router.post(
  '/',
  authMiddleware, // <-- 1. Gatekeeper (Check the token)
  upload.single('image'), // <-- 2. Multer (Save the file coming in the 'image' field of the form data)
  InventoryController.handleCreateItem // 3. Call the controller
);

/**
 * @route   DELETE /api/inventory/:id
 * @desc    Delete an inventory item
 * @access  Private (Only logged-in users)
 */
router.delete(
  '/:id', // <-- Expecting an ID in the URL (e.g., /api/inventory/12345)
  authMiddleware, // <-- 1. Gatekeeper (Check the token)
  InventoryController.handleDeleteItem // 2. Call the controller
);

/**
 * @route   PUT /api/inventory/:id
 * @desc    Update an inventory item
 * @access  Private
 */
router.put(
  '/:id', // <-- Expecting an ID in the URL
  authMiddleware, // <-- 1. Gatekeeper (Check the token)
  upload.single('image'), // <-- 2. Multer (If a new 'image' file comes in, save it)
  InventoryController.handleUpdateItem // 3. Call the controller
);

export default router;