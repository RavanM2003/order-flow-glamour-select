
import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Cash,
  Building,
  Check,
  ChevronDown,
  ChevronUp,
  Wallet,
  Clock,
  Sparkles,
  Package,
  User,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { config } from "@/config/env";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { API } from "@/lib/api";

const PaymentDetails = () => {
  const { orderState, setPaymentMethod, goToStep, completeOrder } = useOrder();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethodState] = useState(
    orderState.paymentMethod || "cash"
  );
  const [loading, setLoading] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Credit card form
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethodState(value);
  };
  
  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces after every 4 digits
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails({ ...cardDetails, [name]: formatted });
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiry') {
      const sanitized = value.replace(/[^\d]/g, '');
      if (sanitized.length <= 2) {
        setCardDetails({ ...cardDetails, [name]: sanitized });
      } else {
        setCardDetails({ 
          ...cardDetails, 
          [name]: `${sanitized.substring(0, 2)}/${sanitized.substring(2, 4)}`
        });
      }
      return;
    }
    
    setCardDetails({ ...cardDetails, [name]: value });
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
  
  // Fetch services and products data
  React.useEffect(() => {
    const loadData = async () => {
      if (orderState.selectedServices.length > 0 || orderState.selectedProducts.length > 0) {
        try {
          setIsLoadingData(true);
          const [servicesRes, productsRes] = await Promise.all([
            API.services.list(),
            API.products.list()
          ]);
          
          setServices(servicesRes.data || []);
          setProducts(productsRes.data || []);
        } catch (error) {
          console.error("Failed to load services and products:", error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    
    loadData();
  }, [orderState.selectedServices, orderState.selectedProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate card details if card payment method is selected
    if (paymentMethod === 'card') {
      if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid card number",
          variant: "destructive"
        });
        return;
      }
      
      if (!cardDetails.cardName) {
        toast({
          title: "Missing name",
          description: "Please enter the name on card",
          variant: "destructive"
        });
        return;
      }
      
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date (MM/YY)",
          variant: "destructive"
        });
        return;
      }
      
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid CVV code",
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Save the payment method to the order context
      setPaymentMethod(paymentMethod);
      
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

  // Get selected services and products details
  const selectedServicesDetails = services
    .filter(service => orderState.selectedServices.includes(service.id));
  
  const selectedProductsDetails = products
    .filter(product => orderState.selectedProducts.includes(product.id));
  
  // Find staff assigned to each service
  const getServiceProvider = (serviceId: number) => {
    return orderState.serviceProviders.find(sp => sp.serviceId === serviceId)?.name;
  };
  
  // Calculate the order subtotal
  const total = orderState.total || 0;

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">Payment Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="services" className="border-none">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Order Summary</h3>
                    <AccordionTrigger className="py-0">
                      <span className="text-sm text-glamour-700">View Details</span>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <div className="space-y-4 mt-2">
                      {/* Services */}
                      {orderState.selectedServices.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center">
                            <Sparkles className="h-4 w-4 mr-1" /> Services
                          </h4>
                          <ul className="space-y-2">
                            {isLoadingData ? (
                              <li>Loading services...</li>
                            ) : (
                              selectedServicesDetails.map(service => (
                                <li key={service.id} className="bg-white p-2 rounded border">
                                  <div className="flex justify-between">
                                    <span>{service.name}</span>
                                    <span>${service.price}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" /> {service.duration}
                                    </div>
                                    <div className="flex items-center">
                                      <User className="h-3 w-3 mr-1" /> 
                                      {getServiceProvider(service.id) || 'No staff assigned'}
                                    </div>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {/* Products */}
                      {orderState.selectedProducts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center">
                            <Package className="h-4 w-4 mr-1" /> Products
                          </h4>
                          <ul className="space-y-2">
                            {isLoadingData ? (
                              <li>Loading products...</li>
                            ) : (
                              selectedProductsDetails.map(product => (
                                <li key={product.id} className="bg-white p-2 rounded border">
                                  <div className="flex justify-between">
                                    <span>{product.name}</span>
                                    <span>${product.price}</span>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {/* Appointment Details */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" /> Appointment Details
                        </h4>
                        <div className="bg-white p-2 rounded border">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Date: {orderState.customerInfo?.date}</div>
                            <div>Time: {orderState.customerInfo?.time}</div>
                            <div className="col-span-2 text-xs text-gray-500 mt-1">
                              {orderState.customerInfo?.notes && (
                                <div>Notes: {orderState.customerInfo.notes}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between">
                  <span>Services:</span>
                  <Badge variant="outline" className="font-normal">
                    {orderState.selectedServices.length} selected
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Products:</span>
                  <Badge variant="outline" className="font-normal">
                    {orderState.selectedProducts.length} selected
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
                value={paymentMethod}
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
                    <Cash className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium">Cash on Arrival</div>
                      <div className="text-sm text-muted-foreground">
                        Pay when you arrive for your appointment
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Credit Card Payment */}
                <div className="border rounded-md transition-colors">
                  <div className="flex items-center space-x-3 p-4 hover:bg-gray-50">
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
                  
                  {paymentMethod === 'card' && (
                    <div className="border-t p-4 bg-gray-50">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardDetailsChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="font-mono"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            value={cardDetails.cardName}
                            onChange={handleCardDetailsChange}
                            placeholder="JOHN SMITH"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              name="expiry"
                              value={cardDetails.expiry}
                              onChange={handleCardDetailsChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="font-mono"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardDetailsChange}
                              placeholder="123"
                              maxLength={4}
                              className="font-mono"
                              type="password"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-3 text-xs text-muted-foreground">
                        <Wallet className="h-3 w-3 mr-1" />
                        Your card information is securely processed
                      </div>
                    </div>
                  )}
                </div>

                {/* POS Terminal Payment */}
                <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="pos" id="payment-pos" />
                  <Label
                    htmlFor="payment-pos"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <Wallet className="h-5 w-5 mr-3 text-gray-600" />
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
