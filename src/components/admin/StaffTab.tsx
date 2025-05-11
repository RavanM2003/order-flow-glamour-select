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
import { 
  Search, 
  Edit, 
  Trash, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Percent,
  Scissors,
  CalendarPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StaffTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Mock staff data
  const mockStaff = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      role: "Hair Stylist", 
      email: "sarah@glamourstudio.az",
      phone: "+994 50 123 4567", 
      paymentType: "commission", 
      paymentValue: 40,
      services: ["Hair Styling", "Hair Treatment", "Hair Coloring"]
    },
    { 
      id: 2, 
      name: "David Chen", 
      role: "Makeup Artist", 
      email: "david@glamourstudio.az",
      phone: "+994 55 234 5678", 
      paymentType: "commission", 
      paymentValue: 35,
      services: ["Makeup Application", "Eyebrow Shaping"]
    },
    { 
      id: 3, 
      name: "Amina Khalid", 
      role: "Esthetician", 
      email: "amina@glamourstudio.az",
      phone: "+994 70 345 6789", 
      paymentType: "salary", 
      paymentValue: 1200,
      services: ["Facial Treatment", "Body Treatment", "Waxing"]
    },
    { 
      id: 4, 
      name: "Michael Rodriguez", 
      role: "Massage Therapist", 
      email: "michael@glamourstudio.az",
      phone: "+994 77 456 7890", 
      paymentType: "commission", 
      paymentValue: 45,
      services: ["Massage Therapy"]
    },
    { 
      id: 5, 
      name: "Leyla Mammadova", 
      role: "Nail Technician", 
      email: "leyla@glamourstudio.az",
      phone: "+994 50 567 8901", 
      paymentType: "salary", 
      paymentValue: 900,
      services: ["Manicure", "Pedicure"]
    },
    { 
      id: 6, 
      name: "John Smith", 
      role: "Hair Stylist", 
      email: "john@glamourstudio.az",
      phone: "+994 55 678 9012", 
      paymentType: "commission", 
      paymentValue: 40,
      services: ["Hair Styling", "Hair Treatment"]
    }
  ];
  
  // Filter staff based on search term
  const filteredStaff = mockStaff.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate staff
  const totalPages = Math.ceil(filteredStaff.length / pageSize);
  const currentStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-glamour-800">Staff Management</h2>
          <Button className="bg-glamour-700 hover:bg-glamour-800 text-white" onClick={() => setAddServiceOpen(true)}>
            <CalendarPlus className="w-4 h-4 mr-2" /> Add Staff
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search staff..." 
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
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.id}</TableCell>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{staff.email}</div>
                      <div className="text-muted-foreground">{staff.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {staff.paymentType === 'commission' ? (
                        <>
                          <Percent className="h-4 w-4 mr-1 text-green-600" />
                          <span>{staff.paymentValue}% Commission</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                          <span>${staff.paymentValue} Monthly</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {staff.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="flex items-center">
                          <Scissors className="h-3 w-3 mr-1" />
                          {service}
                        </Badge>
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
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredStaff.length)} of {filteredStaff.length} entries
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

export default StaffTab;
