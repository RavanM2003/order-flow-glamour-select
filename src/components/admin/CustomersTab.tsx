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
import { PlusIcon, SearchIcon } from "lucide-react";
import CustomerForm from "@/components/admin/CustomerForm";
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

const CustomersTable = ({ customers, onViewCustomer }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Gender</TableHead>
        <TableHead>Last Visit</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {customers.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            No customers found
          </TableCell>
        </TableRow>
      ) : (
        customers.map((customer: Customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              {customer.full_name || customer.name || "N/A"}
            </TableCell>
            <TableCell>{customer.email || "N/A"}</TableCell>
            <TableCell>{customer.phone || "N/A"}</TableCell>
            <TableCell className="capitalize">
              {customer.gender || "N/A"}
            </TableCell>
            <TableCell>
              {customer.lastVisit ? formatDate(customer.lastVisit) : "Never"}
            </TableCell>
            <TableCell>
              <Badge variant={customer.user_id ? "default" : "outline"}>
                {customer.user_id ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewCustomer(customer.id.toString())}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
);

const CustomersHeader = ({ searchTerm, setSearchTerm, onAddClick }) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Customers</CardTitle>
    <div className="flex items-center gap-2">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="w-[200px] pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick}>
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  const handleViewCustomer = (customerId: string) => {
    navigate(`/admin/customers/${customerId}`);
  };

  return (
    <Card>
      <CustomersHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => setIsFormOpen(true)}
      />
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading customers...</div>
        ) : error ? (
          <div className="text-red-500 p-4">Error: {error}</div>
        ) : (
          <CustomersTable
            customers={filteredCustomers}
            onViewCustomer={handleViewCustomer}
          />
        )}
      </CardContent>

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
    </Card>
  );
};

export default CustomersTab;
