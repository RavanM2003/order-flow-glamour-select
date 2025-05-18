
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductData } from '../hooks/useProductData';
import { useProductActions } from '../hooks/useProductActions';
import { Product, ProductFormData } from '@/models/product.model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct } = useProductData();
  const { createProduct, updateProduct, isLoading } = useProductActions(() => navigate('/admin/products'));
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    stock_quantity: 0
  });

  const isNewProduct = id === 'new';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isNewProduct) {
        const product = await getProduct(id as string);
        if (product) {
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description || '',
            stock_quantity: product.stock_quantity || 0,
            image_url: product.image_url || ''
          });
        }
      }
    };

    fetchProduct();
  }, [id, getProduct, isNewProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNewProduct) {
      await createProduct(formData);
    } else {
      await updateProduct(id as string, formData);
    }
  };

  return (
    <div className="p-6">
      <Button 
        variant="outline" 
        className="mb-4" 
        onClick={() => navigate('/admin/products')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{isNewProduct ? 'Create New Product' : 'Edit Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleChange}
                placeholder="http://example.com/image.jpg"
              />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
