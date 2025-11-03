import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface (for TypeScript)
export interface IInventoryItem extends Document {
  itemName: string;
  price: number;
  stock: number;
  imageUrl: string; // We will store the URL of the saved image here
  addedBy: mongoose.Schema.Types.ObjectId; // To know which user added this item
}

// Mongoose Schema (for MongoDB)
const InventoryItemSchema: Schema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price should not be less than 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0, // Stock should not be less than 0
    },
    imageUrl: {
      type: String,
      required: true, // Image is mandatory
    },
    // This links to the User model
    addedBy: {
      type: mongoose.Schema.Types.ObjectId, // We will store the User's ID here
      ref: 'User', // Refers to the 'User' model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Creating the model
const InventoryItemModel: Model<IInventoryItem> = mongoose.model<IInventoryItem>(
  'InventoryItem', // Model name
  InventoryItemSchema
);

export default InventoryItemModel;
