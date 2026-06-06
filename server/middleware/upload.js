import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';

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
