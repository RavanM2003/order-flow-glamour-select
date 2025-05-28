
import { useEffect, useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { usePagination } from "@/hooks/use-pagination";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate } from "@/utils/format";
import { PlusIcon, SearchIcon } from "lucide-react";
import CustomerForm from "@/components/admin/CustomerForm";
import CustomerOrdersAccordion from "@/components/admin/CustomerOrdersAccordion";
import CustomerDetailsDrawer from "@/components/admin/CustomerDetailsDrawer";
import CustomerActions from "@/components/admin/CustomerActions";
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
import { Customer } from "@/models/customer.model";

const ITEMS_PER_PAGE = 10;

const CustomersTable = ({ 
  customers, 
  onViewOrders, 
  onCreateAppointment,
  onViewDetails,
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
          <TableHead className="text-right min-w-[140px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!customers || customers.length === 0 ? (
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
                <CustomerActions
                  customer={customer}
                  onViewOrders={onViewOrders}
                  onCreateAppointment={onCreateAppointment}
                  onViewDetails={onViewDetails}
                />
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

const CustomersTab = () => {
  const { customers, isLoading, error, fetchCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomerForOrders, setSelectedCustomerForOrders] = useState<Customer | null>(null);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<Customer | null>(null);
  const [selectedCustomerForAppointment, setSelectedCustomerForAppointment] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const safeCustomers = Array.isArray(customers) ? customers : [];
  
  const filteredCustomers = safeCustomers.filter(
    (customer) =>
      (customer.full_name || customer.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage
  } = usePagination({
    items: filteredCustomers,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const handleViewOrders = (customer: Customer) => {
    setSelectedCustomerForOrders(customer);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomerForDetails(customer);
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
          <>
            <CustomersTable
              customers={paginatedItems}
              onViewOrders={handleViewOrders}
              onCreateAppointment={handleCreateAppointment}
              onViewDetails={handleViewDetails}
              className="px-4 sm:px-0"
            />
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    {hasPrevPage && (
                      <PaginationItem>
                        <PaginationPrevious onClick={prevPage} />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => goToPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {hasNextPage && (
                      <PaginationItem>
                        <PaginationNext onClick={nextPage} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Add Customer Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSuccess={() => {
              setIsFormOpen(false);
              fetchCustomers();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Customer Details Drawer */}
      <DetailDrawer
        open={!!selectedCustomerForDetails}
        onOpenChange={(open) => !open && setSelectedCustomerForDetails(null)}
        title={`Customer Details - ${selectedCustomerForDetails?.name || 'Customer'}`}
        position="right"
      >
        {selectedCustomerForDetails && (
          <CustomerDetailsDrawer customer={selectedCustomerForDetails} />
        )}
      </DetailDrawer>

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
