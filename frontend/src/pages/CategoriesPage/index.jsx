import { useState, useEffect } from 'react';
import AuthenticatedHeader from '../../components/layout/AuthenticatedHeader';
import CategoryForm from '../../components/CategoryForm';
import * as categoriesService from '../../services/categories_service';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await categoriesService.getAllCategories();
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Không thể tải danh sách danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      if (editingCategory) {
        await categoriesService.updateCategory(editingCategory.id, formData);
        showNotification('Cập nhật danh mục thành công');
      } else {
        await categoriesService.createCategory(formData);
        showNotification('Tạo danh mục thành công');
      }

      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Error submitting category:', err);
      const errorMessage = err.response?.data?.error?.message || 'Có lỗi xảy ra';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm(category);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await categoriesService.deleteCategory(deleteConfirm.id);
      showNotification('Xóa danh mục thành công');
      setDeleteConfirm(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      const errorMessage = err.response?.data?.error?.message || 'Không thể xóa danh mục';
      showNotification(errorMessage, 'error');
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (isLoading) {
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
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 rounded-lg border-l-4 border-brand-purple">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-purpleLight flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-section-heading font-black text-brand-black tracking-heading uppercase">
              Quản lý Danh mục
            </h1>
                <p className="mt-1 text-sm text-brand-grayMedium">
              Quản lý danh mục sản phẩm của cửa hàng
            </p>
              </div>
              <Button onClick={handleCreate} variant="secondary" className="shadow-md hover:shadow-lg">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Thêm danh mục mới
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
            <div className="mb-6">
              <Button variant="secondary" onClick={handleCreate}>
                Thêm danh mục mới
              </Button>
            </div>
          ) : null}

          {showForm ? (
            <Card className="mb-8 p-6">
              <h2 className="text-lg font-semibold text-brand-black">
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
              </h2>
              <div className="mt-4">
                <CategoryForm
                  category={editingCategory}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isLoading={isSubmitting}
                />
              </div>
            </Card>
          ) : null}

          <Card className="overflow-hidden">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-brand-grayMedium">Chưa có danh mục nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-brand-grayLight">
                    <tr>
                      <th className="px-6 py-4 text-left text-[8.658px] font-semibold uppercase tracking-nav text-brand-grayMedium">
                        Tên danh mục
                      </th>
                      <th className="px-6 py-4 text-left text-[8.658px] font-semibold uppercase tracking-nav text-brand-grayMedium">
                        Slug
                      </th>
                      <th className="px-6 py-4 text-left text-[8.658px] font-semibold uppercase tracking-nav text-brand-grayMedium">
                        Mô tả
                      </th>
                      <th className="px-6 py-4 text-right text-[8.658px] font-semibold uppercase tracking-nav text-brand-grayMedium">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-brand-grayLight/60 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-brand-black">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-brand-grayMedium">
                            {category.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-brand-grayMedium max-w-md truncate">
                            {category.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="border border-black/10"
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteClick(category)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </Container>

        <Modal
          isOpen={Boolean(deleteConfirm)}
          title="Xác nhận xóa"
          description={
            deleteConfirm
              ? `Bạn có chắc chắn muốn xóa danh mục "${deleteConfirm.name}"?`
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

export default CategoriesPage;
