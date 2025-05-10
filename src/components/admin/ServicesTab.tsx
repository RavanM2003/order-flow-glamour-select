
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
import { Search, Edit, Trash, ChevronLeft, ChevronRight, Clock, DollarSign } from 'lucide-react';

const ServicesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Mock services data
  const mockServices = [
    { id: 1, name: "Facial Treatment", price: 150, duration: "60 min", products: ["Moisturizer Cream", "Anti-Aging Serum"] },
    { id: 2, name: "Massage Therapy", price: 120, duration: "45 min", products: ["Massage Oil"] },
    { id: 3, name: "Manicure", price: 50, duration: "30 min", products: ["Nail Polish", "Cuticle Oil"] },
    { id: 4, name: "Hair Styling", price: 80, duration: "45 min", products: ["Hair Care Kit", "Styling Gel"] },
    { id: 5, name: "Makeup Application", price: 90, duration: "60 min", products: ["Foundation", "Lipstick", "Mascara"] },
    { id: 6, name: "Body Treatment", price: 140, duration: "90 min", products: ["Body Scrub", "Body Lotion"] },
    { id: 7, name: "Hair Coloring", price: 110, duration: "120 min", products: ["Color Protection Shampoo"] },
    { id: 8, name: "Eyebrow Shaping", price: 35, duration: "20 min", products: ["Eyebrow Gel"] },
    { id: 9, name: "Pedicure", price: 60, duration: "45 min", products: ["Foot Cream", "Nail Polish"] },
    { id: 10, name: "Waxing", price: 40, duration: "30 min", products: ["Soothing Gel"] },
    { id: 11, name: "Hair Treatment", price: 95, duration: "60 min", products: ["Hair Mask", "Hair Serum"] },
    { id: 12, name: "Eyelash Extensions", price: 120, duration: "90 min", products: ["Eyelash Cleanser"] }
  ];
  
  // Filter services based on search term
  const filteredServices = mockServices.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate services
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const currentServices = filteredServices.slice(
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
              placeholder="Search services..." 
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
                <TableHead>Service Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Used Products</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {service.duration}
                  </TableCell>
                  <TableCell className="text-right font-medium flex items-center justify-end">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    {service.price}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {service.products.map((product, index) => (
                        <span key={index} className="text-xs bg-glamour-100 text-glamour-800 px-2 py-1 rounded-full">
                          {product}
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
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredServices.length)} of {filteredServices.length} entries
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

export default ServicesTab;
