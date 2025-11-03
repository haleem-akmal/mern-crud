// backend/src/middleware/upload.middleware.ts

import { v2 as cloudinary } from 'cloudinary'; // 1. Cloudinary-a import panrom
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // 2. Puthu storage-a import panrom
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config(); // .env file-a load panna idhu thevai

// --- 3. Cloudinary Configuration ---
// Namma .env file-la irundhu details-a eduthu config panrom
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- 4. Cloudinary Storage Engine Setup ---
// Pazhaya 'diskStorage'-kku padhilaga (instead of), indha puthu storage-a create panrom
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hardware-shop-inventory', // Cloudinary-la intha folder-kulla ellam save aagum
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // Intha function, file-kku oru unique name-a kodukkum
    public_id: (req: Request, file: Express.Multer.File) => {
      // Example: hammer.jpg -> hammer-1678886400000
      const originalName = file.originalname.split('.')[0];
      return `${originalName}-${Date.now()}`;
    },
  } as any, // (TypeScript-kaga 'as any' use panrom)
});

// --- 5. File Filter (Idhu pazhayadhu போலவே) ---
// JPG, PNG, JPEG mattum allow panrom
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// --- 6. Multer Configuration ---
// Inga namma 'storage: storage' (Cloudinary storage) use panrom,
// pazhaya diskStorage-a illa.
const upload = multer({
  storage: storage, // Puthu Cloudinary storage
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

export default upload;