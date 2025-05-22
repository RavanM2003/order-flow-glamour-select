import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductFormData, Product } from '@/models/product.model';
import { useProductActions } from '../hooks/useProductActions';
import { Switch } from '@/components/ui/switch';

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  description: z.string().optional(),
  stock_quantity: z.number().min(0, 'Stock quantity must be 0 or greater').optional(),
  category: z.string().optional(),
  image_url: z.string().optional().nullable(),
  isServiceRelated: z.boolean().optional()
});

// Interface for component props
interface ProductFormProps {
  product?: Product; // Provide for edit mode, omit for create mode
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSuccess,
  onCancel
}) => {
  const isEditMode = !!product;
  const { createProduct, updateProduct, loading, isCreating, isUpdating } = useProductActions();
  
  // Initialize form with schema validation
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      stock_quantity: 0,
      category: '',
      image_url: null,
      isServiceRelated: false
    }
  });
  
  // Populate form when product data is available (edit mode)
  React.useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        description: product.description || '',
        stock_quantity: product.stock_quantity || 0,
        image_url: product.image_url || null,
        isServiceRelated: product.isServiceRelated || false
      });
    }
  }, [product, form]);
  
  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    try {
      let response;
      
      if (isEditMode && product) {
        response = await updateProduct(product.id!, data);
      } else {
        response = await createProduct(data);
      }
      
      if (response.data && onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Product' : 'Create New Product'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Stock Quantity Field */}
            <FormField
              control={form.control}
              name="stock_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Is Service Related Field */}
            <FormField
              control={form.control}
              name="isServiceRelated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Related to Services</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProductForm;
