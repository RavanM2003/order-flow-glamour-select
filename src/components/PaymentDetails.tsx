
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethod, useOrder } from "@/context/OrderContext";
import { Check, CreditCard, Banknote, Package } from "lucide-react";
import { toast } from "sonner";

const PaymentMethods = [
  { 
    id: 'credit_card', 
    name: 'Credit Card', 
    description: 'Pay with Visa, Mastercard, or American Express',
    icon: <CreditCard className="h-5 w-5" />
  },
  { 
    id: 'cash', 
    name: 'Cash', 
    description: 'Pay in cash at the salon',
    icon: <Banknote className="h-5 w-5" />
  },
  { 
    id: 'paypal', 
    name: 'PayPal', 
    description: 'Fast and secure online payments',
    icon: <Package className="h-5 w-5" />
  }
];

const PaymentDetails = () => {
  const { 
    orderState, 
    setPaymentMethod, 
    setNotes, 
    getTotal, 
    previousStep, 
    goToStep, 
    resetOrder 
  } = useOrder();

  const [notes, setNotesState] = useState(orderState.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesState(e.target.value);
  };

  const handleSubmit = () => {
    if (!orderState.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    setNotes(notes);
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Your booking has been confirmed!");
      setIsSubmitting(false);
      resetOrder();
      goToStep(1);
    }, 1500);
  };

  return (
    <div className="checkout-step space-y-6 pb-12 pt-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-glamour-800">Payment Details</h2>
        <p className="text-muted-foreground">Review your order and choose a payment method.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select how you would like to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={orderState.paymentMethod} 
                onValueChange={handlePaymentMethodChange}
              >
                {PaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label 
                      htmlFor={method.id}
                      className="flex cursor-pointer items-center rounded-md border p-4 w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-muted-foreground">
                          {method.icon}
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
              <CardDescription>Add any special requirements or preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter any special requests or notes here..."
                value={notes}
                onChange={handleNotesChange}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderState.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex items-center space-x-1">
                    <span>{item.name}</span>
                    {item.quantity > 1 && (
                      <span className="text-muted-foreground">×{item.quantity}</span>
                    )}
                  </div>
                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-glamour-700 hover:bg-glamour-800"
                disabled={isSubmitting || !orderState.paymentMethod}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-glamour-100 border-r-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Complete Booking'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={previousStep}
                className="w-full"
                disabled={isSubmitting}
              >
                Back to Services
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
