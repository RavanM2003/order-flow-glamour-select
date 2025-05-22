import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  UserCircle,
  UserPlus,
  Phone,
  Mail,
} from "lucide-react";
import DetailDrawer from "@/components/common/DetailDrawer";
import CustomerDetailPage from "@/pages/CustomerDetailPage";
import CheckoutFlow from "@/components/CheckoutFlow";
import { OrderProvider } from "@/context/OrderContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Customer } from "@/models/customer.model";
import { useCustomers } from "@/hooks/use-customers";
import CustomerInfo from "@/components/CustomerInfo";

const CustomersTab = () => {
  const { toast } = useToast();
  const { customers, loading, fetchCustomers, createCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
  const [selectedCustomerForAppointment, setSelectedCustomerForAppointment] =
    useState<Customer | null>(null);
  const pageSize = 10;

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "female" as "female" | "male" | "other",
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  // Paginate customers
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewCustomer = (customer: Customer) => {
    setViewCustomer(customer);
    setDrawerOpen(true);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Missing Information",
        description: "Name and phone are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createCustomer(newCustomer);
      
      if (result) {
        setAddCustomerOpen(false);
        setNewCustomer({ name: "", email: "", phone: "", gender: "female" });
        
        // Refresh the customers list
        await fetchCustomers();

        // Automatically open appointment drawer for the new customer if we have customer data
        if (result) {
          setSelectedCustomerForAppointment(result);
          setAddAppointmentOpen(true);
        }
      }
    } catch (error) {
      console.error("Failed to add customer:", error);
      toast({
        title: "Error adding customer",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleAddAppointment = (customer: Customer) => {
    setSelectedCustomerForAppointment(customer);
    setAddAppointmentOpen(true);
  };

  // Display a serial number for customers in the table
  const getDisplayId = (index: number) => {
    return ((currentPage - 1) * pageSize) + index + 1;
  };

  // Get icon color based on gender
  const getGenderIcon = (gender: string) => {
    switch(gender) {
      case "female":
        return <UserCircle className="h-4 w-4 mr-2 text-pink-500" />;
      case "male":
        return <UserCircle className="h-4 w-4 mr-2 text-blue-500" />;
      default:
        return <UserCircle className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  useEffect(() => {
    // Ensure we have the latest data
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-glamour-800">Customers</h2>
            <Button
              className="bg-glamour-700 hover:bg-glamour-800 text-white"
              onClick={() => setAddCustomerOpen(true)}
            >
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
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last Visit
                    </TableHead>
                    <TableHead className="text-right hidden md:table-cell">
                      Total Spent
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentCustomers.map((customer, index) => (
                      <TableRow key={customer.id}>
                        <TableCell>{getDisplayId(index)}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getGenderIcon(customer.gender)}
                            {customer.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer.email || "-"}
                        </TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(customer.lastVisit || customer.created_at || '').toLocaleDateString() || "-"}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          ${customer.totalSpent || 0}
                        </TableCell>
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
                Showing{" "}
                {filteredCustomers.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}{" "}
                to {Math.min(currentPage * pageSize, filteredCustomers.length)}{" "}
                of {filteredCustomers.length} entries
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Customer Details Drawer */}
        <DetailDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title="Customer Details"
          className="max-w-2xl"
        >
          {viewCustomer && <CustomerDetailPage customer={viewCustomer} />}
        </DetailDrawer>

        {/* Add Customer Drawer */}
        <DetailDrawer
          open={addCustomerOpen}
          onOpenChange={setAddCustomerOpen}
          title="Add New Customer"
        >
          <form onSubmit={handleAddCustomer} className="space-y-6 p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-base font-medium">Gender</Label>
                <RadioGroup
                  value={newCustomer.gender}
                  onValueChange={(value: "female" | "male" | "other") =>
                    setNewCustomer({ ...newCustomer, gender: value })
                  }
                  className="grid grid-cols-3 gap-4 mt-1"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label
                      htmlFor="gender-female"
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <UserCircle className="h-5 w-5 mr-2 text-pink-500" />
                      <span>Female</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label
                      htmlFor="gender-male"
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <UserCircle className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Male</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="other" id="gender-other" />
                    <Label
                      htmlFor="gender-other"
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <UserCircle className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Other</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+994 XX XXX XX XX"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for customer identification
                  </p>
                </div>

                <div>
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional for communications
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddCustomerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-glamour-700 hover:bg-glamour-800 text-white"
              >
                Save Customer
              </Button>
            </div>
          </form>
        </DetailDrawer>

        {/* Add Appointment Drawer */}
        <DetailDrawer
          open={addAppointmentOpen}
          onOpenChange={(open) => {
            setAddAppointmentOpen(open);
            if (!open) setSelectedCustomerForAppointment(null);
          }}
          title="Book Appointment"
          className="w-full max-w-2xl"
        >
          <OrderProvider initialCustomer={selectedCustomerForAppointment}>
            <CheckoutFlow bookingMode="staff" />
          </OrderProvider>
        </DetailDrawer>
      </div>
    </>
  );
};

export default CustomersTab;
