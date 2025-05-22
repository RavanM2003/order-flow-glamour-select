// Fix the ProductList component issues with isLoading and fetchProducts
import React, { useEffect } from 'react';
import { useProductData } from '../hooks/useProductData';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Product } from '@/models/product.model';

interface ProductListProps {
  products?: Product[];
  loading?: boolean;
  error?: string;
}
  
const ProductList = () => {
  const { products, loading: isLoading, error } = useProductData();
  const navigate = useNavigate();
  
  // If we need fetchProducts functionality, implement it like this:
  useEffect(() => {
    // Products are loaded by useProductData hook automatically
  }, []);  
  
  const handleAddNew = () => {
    navigate('/admin/products/new');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleAddNew}>Add New</Button>
      </div>
      
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductList;
