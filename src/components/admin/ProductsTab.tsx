
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Edit, Trash, ChevronLeft, ChevronRight, DollarSign, Package } from 'lucide-react';

const ProductsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Mock products data
  const mockProducts = [
    { id: 1, name: "Moisturizer Cream", price: 45, stock: 24, relatedServices: ["Facial Treatment"] },
    { id: 2, name: "Anti-Aging Serum", price: 75, stock: 18, relatedServices: ["Facial Treatment"] },
    { id: 3, name: "Hair Care Kit", price: 60, stock: 15, relatedServices: ["Hair Styling", "Hair Treatment"] },
    { id: 4, name: "Facial Cleansing Gel", price: 35, stock: 30, relatedServices: ["Facial Treatment"] },
    { id: 5, name: "Luxury Makeup Palette", price: 85, stock: 12, relatedServices: ["Makeup Application"] },
    { id: 6, name: "Nail Care Set", price: 40, stock: 20, relatedServices: ["Manicure", "Pedicure"] },
    { id: 7, name: "Body Scrub", price: 38, stock: 22, relatedServices: ["Body Treatment"] },
    { id: 8, name: "Hair Styling Gel", price: 25, stock: 35, relatedServices: ["Hair Styling"] },
    { id: 9, name: "Eye Cream", price: 55, stock: 16, relatedServices: ["Facial Treatment"] },
    { id: 10, name: "Lip Balm Collection", price: 30, stock: 28, relatedServices: ["Makeup Application"] },
    { id: 11, name: "Massage Oil", price: 42, stock: 25, relatedServices: ["Massage Therapy"] },
    { id: 12, name: "Hair Mask", price: 48, stock: 20, relatedServices: ["Hair Treatment"] }
  ];
  
  // Filter products based on search term
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Related Services</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium flex items-center justify-end">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    {product.price}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stock < 20 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        {product.stock}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {product.stock}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.relatedServices.map((service, index) => (
                        <span key={index} className="text-xs bg-glamour-100 text-glamour-800 px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} entries
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductsTab;
