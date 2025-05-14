
import React from 'react';
import { useOrder } from '@/context/OrderContext';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CustomerInfo from './CustomerInfo';
import ServiceSelection from './ServiceSelection';
import PaymentDetails from './PaymentDetails';
import BookingConfirmation from './BookingConfirmation';

type CheckoutFlowProps = {
  bookingMode?: 'client' | 'staff';
};

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ bookingMode = 'client' }) => {
  const { orderState, updateOrder } = useOrder();
  
  // Render different steps based on current step
  const renderStep = () => {
    if (!orderState.step) {
      // Initialize step if not set
      updateOrder({ step: 1 });
      return <CustomerInfo />;
    }
    
    switch (orderState.step) {
      case 1:
        return <CustomerInfo />;
      case 2:
        return <ServiceSelection bookingMode={bookingMode} />;
      case 3:
        return <PaymentDetails />;
      case 4:
        return <BookingConfirmation />;
      default:
        return <CustomerInfo />;
    }
  };

  return (
    <>
      <style>
        {`
          .step-indicator {
            position: relative;
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.5rem;
          }
          .step-indicator::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            height: 2px;
            width: 100%;
            background-color: #e5e7eb;
            z-index: 0;
          }
        `}
      </style>
      <Card className="p-6">
        {orderState.step !== 4 && (
          <>
            <div className="step-indicator mb-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                    step <= (orderState.step || 1)
                      ? 'bg-glamour-700 text-white'
                      : 'bg-gray-100 text-gray-400'
                  } font-medium text-sm`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 mb-6 text-sm font-medium">
              <div className={`text-center ${(orderState.step || 1) >= 1 ? 'text-glamour-700' : 'text-gray-400'}`}>
                Customer Information
              </div>
              <div className={`text-center ${(orderState.step || 1) >= 2 ? 'text-glamour-700' : 'text-gray-400'}`}>
                Select Services
              </div>
              <div className={`text-center ${(orderState.step || 1) >= 3 ? 'text-glamour-700' : 'text-gray-400'}`}>
                Payment
              </div>
            </div>
            <Separator className="mb-6" />
          </>
        )}
        
        {renderStep()}
      </Card>
    </>
  );
};

export default CheckoutFlow;
