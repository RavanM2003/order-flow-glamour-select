import { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Customer } from "@/models/customer.model";

// Define the type for booking mode
export type BookingMode = "salon" | "home";

// Define props for the component
export interface CustomerInfoProps {
  onSubmit: () => void;
}

// Define the schema for form validation
const customerSchema = z.object({
  name: z.string().min(3, { message: "Adınız ən azı 3 simvol olmalıdır" }),
  email: z.string().email({ message: "Etibarlı e-poçt daxil edin" }),
  phone: z
    .string()
    .min(9, { message: "Telefon nömrəsi ən azı 9 rəqəm olmalıdır" }),
});

// Define the type for the customer form
type CustomerFormValues = z.infer<typeof customerSchema>;

const FormFieldInput = ({ control, name, label, placeholder }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const CustomerForm = ({ form, onSubmit, isLoading }) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormFieldInput
        control={form.control}
        name="name"
        label="Ad və Soyad"
        placeholder="Ad və Soyad"
      />
      <FormFieldInput
        control={form.control}
        name="email"
        label="Email"
        placeholder="Email"
      />
      <FormFieldInput
        control={form.control}
        name="phone"
        label="Telefon"
        placeholder="Telefon"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Gözləyin..." : "Davam et"}
      </Button>
    </form>
  </Form>
);

const CustomerInfo: React.FC<CustomerInfoProps> = ({ onSubmit }) => {
  const { orderState, setCustomer, setNextStep } = useOrder();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: orderState.customer?.name || "",
      email: orderState.customer?.email || "",
      phone: orderState.customer?.phone || "",
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
        // Add required fields with default values
        id: orderState.customer?.id || "temp-id",
        gender: orderState.customer?.gender || "other",
        lastVisit: orderState.customer?.lastVisit || new Date().toISOString(),
        totalSpent: orderState.customer?.totalSpent || 0,
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
        <CustomerForm
          form={form}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default CustomerInfo;
