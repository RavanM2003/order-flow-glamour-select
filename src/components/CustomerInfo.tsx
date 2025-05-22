
import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingMode, Customer } from "@/context/OrderContext.d";

// Define props for the component
export interface CustomerInfoProps {
  bookingMode: BookingMode;
  onSubmit: () => void;
}

// Define the schema for form validation
const customerSchema = z.object({
  name: z.string().min(3, { message: "Adınız ən azı 3 simvol olmalıdır" }),
  email: z.string().email({ message: "Etibarlı e-poçt daxil edin" }),
  phone: z
    .string()
    .min(9, { message: "Telefon nömrəsi ən azı 9 rəqəm olmalıdır" }),
  address: z.string().optional(),
});

// Define the type for the customer form
type CustomerFormValues = z.infer<typeof customerSchema>;

const CustomerInfo: React.FC<CustomerInfoProps> = ({ bookingMode, onSubmit }) => {
  const { orderState, setCustomer, setNextStep } = useOrder();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: orderState.customer.name || "",
      email: orderState.customer.email || "",
      phone: orderState.customer.phone || "",
      address: orderState.customer.address || "",
    },
  });

  // Submit handler
  const handleSubmit = async (values: CustomerFormValues) => {
    setIsLoading(true);

    try {
      // Update customer data in order context with necessary default values
      const customerData: Partial<Customer> = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address || "",
        // Add required fields with default values
        id: orderState.customer.id || 'temp-id',
        gender: orderState.customer.gender || 'other',
        lastVisit: orderState.customer.lastVisit || new Date().toISOString(),
        totalSpent: orderState.customer.totalSpent || 0
      };

      // Update customer data in order context
      setCustomer(customerData as Customer);

      // Move to next step in checkout flow
      setNextStep();
      
      // Call the onSubmit prop to notify parent component
      onSubmit();
    } catch (error) {
      console.error("Error submitting customer information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Müştəri məlumatları</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad və Soyad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ad və Soyad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {bookingMode === "home" && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ünvan</FormLabel>
                    <FormControl>
                      <Input placeholder="Ünvan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Gözləyin..." : "Davam et"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomerInfo;
