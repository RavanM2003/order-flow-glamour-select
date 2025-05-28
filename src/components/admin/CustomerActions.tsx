
import { Button } from "@/components/ui/button";
import { EyeIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Customer } from "@/models/customer.model";

interface CustomerActionsProps {
  customer: Customer;
  onViewOrders: (customer: Customer) => void;
  onCreateAppointment: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
}

const CustomerActions = ({ 
  customer, 
  onViewOrders, 
  onCreateAppointment, 
  onViewDetails 
}: CustomerActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewDetails(customer)}
        className="text-xs px-2 py-1"
      >
        <UserIcon className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Details</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewOrders(customer)}
        className="text-xs px-2 py-1"
      >
        <EyeIcon className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Orders</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCreateAppointment(customer)}
        className="text-xs px-2 py-1"
      >
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Appointment</span>
      </Button>
    </div>
  );
};

export default CustomerActions;
