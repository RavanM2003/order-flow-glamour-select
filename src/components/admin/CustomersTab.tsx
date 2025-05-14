
import React, { useState, useEffect } from 'react';
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
import { Search, Eye, ChevronLeft, ChevronRight, CalendarPlus, UserCircle, UserPlus } from 'lucide-react';
import DetailDrawer from '@/components/common/DetailDrawer';
import CustomerDetailPage from '@/pages/CustomerDetailPage';
import CheckoutFlow from '@/components/CheckoutFlow';
import { OrderProvider } from '@/context/OrderContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { API } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const CustomersTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewCustomer, setViewCustomer] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
  const [selectedCustomerForAppointment, setSelectedCustomerForAppointment] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'female'
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await API.customers.list();
        setCustomers(data || []);
      } catch (error) {
        console.error('Failed to load customers:', error);
        toast({
          title: "Error loading customers",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.phone?.includes(searchTerm)
  );
  
  // Paginate customers
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewCustomer = (customer: any) => {
    setViewCustomer(customer);
    setDrawerOpen(true);
  };
  
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Missing Information",
        description: "Name and phone are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data } = await API.customers.create(newCustomer);
      if (data) {
        setCustomers([data, ...customers]);
        setAddCustomerOpen(false);
        setNewCustomer({ name: '', email: '', phone: '', gender: 'female' });
        
        toast({
          title: "Customer added",
          description: `${data.name} has been added successfully`,
        });
        
        // Automatically open appointment drawer for the new customer
        setSelectedCustomerForAppointment(data);
        setAddAppointmentOpen(true);
      }
    } catch (error) {
      console.error('Failed to add customer:', error);
      toast({
        title: "Error adding customer",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleAddAppointment = (customer: any) => {
    setSelectedCustomerForAppointment(customer);
    setAddAppointmentOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-glamour-800">Customers</h2>
            <Button className="bg-glamour-700 hover:bg-glamour-800 text-white" onClick={() => setAddCustomerOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" /> Add Customer
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
          
          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Total Spent</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {customer.gender === 'female' && <UserCircle className="h-4 w-4 mr-2 text-pink-500" />}
                            {customer.gender === 'male' && <UserCircle className="h-4 w-4 mr-2 text-blue-500" />}
                            {customer.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{customer.email || '-'}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.lastVisit || '-'}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">${customer.totalSpent || 0}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleViewCustomer(customer)}
                              title="View customer details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleAddAppointment(customer)}
                              title="Add appointment for this customer"
                            >
                              <CalendarPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length} entries
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
          )}
        </Card>
        
        {/* Customer Details Drawer */}
        <DetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Customer Details">
          {viewCustomer && <CustomerDetailPage customer={viewCustomer} />}
        </DetailDrawer>
        
        {/* Add Customer Drawer */}
        <DetailDrawer open={addCustomerOpen} onOpenChange={setAddCustomerOpen} title="Add New Customer">
          <form onSubmit={handleAddCustomer} className="space-y-6 p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label className="text-base font-medium">Gender</Label>
                <RadioGroup 
                  value={newCustomer.gender} 
                  onValueChange={value => setNewCustomer({ ...newCustomer, gender: value })}
                  className="grid grid-cols-3 gap-4 mt-1"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female" className="flex items-center cursor-pointer flex-1">
                      <UserCircle className="h-5 w-5 mr-2 text-pink-500" />
                      <span>Female</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male" className="flex items-center cursor-pointer flex-1">
                      <UserCircle className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Male</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="other" id="gender-other" />
                    <Label htmlFor="gender-other" className="flex items-center cursor-pointer flex-1">
                      <UserCircle className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Other</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel" 
                    placeholder="+994 XX XXX XX XX"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Required for customer identification</p>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Optional for communications</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setAddCustomerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800 text-white">
                Save Customer
              </Button>
            </div>
          </form>
        </DetailDrawer>
        
        {/* Add Appointment Drawer */}
        <DetailDrawer 
          open={addAppointmentOpen} 
          onOpenChange={open => {
            setAddAppointmentOpen(open);
            if (!open) setSelectedCustomerForAppointment(null);
          }}
          title="Book Appointment"
          className="w-full md:max-w-3xl"
        >
          <div className="p-4 mb-4 bg-gray-50 rounded-md border">
            <h3 className="font-medium mb-2">Customer Information</h3>
            {selectedCustomerForAppointment && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {selectedCustomerForAppointment.name}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {selectedCustomerForAppointment.phone}
                </div>
                {selectedCustomerForAppointment.email && (
                  <div>
                    <span className="font-medium">Email:</span> {selectedCustomerForAppointment.email}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <OrderProvider initialCustomer={selectedCustomerForAppointment}>
            <CheckoutFlow bookingMode="staff" />
          </OrderProvider>
        </DetailDrawer>
      </div>
    </>
  );
};

export default CustomersTab;
