import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentDetails = () => {
  const { orderState, setPaymentMethod, goToStep, completeOrder } = useOrder();
  const { customer, selectedService, selectedProducts, selectedServices, appointmentDate, appointmentTime } = orderState;
  const { toast } = useToast();
  const [paymentType, setPaymentType] = useState<string | null>(orderState.paymentMethod || "cash");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total amount
  const calculateTotal = () => {
    let total = 0;
    
    // Add service price if a single service is selected
    if (selectedService) {
      total += selectedService.price;
    }
    
    // Add prices for multiple selected services
    // This would need to be implemented based on your service data structure
    
    // Add product prices
    if (selectedProducts && selectedProducts.length > 0) {
      total += selectedProducts.reduce((sum, product) => sum + product.price, 0);
    }
    
    return total;
  };

  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value);
    setPaymentMethod(value);
  };

  const handleBack = () => {
    goToStep(2);
  };

  const handleSubmit = async () => {
    if (!appointmentDate || !appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please select appointment date and time",
        variant: "destructive",
      });
      return;
    }

    if (!paymentType) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create a new appointment in the database
      const appointmentData = {
        customer_user_id: customer.id || null,
        appointment_date: appointmentDate.toISOString().split('T')[0],
        start_time: appointmentTime,
        end_time: calculateEndTime(appointmentTime, 60), // Assuming 60 min duration
        status: "scheduled",
        payment_method: paymentType,
        total: calculateTotal(),
        notes: "",
      };

      const { data: appointmentResult, error: appointmentError } = await supabase
        .from("appointments")
        .insert(appointmentData)
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Process successful booking
      if (appointmentResult) {
        // Complete the order with the appointment ID
        completeOrder(appointmentResult.id);
        
        // Move to confirmation step
        goToStep(4);
        
        toast({
          title: "Booking Confirmed!",
          description: "Your appointment has been successfully scheduled.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to calculate end time
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentType || ""}
            onValueChange={handlePaymentTypeChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                <Wallet className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">Cash</div>
                  <div className="text-sm text-muted-foreground">
                    Pay in cash at the salon
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">Card Payment</div>
                  <div className="text-sm text-muted-foreground">
                    Pay with credit or debit card at the salon
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">{customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {appointmentDate ? appointmentDate.toLocaleDateString() : "Not selected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{appointmentTime || "Not selected"}</span>
            </div>
          </div>

          <Separator />

          {selectedService && (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedService.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedService.duration} min
                </p>
              </div>
              <p className="font-medium">${selectedService.price}</p>
            </div>
          )}

          {selectedProducts &&
            selectedProducts.length > 0 &&
            selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Product</p>
                </div>
                <p className="font-medium">${product.price}</p>
              </div>
            ))}

          <Separator />

          <div className="flex justify-between items-center">
            <p className="font-bold">Total</p>
            <p className="font-bold">${calculateTotal()}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="bg-glamour-700 hover:bg-glamour-800 text-white"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Confirm Booking
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentDetails;
