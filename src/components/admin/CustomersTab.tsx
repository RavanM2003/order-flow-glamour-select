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
import { Search, Eye, Edit, ChevronLeft, ChevronRight, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import DetailDrawer from '@/components/common/DetailDrawer';
import CustomerDetailPage from '@/pages/CustomerDetailPage';
import CheckoutFlow from '@/components/CheckoutFlow';
import { OrderProvider } from '@/context/OrderContext';

const CustomersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
  const [selectedCustomerForAppointment, setSelectedCustomerForAppointment] = useState(null);
  const pageSize = 10;
  
  // Mock customers data
  const mockCustomers = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `+994 50 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
    lastVisit: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    totalSpent: Math.floor(50 + Math.random() * 950)
  }));

  // Mock appointments, products, staff for a customer
  const mockDetails = {
    appointments: [
      { id: 1, date: '2024-06-10', service: 'Facial Treatment', staff: 'Aysel Məmmədova' },
      { id: 2, date: '2024-06-15', service: 'Hair Styling', staff: 'Elvin Əliyev' },
    ],
    products: [
      { id: 1, name: 'Moisturizer Cream' },
      { id: 2, name: 'Anti-Aging Serum' },
    ],
    staff: [
      { id: 1, name: 'Aysel Məmmədova' },
      { id: 2, name: 'Elvin Əliyev' },
    ]
  };

  // Filter customers based on search term
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.phone.includes(searchTerm)
  );
  
  // Paginate customers
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Edit form state
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = () => {
    // Save logic here (mock)
    setViewCustomer({ ...viewCustomer, ...editForm });
    setEditMode(false);
  };

  const handleViewCustomer = (customer) => {
    setViewCustomer(customer);
    setDrawerOpen(true);
  };

  // Add Customer logic
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [addCustomerError, setAddCustomerError] = useState('');
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setAddCustomerError('All fields are required');
      return;
    }
    setViewCustomer({ ...newCustomer, id: mockCustomers.length + 1, lastVisit: new Date().toLocaleDateString(), totalSpent: 0 });
    setAddCustomerOpen(false);
    setAddCustomerError('');
  };

  // Reset form when drawer opens/closes
  React.useEffect(() => {
    if (!addCustomerOpen) {
      setNewCustomer({ name: '', email: '', phone: '' });
      setAddCustomerError('');
    }
  }, [addCustomerOpen]);

  return (
    <>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-glamour-800">Customers</h2>
            <Button className="bg-glamour-700 hover:bg-glamour-800 text-white" onClick={() => { setSelectedCustomerForAppointment(null); setAddAppointmentOpen(true); }}>
              <CalendarPlus className="w-4 h-4 mr-2" /> Add Customer
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or phone..." 
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
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.lastVisit}</TableCell>
                    <TableCell className="text-right">${customer.totalSpent}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewCustomer(customer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => { setSelectedCustomerForAppointment(customer); setAddAppointmentOpen(true); }}>
                          <CalendarPlus className="h-4 w-4" />
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length} entries
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
        <DetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Customer Details">
          {viewCustomer && <CustomerDetailPage customer={viewCustomer} />}
        </DetailDrawer>
        {/* Add Customer Drawer */}
        <DetailDrawer open={addCustomerOpen} onOpenChange={setAddCustomerOpen} title="Add Customer">
          <form onSubmit={handleAddCustomer} className="space-y-4 p-4">
            <Input
              placeholder="Full Name"
              value={newCustomer.name}
              onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={newCustomer.email}
              onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              required
            />
            {addCustomerError && <div className="text-red-600 text-sm">{addCustomerError}</div>}
            <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800 text-white w-full">Add Customer</Button>
          </form>
        </DetailDrawer>
        {/* Add Appointment Drawer */}
        <DetailDrawer open={addAppointmentOpen} onOpenChange={(open) => {
          setAddAppointmentOpen(open);
        }} title="Book now">
          <OrderProvider>
            <CheckoutFlow />
          </OrderProvider>
        </DetailDrawer>
      </div>
    </>
  );
};

export default CustomersTab;
