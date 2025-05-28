
import { useEffect, useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/format";
import { PlusIcon, SearchIcon, EyeIcon, CalendarIcon } from "lucide-react";
import CustomerForm from "@/components/admin/CustomerForm";
import CustomerOrdersAccordion from "@/components/admin/CustomerOrdersAccordion";
import CreateAppointmentModal from "@/components/admin/CreateAppointmentModal";
import DetailDrawer from "@/components/common/DetailDrawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Customer } from "@/models/customer.model";

const CustomersTable = ({ 
  customers, 
  onViewOrders, 
  onCreateAppointment,
  className = ""
}) => (
  <div className={`overflow-x-auto ${className}`}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[120px]">Name</TableHead>
          <TableHead className="hidden sm:table-cell min-w-[150px]">Email</TableHead>
          <TableHead className="min-w-[100px]">Phone</TableHead>
          <TableHead className="hidden md:table-cell">Gender</TableHead>
          <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>
          <TableHead className="text-right min-w-[120px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No customers found
            </TableCell>
          </TableRow>
        ) : (
          customers.map((customer: Customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{customer.full_name || customer.name || "N/A"}</div>
                  <div className="text-sm text-gray-500 sm:hidden">{customer.email || "N/A"}</div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{customer.email || "N/A"}</TableCell>
              <TableCell>{customer.phone || "N/A"}</TableCell>
              <TableCell className="hidden md:table-cell capitalize">
                {customer.gender || "N/A"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {customer.lastVisit ? formatDate(customer.lastVisit) : "Never"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant={(customer.user_id || customer.id) ? "default" : "outline"}>
                  {(customer.user_id || customer.id) ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewOrders(customer)}
                    className="text-xs px-2 py-1"
                  >
                    <EyeIcon className="h-3 w-3 mr-1" />
                    Orders
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCreateAppointment(customer)}
                    className="text-xs px-2 py-1"
                  >
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Appointment
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

const CustomersHeader = ({ searchTerm, setSearchTerm, onAddClick }) => (
  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <CardTitle>Customers</CardTitle>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="w-full sm:w-[200px] pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Customer
      </Button>
    </div>
  </CardHeader>
);

const AddCustomerDialogContent = ({ onSuccess }) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Customer</DialogTitle>
      </DialogHeader>
      <CustomerForm onSuccess={onSuccess} />
    </>
  );
};

const CustomersTab = () => {
  const { customers, isLoading, error, fetchCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomerForOrders, setSelectedCustomerForOrders] = useState<Customer | null>(null);
  const [selectedCustomerForAppointment, setSelectedCustomerForAppointment] = useState<Customer | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.full_name || customer.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  const handleViewOrders = (customer: Customer) => {
    setSelectedCustomerForOrders(customer);
  };

  const handleCreateAppointment = (customer: Customer) => {
    setSelectedCustomerForAppointment(customer);
  };

  return (
    <Card>
      <CustomersHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => setIsFormOpen(true)}
      />
      <CardContent className="p-0 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading customers...</div>
        ) : error ? (
          <div className="text-red-500 p-8 text-center">Error: {error}</div>
        ) : (
          <CustomersTable
            customers={filteredCustomers}
            onViewOrders={handleViewOrders}
            onCreateAppointment={handleCreateAppointment}
            className="px-4 sm:px-0"
          />
        )}
      </CardContent>

      {/* Add Customer Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <AddCustomerDialogContent
            onSuccess={() => {
              setIsFormOpen(false);
              fetchCustomers();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Customer Orders Drawer */}
      <DetailDrawer
        open={!!selectedCustomerForOrders}
        onOpenChange={(open) => !open && setSelectedCustomerForOrders(null)}
        title={`Orders - ${selectedCustomerForOrders?.name || 'Customer'}`}
        position="right"
      >
        {selectedCustomerForOrders && (
          <CustomerOrdersAccordion customerId={selectedCustomerForOrders.id} />
        )}
      </DetailDrawer>

      {/* Create Appointment Modal */}
      {selectedCustomerForAppointment && (
        <CreateAppointmentModal
          customer={selectedCustomerForAppointment}
          open={!!selectedCustomerForAppointment}
          onOpenChange={(open) => !open && setSelectedCustomerForAppointment(null)}
          onSuccess={fetchCustomers}
        />
      )}
    </Card>
  );
};

export default CustomersTab;
