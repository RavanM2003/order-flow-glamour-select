import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Banknote, Building, Terminal, ChevronDown, ChevronUp, Receipt } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from 'qrcode.react';

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

// Bank account information
const bankAccounts = [
  {
    bankName: "AzerTurk Bank",
    accountName: "Glamour Studio LLC",
    accountNumber: "AZ12 AZRT 1234 5678 9012 3456",
    swiftCode: "AZRTAZ22"
  },
  {
    bankName: "Kapital Bank",
    accountName: "Glamour Studio LLC",
    accountNumber: "AZ45 KAPI 6789 0123 4567 8901",
    swiftCode: "KAPIAZ22"
  }
];

const PaymentDetails = () => {
  const { orderState, completeOrder, goToStep, resetOrder } = useOrder();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showOrderId, setShowOrderId] = useState(false);

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

  // Calculate total duration in minutes
  const totalDuration = selectedServices.reduce((sum, service) => {
    const match = service.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const handleBack = () => {
    goToStep(2);
  };

  const generateOrderId = () => {
    const prefix = "GS";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Generate unique order ID
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowOrderId(true);
      completeOrder();
      resetOrder();
      window.location.href = `/booking-details/${newOrderId}`;
    }, 1500);
  };

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">Payment Details</h2>
          
          {showOrderId ? (
            <div className="text-center py-8">
              <Receipt className="h-16 w-16 mx-auto mb-4 text-glamour-700" />
              <h3 className="text-xl font-semibold mb-2">Order Confirmed!</h3>
              <p className="text-gray-600 mb-4">Your appointment has been successfully booked.</p>
              <div className="bg-gray-50 p-4 rounded-md inline-block mb-6">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <Badge variant="secondary" className="text-lg font-mono bg-white text-glamour-700">
                  {orderId}
                </Badge>
              </div>
              <div className="mt-8 space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm inline-block mb-4">
                  <QRCodeSVG 
                    value={`${window.location.origin}/booking-details/${orderId}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Scan to view your booking details
                </p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/booking-details/${orderId}`);
                      toast({
                        title: "Link Copied!",
                        description: "Booking details link has been copied to clipboard.",
                      });
                    }}
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const svg = document.querySelector('svg');
                      if (svg) {
                        const svgData = new XMLSerializer().serializeToString(svg);
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        img.onload = () => {
                          canvas.width = img.width;
                          canvas.height = img.height;
                          ctx?.drawImage(img, 0, 0);
                          const pngFile = canvas.toDataURL('image/png');
                          const downloadLink = document.createElement('a');
                          downloadLink.download = `booking-qr-${orderId}.png`;
                          downloadLink.href = pngFile;
                          downloadLink.click();
                        };
                        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                      }
                    }}
                  >
                    Download QR Code
                  </Button>
                  <Button
                    className="w-full bg-glamour-700 hover:bg-glamour-800"
                    onClick={() => window.location.href = '/'}
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Order summary section */}
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
                      <div className="text-sm text-glamour-700 font-medium mb-2">
                        Total duration: {totalDuration} min
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
                
                {/* Payment method selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    {/* Cash on Arrival */}
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

                    {/* POS Terminal */}
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

                    {/* Bank Transfer */}
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
                    
                    {/* Bank account details accordion */}
                    {paymentMethod === 'bank' && (
                      <div className="pl-8 pr-4">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="bank-details">
                            <AccordionTrigger className="text-glamour-700">
                              View Bank Account Details
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                {bankAccounts.map((account, index) => (
                                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                                    <h4 className="font-semibold text-sm">{account.bankName}</h4>
                                    <div className="text-sm space-y-1 mt-2">
                                      <p>Account Name: {account.accountName}</p>
                                      <p>Account Number: {account.accountNumber}</p>
                                      <p>Swift Code: {account.swiftCode}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Credit/Debit Card */}
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
                      <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} type="button">
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="bg-glamour-700 hover:bg-glamour-800"
                  >
                    {isProcessing ? "Processing..." : "Complete Payment"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;
