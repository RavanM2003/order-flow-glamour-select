
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Customer } from '@/models/customer.model';

interface CustomerInfoProps {
  initialData?: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    notes?: string;
  };
  onSubmit: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
  }) => void;
  onCancel?: () => void;
  selectedCustomer?: Customer | null;
  disabled?: boolean;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  selectedCustomer,
  disabled = false,
}) => {
  const [customerName, setCustomerName] = useState(initialData.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialData.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(initialData.customerEmail || '');
  const [notes, setNotes] = useState(initialData.notes || '');

  // Update form when selectedCustomer changes
  useEffect(() => {
    if (selectedCustomer) {
      setCustomerName(selectedCustomer.name || '');
      setCustomerPhone(selectedCustomer.phone || '');
      setCustomerEmail(selectedCustomer.email || '');
    }
  }, [selectedCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customerName,
      customerPhone,
      customerEmail,
      notes,
    });
  };

  // Determine if customer fields should be disabled
  // They should be disabled if 'disabled' prop is true OR if we have a selectedCustomer
  const customerFieldsDisabled = disabled || !!selectedCustomer;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
          />
        </div>
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
