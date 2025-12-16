import { supabase, supabaseStorage } from '../config/supabase.js';

/**
 * Repository: Lấy tất cả categories
 */
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Lấy category theo ID
 */
export const getCategoryById = async (id) => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Lấy category theo slug
 */
export const getCategoryBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, created_at, updated_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Tạo category mới
 * Use service role key to bypass RLS for admin operations
 */
export const createCategory = async (categoryData) => {
  const { data, error } = await supabaseStorage
    .from('categories')
    .insert(categoryData)
    .select('id, name, slug, description, created_at, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Cập nhật category
 * Use service role key to bypass RLS for admin operations
 */
export const updateCategory = async (id, categoryData) => {
  const { data, error } = await supabaseStorage
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select('id, name, slug, description, created_at, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Xóa category
 * Use service role key to bypass RLS for admin operations
 */
export const deleteCategory = async (id) => {
  const { error } = await supabaseStorage
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};

/**
 * Repository: Kiểm tra category có products không
 */
export const checkCategoryHasProducts = async (categoryId) => {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', categoryId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
};
