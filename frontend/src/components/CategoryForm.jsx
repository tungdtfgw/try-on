import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

const CategoryForm = ({ category, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Tên danh mục không được vượt quá 100 ký tự';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        disabled={isLoading}
        label="Tên danh mục"
        required
        placeholder="Nhập tên danh mục"
        error={errors.name}
      />

      <Textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        disabled={isLoading}
        label="Mô tả"
        placeholder="Nhập mô tả danh mục (tùy chọn)"
        error={errors.description}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {category ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
