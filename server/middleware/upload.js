import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = 'mehastore_profiles';
    if (file.fieldname === 'image') {
      folderName = 'mehastore_products';
    }
    return {
      folder: folderName,
      allowedFormats: ['jpeg', 'png', 'jpg'],
    };
  },
});

const upload = multer({ storage: storage });

export default upload;
