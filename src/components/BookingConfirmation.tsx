
import React from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const { orderState, resetOrder } = useOrder();
  
  // Generate a order reference number if one doesn't exist
  const orderReference = orderState.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  
  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully scheduled.
          </p>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Booking Reference</p>
            <p className="text-lg font-semibold">{orderReference}</p>
          </div>
          
          <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg mb-6">
            {orderState.customerInfo?.date && orderState.customerInfo?.time && (
              <div className="flex justify-center items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-glamour-700" />
                <span className="font-medium">{orderState.customerInfo.date}</span>
                <Clock className="h-5 w-5 mx-2 text-glamour-700" />
                <span className="font-medium">{orderState.customerInfo.time}</span>
              </div>
            )}
            
            <p className="text-gray-600">
              {orderState.customerInfo?.email ? 
                `We've sent a confirmation to ${orderState.customerInfo.email}.` : 
                'Your booking details are saved in our system.'}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Payment Method:</span>
                <span>{orderState.paymentMethod || 'Cash on Arrival'}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="font-medium">Status:</span>
                <span>Pending</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button onClick={resetOrder} variant="outline">
              Book Another Appointment
            </Button>
            <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
              <Link to="/account/appointments">View My Appointments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
