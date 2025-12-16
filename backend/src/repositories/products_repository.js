import { supabase, supabaseStorage } from '../config/supabase.js';

/**
 * Repository: Lấy tất cả products với pagination và filter
 */
export const getAllProducts = async ({ limit = 10, offset = 0, categoryId = null }) => {
  let query = supabase
    .from('products')
    .select('id, name, price, category_id, description, image_url, created_at, updated_at, categories(id, name, slug)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return { data, count };
};

/**
 * Repository: Lấy product theo ID
 */
export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, category_id, description, image_url, created_at, updated_at, categories(id, name, slug)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Tạo product mới
 * Use service role key to bypass RLS for admin operations
 */
export const createProduct = async (productData) => {
  const { data, error } = await supabaseStorage
    .from('products')
    .insert(productData)
    .select('id, name, price, category_id, description, image_url, created_at, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Cập nhật product
 * Use service role key to bypass RLS for admin operations
 */
export const updateProduct = async (id, productData) => {
  const { data, error } = await supabaseStorage
    .from('products')
    .update(productData)
    .eq('id', id)
    .select('id, name, price, category_id, description, image_url, created_at, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Repository: Xóa product
 * Use service role key to bypass RLS for admin operations
 */
export const deleteProduct = async (id) => {
  const { error } = await supabaseStorage
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};

/**
 * Repository: Upload ảnh sản phẩm lên Supabase Storage
 */
export const uploadProductImage = async (productId, fileBuffer, mimetype, fileExt) => {
  const filePath = `${productId}/image.${fileExt}`;
  
  const { data, error } = await supabaseStorage
    .storage
    .from('product-images')
    .upload(filePath, fileBuffer, {
      upsert: true,
      contentType: mimetype
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabaseStorage
    .storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

/**
 * Repository: Xóa ảnh sản phẩm khỏi Supabase Storage
 */
export const deleteProductImage = async (productId) => {
  const { data: files, error: listError } = await supabaseStorage
    .storage
    .from('product-images')
    .list(productId);

  if (listError) {
    throw listError;
  }

  if (files && files.length > 0) {
    const filePaths = files.map(file => `${productId}/${file.name}`);
    const { error: deleteError } = await supabaseStorage
      .storage
      .from('product-images')
      .remove(filePaths);

    if (deleteError) {
      throw deleteError;
    }
  }

  return true;
};
