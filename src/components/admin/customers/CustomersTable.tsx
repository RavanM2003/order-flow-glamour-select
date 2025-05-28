
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";
import CustomerActions from "@/components/admin/CustomerActions";
import { Customer } from "@/models/customer.model";

interface CustomersTableProps {
  customers: Customer[];
  onViewOrders: (customer: Customer) => void;
  onCreateAppointment: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
  className?: string;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ 
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

export default CustomersTable;
