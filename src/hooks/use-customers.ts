import { useCallback, useState } from "react";
import { customerService } from "@/services";
import { Customer, CustomerFormData } from "@/models/customer.model";
import { toast } from "@/components/ui/use-toast";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = useCallback(
    async (customerData: CustomerFormData & { createUser?: boolean }) => {
      try {
        // Type-safe gender handling
        let gender: "male" | "female" | "other";
        if (
          customerData.gender === "male" ||
          customerData.gender === "female" ||
          customerData.gender === "other"
        ) {
          gender = customerData.gender;
        }

        const response = await customerService.create({
          ...customerData,
          gender: gender || "other", // Default to "other" if invalid value
        });

        if (response.data) {
          setCustomers((prev) => [...prev, response.data as Customer]);
          toast({
            title: "Customer created",
            description: "New customer has been added successfully",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to create customer");
        }
      } catch (error) {
        console.error("Error creating customer:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to create customer",
        });
        return null;
      }
    },
    []
  );

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await customerService.getAll();
      if (response.data) {
        setCustomers(response.data as Customer[]);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch customers"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    customers,
    isLoading,
    error,
    createCustomer,
    fetchCustomers,
  };
};
