import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Banknote, Building, Terminal } from "lucide-react";

// Mock data
const services = [
  { id: 1, name: "Facial Treatment", price: 150, duration: "60 min" },
  { id: 2, name: "Massage Therapy", price: 120, duration: "45 min" },
  { id: 3, name: "Manicure", price: 50, duration: "30 min" },
  { id: 4, name: "Hair Styling", price: 80, duration: "45 min" },
  { id: 5, name: "Makeup Application", price: 90, duration: "60 min" }
];

const products = [
  { id: 1, name: "Moisturizer Cream", price: 45 },
  { id: 2, name: "Anti-Aging Serum", price: 75 },
  { id: 3, name: "Hair Care Kit", price: 60 }
];

const PaymentDetails = () => {
  const { orderState, completeOrder, goToStep } = useOrder();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get selected services details
  const selectedServices = services.filter(service => 
    orderState.selectedServices && orderState.selectedServices.includes(service.id)
  );
  
  // Get selected products details
  const selectedProducts = products.filter(product => 
    orderState.selectedProducts && orderState.selectedProducts.includes(product.id)
  );
  
  // Calculate subtotal, tax and total
  const servicesSubtotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const productsSubtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const subtotal = servicesSubtotal + productsSubtotal;
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  const handleBack = () => {
    goToStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      completeOrder();
      toast({
        title: "Payment Successful!",
        description: "Your appointment has been booked successfully.",
      });
    }, 1500);
  };

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">Payment Details</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Order summary - Moved to the top */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                {selectedServices.length > 0 && (
                  <>
                    <h4 className="font-medium mb-2">Selected Services:</h4>
                    <div className="space-y-2 mb-4">
                      {selectedServices.map(service => (
                        <div key={service.id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span>${service.price}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {selectedProducts.length > 0 && (
                  <>
                    <h4 className="font-medium mb-2">Selected Products:</h4>
                    <div className="space-y-2 mb-4">
                      {selectedProducts.map(product => (
                        <div key={product.id} className="flex justify-between">
                          <span>{product.name}</span>
                          <span>${product.price}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-glamour-800">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Payment method selection - Moved to the bottom */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="card" id="payment-card" />
                    <Label htmlFor="payment-card" className="cursor-pointer flex-1">
                      <div className="font-medium flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Credit/Debit Card
                      </div>
                      <div className="text-sm text-gray-500">Pay securely with your card</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="cash" id="payment-cash" />
                    <Label htmlFor="payment-cash" className="cursor-pointer flex-1">
                      <div className="font-medium flex items-center">
                        <Banknote className="mr-2 h-5 w-5" />
                        Cash on Arrival
                      </div>
                      <div className="text-sm text-gray-500">Pay when you arrive for your appointment</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="bank" id="payment-bank" />
                    <Label htmlFor="payment-bank" className="cursor-pointer flex-1">
                      <div className="font-medium flex items-center">
                        <Building className="mr-2 h-5 w-5" />
                        Bank Transfer
                      </div>
                      <div className="text-sm text-gray-500">Pay via bank transfer</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-glamour-50 transition-colors">
                    <RadioGroupItem value="pos" id="payment-pos" />
                    <Label htmlFor="payment-pos" className="cursor-pointer flex-1">
                      <div className="font-medium flex items-center">
                        <Terminal className="mr-2 h-5 w-5" />
                        POS Terminal
                      </div>
                      <div className="text-sm text-gray-500">Pay using POS terminal on arrival</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Card details (shown only if card payment selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="Enter name as shown on card" required />
                  </div>
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number" 
                      placeholder="1234 5678 9012 3456" 
                      required 
                      pattern="[0-9\s]{13,19}"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input id="expiry-date" placeholder="MM/YY" required />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        required 
                        pattern="[0-9]{3,4}"
                        inputMode="numeric"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="bg-glamour-700 hover:bg-glamour-800"
                >
                  {isProcessing ? 'Processing...' : 'Complete Payment'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;
