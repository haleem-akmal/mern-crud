import { useState, useEffect } from 'react';
import inventoryService from '../services/inventoryService';

// --- Our Custom Components ---
import Modal from '../components/Modal'; // 1. Importing our Modal
import InventoryForm from '../components/InventoryForm'; // 2. Importing our Form

// --- Icons for Buttons ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// --- Interface ---
interface InventoryItem {
  _id: string;
  itemName: string;
  price: number;
  stock: number;
  imageUrl: string;
  addedBy: { _id: string; name: string };
  createdAt: string;
}

const DashboardPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- 2. States for Controlling the Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 'null' = Add mode
  // InventoryItem object = Edit mode
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await inventoryService.getAllItems();
      setItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items.');
    }
  };

  // --- 3. Functions to Control the Modal ---

  // When the "Add New Item" button is clicked
  const handleOpenAddModal = () => {
    setEditingItem(null); // Set 'null' → Add mode
    setIsModalOpen(true);
  };

  // When the "Edit" button in the table is clicked
  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item); // Set the item’s data → Edit mode
    setIsModalOpen(true);
  };
  
  // When the Modal is closed (via backdrop or “X” click)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null); // Reset the state
  };

  // When the form is submitted (Add or Update)
  const handleFormSuccess = () => {
    fetchItems(); // Refresh the list
    handleCloseModal(); // Close the modal and reset state
  };

  // --- Delete Function ---
  const handleDeleteClick = async (itemId: string, itemName: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${itemName}"?`);
    if (!isConfirmed) return;
    
    try {
      await inventoryService.deleteItem(itemId);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* --- Inventory List Table --- */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Inventory List
          </h2>
          
          {/* 4. “Add New Item” button now calls 'handleOpenAddModal' */}
          <button
            onClick={handleOpenAddModal} 
            className="px-4 py-2 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg"
          >
            + Add New Item
          </button>
        </div>
        
        {error && <p className="text-red-500 pb-6">{error}</p>}
        
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={item.imageUrl} alt={item.itemName} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.addedBy?.name ?? 'User Deleted'}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* 5. “Edit” button now calls 'handleOpenEditModal(item)' */}
                      <button 
                        onClick={() => handleOpenEditModal(item)} 
                        className="p-2 text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg" 
                        title="Edit Item"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item._id, item.itemName)} 
                        className="p-2 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg" 
                        title="Delete Item"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 6. Modal Component --- */}
      {/* The modal is shown only if 'isModalOpen' is true */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          // Title updates based on 'editingItem'
          title={editingItem ? "Edit Item" : "Add New Item"}
        >
          {/* Inside the Modal, show the Form */}
          <InventoryForm 
            onSuccess={handleFormSuccess} 
            // Pass 'initialData' to the Form
            // If 'editingItem' is null → Add mode
            // If it’s an object → Edit mode
            initialData={editingItem}
          />
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;