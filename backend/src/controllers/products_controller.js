import * as productsService from '../services/products_service.js';

/**
 * Controller: Lấy tất cả products
 * GET /api/v1/products?limit=10&offset=0&category_id=xxx
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const categoryId = req.query.category_id || null;

    const result = await productsService.getAllProducts({ limit, offset, categoryId });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Lấy product theo ID
 * GET /api/v1/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Tạo product mới (Admin only)
 * POST /api/v1/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const newProduct = await productsService.createProduct(productData);

    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Cập nhật product (Admin only)
 * PUT /api/v1/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const updatedProduct = await productsService.updateProduct(id, productData);

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Xóa product (Admin only)
 * DELETE /api/v1/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productsService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Upload ảnh sản phẩm (Admin only)
 * POST /api/v1/products/:id/image
 */
export const uploadProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'No image file provided'
        }
      });
    }

    const updatedProduct = await productsService.uploadProductImage(id, req.file);

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};
