
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomerForm from "@/components/admin/CustomerForm";
import CustomerDetailsDrawer from "@/components/admin/CustomerDetailsDrawer";
import CustomerOrdersAccordion from "@/components/admin/CustomerOrdersAccordion";
import CreateAppointmentModal from "@/components/admin/CreateAppointmentModal";
import DetailDrawer from "@/components/common/DetailDrawer";
import { Customer } from "@/models/customer.model";

interface CustomersModalsProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  selectedCustomerForDetails: Customer | null;
  setSelectedCustomerForDetails: (customer: Customer | null) => void;
  selectedCustomerForOrders: Customer | null;
  setSelectedCustomerForOrders: (customer: Customer | null) => void;
  selectedCustomerForAppointment: Customer | null;
  setSelectedCustomerForAppointment: (customer: Customer | null) => void;
  fetchCustomers: () => void;
}

const CustomersModals: React.FC<CustomersModalsProps> = ({
  isFormOpen,
  setIsFormOpen,
  selectedCustomerForDetails,
  setSelectedCustomerForDetails,
  selectedCustomerForOrders,
  setSelectedCustomerForOrders,
  selectedCustomerForAppointment,
  setSelectedCustomerForAppointment,
  fetchCustomers
}) => (
  <>
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
  </>
);

export default CustomersModals;
