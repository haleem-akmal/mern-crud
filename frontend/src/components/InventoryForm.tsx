import { useState, useEffect } from 'react';
import inventoryService from '../services/inventoryService';

// --- Interface (Type) ---
// We'll reuse this type that also exists in DashboardPage
interface InventoryItem {
  _id: string;
  itemName: string;
  price: number;
  stock: number;
  imageUrl: string;
}

// --- Component Props ---
type InventoryFormProps = {
  // 1. For “Update”, we receive existing data here.
  //    If it’s an “Add”, this will be 'null'.
  initialData: InventoryItem | null;

  onSuccess: () => void; // Called once form submission is done to notify DashboardPage that the job is complete
};

const InventoryForm = ({ initialData, onSuccess }: InventoryFormProps) => {
  // --- State ---
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null>(null); // New image
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Check whether it's “Add” mode or “Update” mode
  const isEditMode = initialData !== null;
  const currentImagePreview = initialData?.imageUrl; // Show the old image in “Update” mode

  // --- Effect ---
  // 3. Whenever 'initialData' changes (for example, when clicking the "Update" button),
  //    pre-fill the form.
  useEffect(() => {
    if (isEditMode) {
      // Edit mode: pre-fill the form
      setItemName(initialData.itemName);
      setPrice(initialData.price);
      setStock(initialData.stock);
      // Reset the image. Only send a new one if the user selects it.
      setImage(null);
    } else {
      // Add mode: clear the form
      setItemName('');
      setPrice(0);
      setStock(0);
      setImage(null);
    }
  }, [initialData, isEditMode]); // Run this effect when 'initialData' changes

  // --- Functions ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    try {
      // 4. Check if it's “Update” mode or “Add” mode
      if (isEditMode) {
        // --- Update Logic ---
        // Pass the file selected by the user in the 'image' prop (or null)
        await inventoryService.updateItem(
          initialData._id,
          itemName,
          price,
          stock,
          image
        );
      } else {
        // --- Add Logic ---
        if (!image) { // In "Add" mode, an image is mandatory
          setFormError('Image file is required');
          setIsLoading(false);
          return;
        }
        await inventoryService.createItem(itemName, price, stock, image);
      }

      // Success!
      setIsLoading(false);
      onSuccess(); // Notify DashboardPage that the task is finished

    } catch (err: any) {
      setIsLoading(false);
      setFormError(err.message || (isEditMode ? 'Failed to update item' : 'Failed to create item'));
    }
  };

  // --- JSX ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* 5. In “Update” mode, show the existing image */}
      {isEditMode && currentImagePreview && (
        <div className="text-center">
          <img 
            src={currentImagePreview} 
            alt="Current item" 
            className="w-32 h-32 object-cover rounded-lg mx-auto mb-2 shadow"
          />
          <p className="text-sm text-gray-500">Current Image. Upload a new one to replace it.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          // In “Update” mode, image isn’t required
          required={!isEditMode}
          className="p-2 border border-gray-300 rounded-lg w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Price (e.g., 19.99)"
          value={price === 0 ? '' : price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
        <input
          type="number"
          placeholder="Stock (e.g., 50)"
          value={stock === 0 ? '' : stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50"
      >
        {/* 6. Adjust the button label based on mode */}
        {isLoading ? 'Saving...' : (isEditMode ? 'Update Item' : 'Add Item')}
      </button>
      {formError && <p className="text-red-500 mt-2">{formError}</p>}
    </form>
  );
};

export default InventoryForm;