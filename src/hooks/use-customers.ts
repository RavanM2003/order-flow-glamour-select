
// Fixing the gender type issue in createCustomer function

const createCustomer = useCallback(async (customerData: CustomerFormData & { createUser?: boolean }) => {
  try {
    // Type-safe gender handling
    let gender: "male" | "female" | "other" | null = null;
    if (customerData.gender === "male" || customerData.gender === "female" || customerData.gender === "other") {
      gender = customerData.gender;
    }
    
    const response = await customerService.create({
      ...customerData,
      gender: gender || "other", // Default to "other" if invalid value
    });
    
    if (response.data) {
      setCustomers((prev) => [...prev, response.data!]);
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
      description: error instanceof Error ? error.message : "Failed to create customer",
    });
    return null;
  }
}, [customerService, toast]);
