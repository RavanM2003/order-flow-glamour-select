
import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/use-appointments';
import { formatDate } from '@/utils/format';

const PaymentDetails = () => {
  const { orderState, setSelectedService } = useOrder();
  const { customer, selectedStaff: staff, appointmentDate: date, appointmentTime: startTime, totalAmount, selectedService: service } = orderState;
  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate end time based on service duration
  const endTime = startTime && service?.duration 
    ? calculateEndTime(startTime, service.duration)
    : '';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!date || !customer || !service) {
      // Handle validation
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure we're using correct types for the appointment
      const appointmentData = {
        customer_user_id: customer.id,
        appointment_date: typeof date === 'object' ? formatDate(date) : date,
        start_time: startTime || '',
        end_time: endTime, 
        // Use the correct status enum value that matches backend expectations
        status: 'scheduled' as const, // Type assertion to ensure it's a valid appointment status
        total: service.price,
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

  // Helper function to calculate end time
  function calculateEndTime(start: string, durationMinutes: number): string {
    const [hours, minutes] = start.split(':').map(Number);
    
    let totalMinutes = hours * 60 + minutes + durationMinutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
      
      {/* Display Order Details */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Order Summary</h3>
        <p>Service: {service?.name}</p>
        <p>Date: {date ? formatDate(date) : 'Not selected'}</p>
        <p>Time: {startTime} - {endTime}</p>
        <p>Total: ${service?.price?.toFixed(2)}</p>
      </div>
      
      {/* Display Customer Details */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Customer Information</h3>
        <p>Name: {customer?.name || customer?.full_name}</p>
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
