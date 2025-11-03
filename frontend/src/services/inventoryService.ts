import axios from 'axios';

// Our backend API URLs
const BACKEND_API = import.meta.env.VITE_BACKEND_URL;
const API_INV_URL = `${BACKEND_API}/api/inventory`;
const API_USER_URL = `${BACKEND_API}/api/users`;

/**
 * Helper Function:
 * To get the JWT token from localStorage.
 */
const getToken = () => {
  return localStorage.getItem('userToken');
};

/**
 * 1. Get All Inventory Items
 * (backend: GET /api/inventory)
 */
const getAllItems = async () => {
  const token = getToken(); // Our "ID card" (Token)
  if (!token) {
    throw new Error('No token found, please login.');
  }

  // Send the token in the request headers
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // This is what the authMiddleware expects
    },
  };

  try {
    const response = await axios.get(API_INV_URL, config);
    return response.data;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.error('Error fetching items:', message);
    throw { message: message };
  }
};

/**
 * 2. Create a New Inventory Item (FormData!)
 * (backend: POST /api/inventory)
 */
const createItem = async (
  itemName: string,
  price: number,
  stock: number,
  image: File // File obtained from <input type="file">
) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found, please login.');
  }

  // 1. Create a new "parcel box" (FormData)
  const formData = new FormData();

  // 2. Add data to the box using 'append' (key, value)
  //    (The keys must match what the backend expects
  //     in 'upload.single()' and 'req.body')
  formData.append('itemName', itemName);
  formData.append('price', String(price)); // FormData sends as text
  formData.append('stock', String(stock));
  formData.append('image', image); // Add the file too

  // 3. Adjust headers in config
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // This is very important!
    },
  };

  try {
    const response = await axios.post(API_INV_URL, formData, config);
    return response.data;
  } catch (error: any) {
    console.error('Error creating item:', error.response.data);
    throw error.response.data;
  }
};

/**
 * 3. Get User Profile
 * (backend: GET /api/users/profile)
 */
const getUserProfile = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_USER_URL}/profile`, config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching profile:', error.response.data);
    throw error.response.data;
  }
};

/**
 * 4. Update User Profile (FormData!)
 * (backend: PUT /api/users/profile)
 */
const updateUserProfile = async (
  name: string,
  profileImage: File | null // Image may be optional
) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found.');
  }

  const formData = new FormData();
  formData.append('name', name);
  if (profileImage) {
    // Backend expects 'upload.single("profileImage")'
    formData.append('profileImage', profileImage);
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const response = await axios.put(`${API_USER_URL}/profile`, formData, config);
    return response.data;
  } catch (error: any) {
    console.error('Error updating profile:', error.response.data);
    throw error.response.data;
  }
};

/**
 * 5. Delete an Inventory Item
 * (backend: DELETE /api/inventory/:id)
 */
const deleteItem = async (itemId: string) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    // axios.delete(URL, config)
    // Append the item ID at the end of the URL (e.g., /api/inventory/12345)
    const response = await axios.delete(`${API_INV_URL}/${itemId}`, config);
    return response.data; // { message: 'Item deleted...' }
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.error('Error deleting item:', message);
    throw { message: message };
  }
};

/**
 * 6. Update an Inventory Item (FormData!)
 * (backend: PUT /api/inventory/:id)
 */
const updateItem = async (
  itemId: string,
  itemName: string,
  price: number,
  stock: number,
  image: File | null // If image isn't changed, it can be null
) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found.');
  }

  // 1. Create the "parcel box" (FormData)
  const formData = new FormData();

  // 2. Append text data
  formData.append('itemName', itemName);
  formData.append('price', String(price));
  formData.append('stock', String(stock));

  // 3. Only append the *new* image if the user selects one
  if (image) {
    formData.append('image', image);
  }
  // (If the image is null, backend's req.file will be 'undefined',
  //  and the backend logic will keep the old image – that’s correct.)

  // 4. Set config headers
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    // 5. Call axios.put (include ID in the URL)
    const response = await axios.put(`${API_INV_URL}/${itemId}`, formData, config);
    return response.data;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.error('Error updating item:', message);
    throw { message: message };
  }
};

// Export all functions
const inventoryService = {
  getAllItems,
  createItem,
  getUserProfile,
  updateUserProfile,
  deleteItem,
  updateItem,
};

export default inventoryService;
