import React from 'react';
import { OrderProvider, useOrder } from '@/context/OrderContext';
import CustomerInfo from './CustomerInfo';
import ServiceSelection from './ServiceSelection';
import PaymentDetails from './PaymentDetails';
import { Card } from "@/components/ui/card";
import { Check, CalendarDays, CreditCard } from "lucide-react";

const CheckoutSteps = [
  { number: 1, title: 'Customer Info', icon: <CalendarDays size={18} /> },
  { number: 2, title: 'Select Services', icon: <Check size={18} /> },
  { number: 3, title: 'Payment', icon: <CreditCard size={18} /> },
];

const CheckoutStepper = () => {
  const { orderState, goToStep } = useOrder();
  const currentStep = orderState.step;

  return (
    <div className="py-6">
      <div className="flex justify-center">
        <div className="flex items-center">
          {CheckoutSteps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div 
                className={`flex flex-col items-center cursor-pointer ${index < currentStep - 1 ? 'opacity-70' : ''}`}
                onClick={() => {
                  // Allow going back to previous steps
                  if (step.number < currentStep) {
                    goToStep(step.number);
                  }
                }}
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    ${step.number < currentStep ? 'bg-glamour-700 text-white' : step.number === currentStep ? 'bg-glamour-600 text-white' : 'bg-gray-200'}
                  `}
                >
                  {step.number < currentStep ? <Check size={18} /> : step.icon}
                </div>
                <div className="mt-2 text-sm font-medium">
                  <span className="hidden md:inline">{step.title}</span>
                </div>
              </div>
              {index < CheckoutSteps.length - 1 && (
                <div className={`w-16 h-[2px] mx-1 ${step.number < currentStep ? 'bg-glamour-700' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const CheckoutContent = () => {
  const { orderState } = useOrder();
  const currentStep = orderState.step;

  return (
    <>
      <CheckoutStepper />
      <div className="mt-6">
        {currentStep === 1 && <CustomerInfo />}
        {currentStep === 2 && <ServiceSelection />}
        {currentStep === 3 && <PaymentDetails />}
      </div>
    </>
  );
};

const CheckoutFlow = () => {
  return (
    <OrderProvider>
      <CheckoutContent />
    </OrderProvider>
  );
};

export default CheckoutFlow;
