
import React, { useState } from 'react';
import CustomerInfo from './CustomerInfo';
import ServiceSelection from './ServiceSelection';
import PaymentDetails from './PaymentDetails';
import BookingConfirmation from './BookingConfirmation';
import { useOrder } from '@/context/OrderContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type CheckoutFlowProps = {
  bookingMode?: 'customer' | 'staff';
};

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ bookingMode = 'customer' }) => {
  const { orderState, goToStep } = useOrder();
  const { currentStep } = orderState;

  const handleNext = () => {
    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Render confirmation screen if order is completed
  if (orderState.orderId) {
    return <BookingConfirmation />;
  }

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="flex flex-col items-center"
              onClick={() => {
                if (step < currentStep) goToStep(step);
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step
                    ? 'bg-glamour-700 text-white'
                    : 'bg-gray-200 text-gray-500'
                } ${step < currentStep ? 'cursor-pointer' : ''}`}
              >
                {step}
              </div>
              <span
                className={`mt-2 text-sm ${
                  currentStep >= step ? 'text-glamour-800' : 'text-gray-500'
                }`}
              >
                {step === 1
                  ? 'Customer Info'
                  : step === 2
                  ? 'Services'
                  : 'Payment'}
              </span>
            </div>
          ))}
        </div>

        <div className="relative mt-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-glamour-700"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {currentStep === 1 && <CustomerInfo />}
        {currentStep === 2 && <ServiceSelection />}
        {currentStep === 3 && <PaymentDetails />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={currentStep === 3} className="bg-glamour-700 hover:bg-glamour-800 text-white">
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default CheckoutFlow;
