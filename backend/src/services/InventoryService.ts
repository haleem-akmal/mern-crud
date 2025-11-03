import InventoryItemModel, { IInventoryItem } from '../models/InventoryItem.model';
import { Types } from 'mongoose';

// Interface for createItem data
interface ICreateItemInput {
  itemName: string;
  price: number;
  stock: number;
  userId: Types.ObjectId; // Which user is adding this
  file: Express.Multer.File; // File coming from Multer
}

class InventoryService {
  /**
   * Create a new inventory item
   */
  public static async createItem(
    input: ICreateItemInput
  ): Promise<IInventoryItem> {
    const { itemName, price, stock, userId, file } = input;

    try {
      // 1. Check if a file was provided (it might have been rejected in fileFilter)
      if (!file) {
        throw new Error('Image file is required');
      }

      // 2. Convert the file path into a complete URL (the most important step!)
      //    file.filename - provided by Multer (e.g., 'hammer-12345.jpg')
      //    process.env.BACKEND_URL - from the .env file (e.g., 'http://localhost:5000')
      //    Final URL = 'http://localhost:5000/uploads/hammer-12345.jpg'
      const imageUrl = file.path; // Cloudinary URL neradiyaga (directly) kidaikkum
      
      // (Note: we don’t save 'file.path' (e.g., 'uploads/hammer-12345.jpg'),
      // we save the full URL ('imageUrl'), because the frontend actually needs that.)

      // 3. Create the new item
      const newItem = new InventoryItemModel({
        itemName,
        price,
        stock,
        imageUrl: imageUrl, // Save the image URL in the database
        addedBy: userId, // Link the user's ID
      });

      // 4. Save it to the database
      const savedItem = await newItem.save();
      return savedItem;

    } catch (error: any) {
      throw new Error(`Error creating item: ${error.message}`);
    }
  }

  /**
   * Retrieve all inventory items
   */
  public static async getAllItems(): Promise<IInventoryItem[]> {
    try {
      // .populate('addedBy', 'name email') - Using the 'addedBy' ID, 
      // it goes to the 'User' collection and fetches only 'name' and 'email' fields.
      const items = await InventoryItemModel.find().populate('addedBy', 'name email');
      return items;
    } catch (error: any) {
      throw new Error(`Error fetching items: ${error.message}`);
    }
  }

  /**
   * Delete an inventory item by its ID
   */
  public static async deleteItem(itemId: string): Promise<void> {
    try {
      // 1. Find the item by ID and delete it
      const deletedItem = await InventoryItemModel.findByIdAndDelete(itemId);

      if (!deletedItem) {
        throw new Error('Item not found');
      }

      // 2. TODO: Also delete the image file from the 'uploads' folder
      //    (We can add this later; for now, delete only from the database)
      //    const imageUrl = deletedItem.imageUrl;
      //    fs.unlink(imagePath);

    } catch (error: any) {
      throw new Error(`Error deleting item: ${error.message}`);
    }
  }

  /**
   * Update an inventory item using its ID
   */
  public static async updateItem(
    itemId: string,
    updateData: { itemName?: string; price?: number; stock?: number }, // Data
    file: Express.Multer.File | undefined // New image (if provided)
  ): Promise<IInventoryItem> {
    try {
      // 1. Prepare the data to update
      const dataToUpdate: any = { ...updateData };

      // 2. If a new image file is provided...
      if (file) {
        // Create a new image URL
        dataToUpdate.imageUrl = file.path;

        // TODO: Delete the old image from the 'uploads' folder
        // (fs.unlink). For now, we can just update the DB.
      }

      // 3. Find the item in the database and update it
      //    'new: true' - returns the updated document after modification
      const updatedItem = await InventoryItemModel.findByIdAndUpdate(
        itemId,
        { $set: dataToUpdate },
        { new: true, runValidators: true } // 'new: true' is essential
      );

      if (!updatedItem) {
        throw new Error('Item not found');
      }

      return updatedItem;

    } catch (error: any) {
      throw new Error(`Error updating item: ${error.message}`);
    }
  }
}

export default InventoryService;