
import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Banknote,
  Building,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { config } from "@/config/env";
import { useToast } from "@/components/ui/use-toast";

const PaymentDetails = () => {
  const { orderState, setPaymentMethod, goToStep, completeOrder } = useOrder();
  const { toast } = useToast();
  const [paymentMethodState, setPaymentMethodState] = useState(
    orderState.paymentMethod || "cash"
  );
  const [loading, setLoading] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethodState(value);
  };

  const bankAccounts = [
    {
      bankName: "AzerTurk Bank",
      accountName: "Glamour Studio LLC",
      accountNumber: "AZ12ATBZ12345678901234567890",
      swift: "ATBZAZ22",
    },
    {
      bankName: "Kapital Bank",
      accountName: "Glamour Studio LLC",
      accountNumber: "AZ34KAPI98765432109876543210",
      swift: "KAPIAZ22",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Save the payment method to the order context
      setPaymentMethod(paymentMethodState);
      
      // Generate order ID (this would be done by the backend in production)
      const orderId = config.usesMockData
        ? `ORD-${Math.floor(Math.random() * 10000)}`
        : null;
      
      // Simulate API call for order creation
      if (config.usesMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        completeOrder(orderId as string);
        
        toast({
          title: "Order Completed",
          description: "Your booking has been successfully created!"
        });
      } else {
        // Real API call would happen here
        // const response = await createOrder({...orderState, paymentMethod});
        // completeOrder(response.orderId);
      }
      
      // Move to next step (confirmation)
      goToStep(4);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    goToStep(2);
  };

  // Calculate the order subtotal
  const selectedServices = orderState.selectedServices || [];
  const selectedProducts = orderState.selectedProducts || [];
  const total = orderState.total || 0;

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">Payment Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2 text-lg">Order Summary</h3>
              <div className="space-y-1 mb-3">
                <div className="flex justify-between">
                  <span>Services:</span>
                  <Badge variant="outline" className="font-normal">
                    {selectedServices.length} selected
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Products:</span>
                  <Badge variant="outline" className="font-normal">
                    {selectedProducts.length} selected
                  </Badge>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Select Payment Method</h3>
              <RadioGroup
                value={paymentMethodState}
                onValueChange={handlePaymentMethodChange}
                className="space-y-3"
              >
                {/* Cash Payment */}
                <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="cash" id="payment-cash" />
                  <Label
                    htmlFor="payment-cash"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <Banknote className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium">Cash on Arrival</div>
                      <div className="text-sm text-muted-foreground">
                        Pay when you arrive for your appointment
                      </div>
                    </div>
                  </Label>
                </div>

                {/* POS Terminal Payment */}
                <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="pos" id="payment-pos" />
                  <Label
                    htmlFor="payment-pos"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <Terminal className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium">POS Terminal</div>
                      <div className="text-sm text-muted-foreground">
                        Pay using POS terminal on arrival
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Bank Transfer */}
                <div className="border rounded-md transition-colors">
                  <div className="flex items-center space-x-3 p-4 hover:bg-gray-50">
                    <RadioGroupItem value="bank" id="payment-bank" />
                    <Label
                      htmlFor="payment-bank"
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <Building className="h-5 w-5 mr-3 text-gray-600" />
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-muted-foreground">
                          Pay via bank transfer
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowBankDetails(!showBankDetails)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                      >
                        {showBankDetails ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </Label>
                  </div>
                  {showBankDetails && (
                    <div className="border-t p-4 bg-gray-50">
                      <h4 className="font-medium mb-2 text-sm">Bank Account Details</h4>
                      <div className="space-y-4">
                        {bankAccounts.map((account, index) => (
                          <div key={index} className="rounded-md border bg-white p-3">
                            <div className="text-sm font-medium">{account.bankName}</div>
                            <div className="text-sm">Account: {account.accountName}</div>
                            <div className="text-sm mt-1">
                              <span className="font-medium">IBAN:</span> {account.accountNumber}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">SWIFT:</span> {account.swift}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Please include your name and appointment date in the transfer description
                      </p>
                    </div>
                  )}
                </div>

                {/* Credit Card Payment */}
                <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label
                    htmlFor="payment-card"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">
                        Pay securely with your card
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                type="submit"
                className="bg-glamour-700 hover:bg-glamour-800"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;
