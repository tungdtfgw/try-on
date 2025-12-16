import express from 'express';
import * as categoriesController from '../controllers/categories_controller.js';
import { authMiddleware, isAdminMiddleware } from '../middlewares/auth_middleware.js';

const router = express.Router();

/**
 * Public routes - không cần authentication
 */
// GET /api/categories - Lấy tất cả categories
router.get('/', categoriesController.getAllCategories);

// GET /api/categories/:id - Lấy chi tiết 1 category
router.get('/:id', categoriesController.getCategoryById);

/**
 * Admin routes - yêu cầu authentication và admin role
 */
// POST /api/categories - Tạo category mới
router.post('/', authMiddleware, isAdminMiddleware, categoriesController.createCategory);

// PUT /api/categories/:id - Cập nhật category
router.put('/:id', authMiddleware, isAdminMiddleware, categoriesController.updateCategory);

// DELETE /api/categories/:id - Xóa category
router.delete('/:id', authMiddleware, isAdminMiddleware, categoriesController.deleteCategory);

export default router;
