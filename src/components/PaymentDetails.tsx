import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAppointments } from '@/hooks/use-appointments';
import { useNavigate } from 'react-router-dom';
import { useCurrentUserId } from '@/hooks/use-current-user-id';
import { withUserId } from '@/utils/withUserId';
import { toast } from '@/components/ui/use-toast';

const PaymentDetails = () => {
  const { orderState, setPaymentMethod, nextStep, prevStep } = useOrder();
  const { createAppointment } = useAppointments();
  const navigate = useNavigate();
  const currentUserId = useCurrentUserId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!orderState.paymentMethod) {
      toast({
        variant: "destructive",
        title: "Payment method required",
        description: "Please select a payment method to continue",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare appointment data
      const paymentData = {
        customer_user_id: orderState.customer?.id || '',
        appointment_date: orderState.appointmentDate?.toISOString().split('T')[0] || '',
        start_time: orderState.appointmentTime || '',
        end_time: calculateEndTime(orderState.appointmentTime || '', orderState.selectedService?.duration || 0),
        status: 'scheduled',
        total: orderState.totalAmount,
        notes: `Payment method: ${orderState.paymentMethod}`,
      };

      // Add user ID to the data
      const appointmentWithUserId = withUserId(paymentData);

      // Create the appointment
      const result = await createAppointment({
        ...appointmentWithUserId,
        customerId: orderState.customer?.id || '',
        date: appointmentWithUserId.appointment_date,
        startTime: appointmentWithUserId.start_time,
        service: orderState.selectedService?.name || '',
      });

      if (result) {
        nextStep();
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error instanceof Error ? error.message : "An error occurred while booking your appointment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Order Summary</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{orderState.selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{orderState.appointmentDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{orderState.appointmentTime}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${orderState.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-2">Select Payment Method</h3>
              <RadioGroup 
                value={orderState.paymentMethod || ''} 
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash (Pay at salon)</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online Payment</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentDetails;
