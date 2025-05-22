// Fix imports and type issues with appointment status
import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/use-appointments';
import { formatDate } from '@/utils/format';

const PaymentDetails = () => {
  const { order, customer, staff, service } = useOrder();
  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!order || !customer || !service) {
      // Handle validation
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure we're using correct types for the appointment
      const appointmentData = {
        customer_user_id: customer.id,
        appointment_date: order.date,
        start_time: order.startTime,
        end_time: order.endTime || '', // Make sure we have an end time
        // Use the correct status enum value that matches backend expectations
        status: 'scheduled', // Use the enum value expected by the backend
        total: service.price,
        // Don't include notes if it's not part of the expected shape
        user_id: staff?.id || null
      };
      
      const result = await createAppointment(appointmentData);
      
      if (result) {
        navigate('/booking/confirmation', { 
          state: { 
            appointment: result,
            service: service
          } 
        });
      }
    } catch (error) {
      console.error('Failed to create appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
      
      {/* Display Order Details */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Order Summary</h3>
        <p>Service: {service?.name}</p>
        <p>Date: {formatDate(order?.date)}</p>
        <p>Time: {order?.startTime} - {order?.endTime}</p>
        <p>Total: ${service?.price?.toFixed(2)}</p>
      </div>
      
      {/* Display Customer Details */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Customer Information</h3>
        <p>Name: {customer?.full_name}</p>
        <p>Email: {customer?.email}</p>
        <p>Phone: {customer?.phone}</p>
      </div>
      
      {/* Display Staff Details */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Staff</h3>
        <p>Name: {staff?.full_name || 'Any'}</p>
      </div>
      
      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Confirm and Pay'}
        </Button>
      </form>
    </div>
  );
};

export default PaymentDetails;
