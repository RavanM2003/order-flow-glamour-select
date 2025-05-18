
/**
 * Products feature export file
 */

// Export components
export { default as ProductList } from './components/ProductList';
export { default as ProductForm } from './components/ProductForm';
export { default as ProductDetail } from './components/ProductDetail';

// Export hooks
export { useProductData } from './hooks/useProductData';
export { useProductActions } from './hooks/useProductActions';

// Export types
export type { Product, ProductFormData } from '@/models/product.model';

// Export service
export { productService } from '@/services/product.service';

// Export routes
export { default as productRoutes } from './routes';
