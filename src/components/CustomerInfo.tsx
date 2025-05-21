
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Customer } from "@/models/customer.model";
import { Phone, Mail, UserCircle } from "lucide-react";
import { useOrder } from "@/context/OrderContext";

interface CustomerInfoProps {
  initialData?: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    notes?: string;
  };
  onSubmit?: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
  }) => void;
  onCancel?: () => void;
  selectedCustomer?: Customer | null;
  disabled?: boolean;
  bookingMode?: "customer" | "staff";
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  selectedCustomer,
  disabled = false,
  bookingMode,
}) => {
  const [customerName, setCustomerName] = useState(
    initialData.customerName || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    initialData.customerPhone || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    initialData.customerEmail || ""
  );
  const [notes, setNotes] = useState(initialData.notes || "");
  const { orderState, updateOrderDetails } = useOrder();

  // Update form when selectedCustomer changes
  useEffect(() => {
    if (selectedCustomer) {
      setCustomerName(selectedCustomer.name || "");
      setCustomerPhone(selectedCustomer.phone || "");
      setCustomerEmail(selectedCustomer.email || "");
    }
  }, [selectedCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      customerName,
      customerPhone,
      customerEmail,
      notes,
    };
    
    if (onSubmit) {
      onSubmit(data);
    } else {
      // If no onSubmit prop is provided, use the OrderContext
      updateOrderDetails({
        currentStep: 2,
        customer: {
          id: selectedCustomer?.id || "",
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          gender: selectedCustomer?.gender || "other",
        },
        notes
      });
    }
  };

  // Determine if customer fields should be disabled
  // They should be disabled if 'disabled' prop is true OR if we have a selectedCustomer
  const customerFieldsDisabled = disabled || !!selectedCustomer;

  // Get gender-based icon color
  const getGenderColor = () => {
    if (!selectedCustomer) return "text-gray-500";
    
    switch(selectedCustomer.gender) {
      case "female": return "text-pink-500";
      case "male": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedCustomer ? (
        // Compact display for selected customer
        <div className="p-4 bg-gray-50 rounded-md border mb-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className={`h-5 w-5 ${getGenderColor()}`} />
            <h3 className="font-medium">{customerName}</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span>{customerPhone}</span>
            </div>
            {customerEmail && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{customerEmail}</span>
              </div>
            )}
            {selectedCustomer.id && (
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">ID:</span> {selectedCustomer.id}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Standard form for new customer entry
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              required
              disabled={customerFieldsDisabled}
              className={customerFieldsDisabled ? "bg-gray-50" : ""}
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter phone number"
              required
              disabled={customerFieldsDisabled}
              className={customerFieldsDisabled ? "bg-gray-50" : ""}
            />
          </div>

          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter email address"
              required
              disabled={customerFieldsDisabled}
              className={customerFieldsDisabled ? "bg-gray-50" : ""}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default CustomerInfo;
