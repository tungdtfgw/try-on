import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';

const ProductForm = ({ product, categories, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category_id: product.category_id || '',
        description: product.description || '',
      });
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    } else if (formData.name.trim().length > 200) {
      newErrors.name = 'Tên sản phẩm không được vượt quá 200 ký tự';
    }

    if (!formData.price) {
      newErrors.price = 'Giá sản phẩm là bắt buộc';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Danh mục là bắt buộc';
    }

    if (formData.description && formData.description.trim().length > 1000) {
      newErrors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }

    if (imageFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(imageFile.type)) {
        newErrors.image = 'Chỉ chấp nhận file ảnh JPEG hoặc PNG';
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        newErrors.image = 'Kích thước ảnh không được vượt quá 5MB';
      }
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
      price: parseFloat(formData.price),
      category_id: formData.category_id,
      description: formData.description.trim() || null,
    }, imageFile);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: '',
        }));
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(product?.image_url || null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        disabled={isLoading}
        label="Tên sản phẩm"
        required
        placeholder="Nhập tên sản phẩm"
        error={errors.name}
      />

      <Input
        id="price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        disabled={isLoading}
        label="Giá sản phẩm"
        required
        step="0.01"
        min="0"
        placeholder="Nhập giá sản phẩm"
        error={errors.price}
      />

      <Select
        id="category_id"
        name="category_id"
        value={formData.category_id}
        onChange={handleChange}
        disabled={isLoading}
        label="Danh mục"
        required
        error={errors.category_id}
      >
        <option value="">Chọn danh mục</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <Textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        disabled={isLoading}
        label="Mô tả"
        placeholder="Nhập mô tả sản phẩm (tùy chọn)"
        error={errors.description}
      />

      <div>
        <div className="text-sm font-medium text-brand-grayDark">Ảnh sản phẩm</div>
        
        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-md border border-black/10"
            />
            {imageFile && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                >
                  Xóa ảnh
                </Button>
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          id="image"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleImageChange}
          disabled={isLoading}
          className={cn(
            'w-full rounded-sm bg-white px-3 py-2 text-sm',
            'border border-black/10',
            'focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-brand-black',
            'disabled:bg-brand-grayLight disabled:cursor-not-allowed',
            errors.image ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : ''
          )}
        />
        <p className="mt-1 text-xs text-brand-grayMedium">
          Chấp nhận file JPEG, PNG. Tối đa 5MB.
        </p>
        {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {product ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
