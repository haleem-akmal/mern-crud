// Import express
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import authRoutes from './routes/Auth.routes';
import inventoryRoutes from './routes/Inventory.routes';
import userRoutes from './routes/User.routes';
import cors from 'cors';

dotenv.config();

// Create an express app
const app = express();

// Define a port
const PORT = process.env.PORT || 5000;

// --- CORS Setup ---
// (Make sure your Vite server is running on port 5173)
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Reading from .env
  credentials: true,
};
app.use(cors(corsOptions));

// --- Middleware ---
// This helps parse incoming JSON data
app.use(express.json());
// This helps parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Serve static files (images, etc.)
//app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Test Route ---
app.get('/', (req: Request, res: Response) => {
  res.send('Hardware Inventory API is running!');
});

// --- API Routes ---
// All requests starting with '/api/auth'
// will be sent to the 'authRoutes' file.
app.use('/api/auth', authRoutes);

// All requests starting with '/api/inventory'
// will be sent to the 'inventoryRoutes' file.
app.use('/api/inventory', inventoryRoutes);

// For all '/api/users' routes, use 'userRoutes'
app.use('/api/users', userRoutes);

// Connect to the database
connectDB();

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});