import { Request, Response } from 'express';
import InventoryService from '../services/InventoryService';
import { Types } from 'mongoose'; // Importing ObjectId type

class InventoryController {
  /**
   * Handles the creation of a new inventory item
   * Method: POST
   * Path: /api/inventory
   */
  public static async handleCreateItem(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Controller task: extract data from the request
      
      // req.body contains form fields (itemName, price)
      const { itemName, price, stock } = req.body;
      
      // req.file is provided by the Multer upload middleware
      const file = req.file;

      // req.user is provided by auth.middleware.ts (JWT)
      // req.user contains { userId: '...' }
      const userId = new Types.ObjectId(req.user.userId);

      // 2. Validate incoming data
      if (!itemName || !price || !stock) {
        return res.status(400).json({ message: 'Item name, price, and stock are required' });
      }

      if (!file) {
        return res.status(400).json({ 
          message: 'Image file is required (Only JPEG/PNG allowed)' 
        });
      }

      // 3. Delegate work to the Service layer
      const newItem = await InventoryService.createItem({
        itemName,
        price: Number(price), // Converted to Number because form data comes as string
        stock: Number(stock),
        userId,
        file,
      });

      // 4. Send a proper response to the frontend
      return res.status(201).json({
        message: 'Inventory item added successfully',
        item: newItem,
      });

    } catch (error: any) {
      console.error('Error in handleCreateItem:', error.message);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  /**
   * Handles fetching all inventory items
   * Method: GET
   * Path: /api/inventory
   */
  public static async handleGetAllItems(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Delegate work to the Service layer
      const items = await InventoryService.getAllItems();

      // 2. Send response to the frontend
      return res.status(200).json(items);

    } catch (error: any) {
      console.error('Error in handleGetAllItems:', error.message);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  /**
   * Handles the deletion of an inventory item
   * Method: DELETE
   * Path: /api/inventory/:id
   */
  public static async handleDeleteItem(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Extract item ID from the URL (eg: /api/inventory/12345)
      //    req.params.id contains '12345'
      const { id } = req.params;

      // 2. Delegate work to the Service layer
      await InventoryService.deleteItem(id);

      // 3. Send a success response to the frontend
      return res.status(200).json({
        message: 'Item deleted successfully',
      });

    } catch (error: any) {
      console.error('Error in handleDeleteItem:', error.message);
      if (error.message.includes('Item not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  /**
   * Handles the update of an inventory item
   * Method: PUT
   * Path: /api/inventory/:id
   */
  public static async handleUpdateItem(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Extract the item ID from the URL
      const { id } = req.params;

      // 2. Extract form data from req.body
      const { itemName, price, stock } = req.body;
      const updateData = { itemName, price: Number(price), stock: Number(stock) };

      // 3. Check if a new image file is provided (Multer)
      const file = req.file;

      // 4. Delegate update task to the Service layer
      const updatedItem = await InventoryService.updateItem(
        id,
        updateData,
        file
      );

      // 5. Send a success response to the frontend
      return res.status(200).json({
        message: 'Item updated successfully',
        item: updatedItem,
      });

    } catch (error: any) {
      console.error('Error in handleUpdateItem:', error.message);
      if (error.message.includes('Item not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export default InventoryController;
