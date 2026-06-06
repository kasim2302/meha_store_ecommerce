import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';

// ── Custom Cloudinary v2 storage engine for multer ──────────
// multer-storage-cloudinary only supports cloudinary v1 (vulnerable).
// This replaces it with a lightweight v2-compatible implementation.
class CloudinaryStorageV2 {
  constructor({ cloudinaryInstance, params }) {
    this.cloudinary = cloudinaryInstance;
    this.params = params; // function (req, file) => object
  }

  async _handleFile(req, file, cb) {
    try {
      const options = typeof this.params === 'function'
        ? await this.params(req, file)
        : this.params;

      const uploadStream = this.cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return cb(error);
          // Expose the same shape as multer-storage-cloudinary
          cb(null, {
            path: result.secure_url,   // used as req.file.path
            filename: result.public_id,
            size: result.bytes,
          });
        }
      );

      file.stream.pipe(uploadStream);
    } catch (err) {
      cb(err);
    }
  }

  _removeFile(req, file, cb) {
    if (file.filename) {
      this.cloudinary.uploader.destroy(file.filename, cb);
    } else {
      cb(null);
    }
  }
}

// ── Storage configuration ───────────────────────────────────
const storage = new CloudinaryStorageV2({
  cloudinaryInstance: cloudinary,
  params: async (req, file) => {
    const folderName = file.fieldname === 'image'
      ? 'mehastore_products'
      : 'mehastore_profiles';
    return {
      folder: folderName,
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

// ── File filter — only allow images ─────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, JPG, and WebP images are allowed'), false);
  }
};

// ── Upload instance (5 MB file size limit) ──────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default upload;
