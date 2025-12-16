import { useState, useEffect, useRef } from 'react';
import AuthenticatedHeader from '../../components/layout/AuthenticatedHeader';
import ProductForm from '../../components/ProductForm';
import * as productsService from '../../services/products_service';
import * as categoriesService from '../../services/categories_service';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false
  });
  const formRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filterCategoryId, pagination.offset]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesService.getAllCategories();
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productsService.getAllProducts({
        limit: pagination.limit,
        offset: pagination.offset,
        categoryId: filterCategoryId || null
      });
      setProducts(response.data.products);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        hasMore: response.data.pagination.hasMore
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData, imageFile) => {
    try {
      setIsSubmitting(true);
      
      let productId;
      if (editingProduct) {
        const response = await productsService.updateProduct(editingProduct.id, formData);
        productId = response.data.id;
        showNotification('Cập nhật sản phẩm thành công');
      } else {
        const response = await productsService.createProduct(formData);
        productId = response.data.id;
        showNotification('Tạo sản phẩm thành công');
      }

      if (imageFile) {
        await productsService.uploadProductImage(productId, imageFile);
      }

      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error submitting product:', err);
      const errorMessage = err.response?.data?.error?.message || 'Có lỗi xảy ra';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (product) => {
    setDeleteConfirm(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await productsService.deleteProduct(deleteConfirm.id);
      showNotification('Xóa sản phẩm thành công');
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err.response?.data?.error?.message || 'Không thể xóa sản phẩm';
      showNotification(errorMessage, 'error');
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleFilterChange = (e) => {
    setFilterCategoryId(e.target.value);
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit)
    }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  if (isLoading && products.length === 0) {
    return (
      <>
        <AuthenticatedHeader />
        <div className="min-h-screen bg-brand-grayLight flex items-center justify-center">
          <div className="text-center">
            <Spinner className="mx-auto" />
            <p className="mt-4 text-sm text-brand-grayMedium">Đang tải...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthenticatedHeader />
      <div className="min-h-screen bg-brand-grayLight py-xl mt-4">
        <Container>
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-orange/10 to-brand-yellow/10 rounded-lg border-l-4 border-brand-orange">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-orangeLight flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-section-heading font-black text-brand-black tracking-heading uppercase">
              Quản lý Sản phẩm
            </h1>
                <p className="mt-1 text-sm text-brand-grayMedium">
                  Quản lý sản phẩm của cửa hàng
                </p>
              </div>
              <Button onClick={handleCreate} variant="secondary" className="shadow-md hover:shadow-lg">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Thêm sản phẩm mới
              </Button>
            </div>
          </div>

          {notification ? (
            <Alert className="mb-6" variant={notification.type === 'success' ? 'success' : 'error'}>
              {notification.message}
            </Alert>
          ) : null}

          {error ? (
            <Alert className="mb-6" variant="error">
              {error}
            </Alert>
          ) : null}

          {!showForm ? (
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end">
              <Button variant="secondary" onClick={handleCreate}>Thêm sản phẩm mới</Button>

              <div className="w-full sm:w-auto min-w-[240px]">
                <Select
                  id="filter-category"
                  label="Lọc theo danh mục"
                  value={filterCategoryId}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ) : null}

          {showForm ? (
            <Card ref={formRef} className="mb-8 p-6">
              <h2 className="text-lg font-semibold text-brand-black">
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
              </h2>
              <div className="mt-4">
                <ProductForm
                  product={editingProduct}
                  categories={categories}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isLoading={isSubmitting}
                />
              </div>
            </Card>
          ) : null}

          <Card className="overflow-hidden">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-brand-grayMedium">Chưa có sản phẩm nào</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden group hover:scale-[1.01] hover:shadow-card transition-all duration-300"
                    >
                      <div className="aspect-square bg-brand-grayLight relative overflow-hidden rounded-t-md">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-brand-grayMedium/40"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-product-title font-medium text-brand-black truncate" title={product.name}>
                          {product.name}
                        </h3>
                        <p className="text-[10.45px] text-brand-grayMedium mt-1">
                          {getCategoryName(product.category_id)}
                        </p>
                        <p className="text-lg font-black text-brand-black mt-2">
                          {parseFloat(product.price).toLocaleString('vi-VN')} đ
                        </p>
                        {product.description ? (
                          <p
                            className="text-sm text-brand-grayMedium mt-2 line-clamp-2"
                            title={product.description}
                          >
                            {product.description}
                          </p>
                        ) : null}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 border border-black/10"
                            onClick={() => handleEdit(product)}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeleteClick(product)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {pagination.total > pagination.limit ? (
                  <div className="px-6 py-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-brand-grayMedium">
                      Hiển thị {pagination.offset + 1} -{' '}
                      {Math.min(pagination.offset + pagination.limit, pagination.total)} trong tổng số{' '}
                      {pagination.total} sản phẩm
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border border-black/10"
                        onClick={handlePreviousPage}
                        disabled={pagination.offset === 0}
                      >
                        Trước
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border border-black/10"
                        onClick={handleNextPage}
                        disabled={!pagination.hasMore}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </Card>
        </Container>

        <Modal
          isOpen={Boolean(deleteConfirm)}
          title="Xác nhận xóa"
          description={
            deleteConfirm
              ? `Bạn có chắc chắn muốn xóa sản phẩm "${deleteConfirm.name}"?`
              : ''
          }
          confirmText="Xóa"
          cancelText="Hủy"
          confirmVariant="danger"
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </>
  );
};

export default ProductsPage;
