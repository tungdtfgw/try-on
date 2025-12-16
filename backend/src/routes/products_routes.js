import express from 'express';
import multer from 'multer';
import * as productsController from '../controllers/products_controller.js';
import { authMiddleware, isAdminMiddleware } from '../middlewares/auth_middleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.post('/', authMiddleware, isAdminMiddleware, productsController.createProduct);
router.put('/:id', authMiddleware, isAdminMiddleware, productsController.updateProduct);
router.delete('/:id', authMiddleware, isAdminMiddleware, productsController.deleteProduct);
router.post('/:id/image', authMiddleware, isAdminMiddleware, upload.single('image'), productsController.uploadProductImage);

export default router;
