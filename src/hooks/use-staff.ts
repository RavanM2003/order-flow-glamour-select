import { useState, useEffect, useCallback } from "react";
import { Staff, StaffFormData, StaffWorkingHours, StaffPayment, StaffServiceRecord } from "@/models/staff.model";
import { staffService } from "@/services/staff.service";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StaffEarnings {
  salary: number;
  commission: number;
  expenses: number;
  total: number;
}

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [workingHours, setWorkingHours] = useState<StaffWorkingHours[]>([]);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [serviceRecords, setServiceRecords] = useState<StaffServiceRecord[]>([]);
  const [earnings, setEarnings] = useState<StaffEarnings | null>(null);

  const fetchStaff = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log('useStaff: Starting fetchStaff...');
      
      // Direct Supabase query to get real data
      const { data: staffData, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "staff");

      console.log('useStaff: Direct DB query result:', { staffData, dbError });

      if (dbError) {
        console.error('useStaff: Database error:', dbError);
        setError(dbError.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load staff: ${dbError.message}`,
        });
        return;
      }

      if (staffData && staffData.length > 0) {
        const mappedStaff = staffData.map((user) => ({
          id: user.id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          full_name: user.full_name,
          position: "Staff Member",
          user_id: user.id,
          email: user.email,
          phone: user.phone || "",
          specializations: [],
          avatar_url: user.avatar_url,
          role: user.role,
        }));
        
        console.log('useStaff: Mapped staff data:', mappedStaff);
        setStaff(mappedStaff);
      } else {
        console.log('useStaff: No staff found in database');
        setStaff([]);
      }
    } catch (err) {
      console.error('useStaff: Unexpected error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load staff: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStaffMember = async (id: string | number) => {
    setIsLoading(true);
    setError("");
    try {
      const staffId = typeof id === 'number' ? id.toString() : id;
      const response = await staffService.getStaffMemberById(staffId);
      if (response.data) {
        setSelectedStaff(response.data);
        return response.data;
      } else if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load staff member: ${response.error}`,
        });
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load staff member: ${errorMessage}`,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createStaffMember = async (staffData: StaffFormData): Promise<Staff> => {
    setIsLoading(true);
    setError("");
    try {
      const response = await staffService.createStaffMember(staffData);
      if (response.data) {
        setStaff((prevStaff) => [...prevStaff, response.data]);
        toast({
          title: "Success",
          description: "Staff member created successfully",
        });
        return response.data;
      } else if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to create staff member: ${response.error}`,
        });
        throw new Error(response.error);
      }
      throw new Error("Unknown error occurred");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create staff member: ${errorMessage}`,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffMember = async (id: string, updates: Partial<StaffFormData>): Promise<Staff> => {
    setIsLoading(true);
    setError("");
    try {
      const response = await staffService.updateStaffMember(id, updates);
      if (response.data) {
        setStaff((prevStaff) =>
          prevStaff.map((s) => (s.id === id ? { ...s, ...response.data } : s))
        );
        if (selectedStaff && selectedStaff.id === id) {
          setSelectedStaff({ ...selectedStaff, ...response.data });
        }
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
        return response.data;
      } else if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to update staff member: ${response.error}`,
        });
        throw new Error(response.error);
      }
      throw new Error("Unknown error occurred");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update staff member: ${errorMessage}`,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStaffMember = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    try {
      const response = await staffService.deleteStaffMember(id);
      if (response.data) {
        setStaff((prevStaff) => prevStaff.filter((s) => s.id !== id));
        if (selectedStaff && selectedStaff.id === id) {
          setSelectedStaff(null);
        }
        toast({
          title: "Success",
          description: "Staff member deleted successfully",
        });
        return true;
      } else if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to delete staff member: ${response.error}`,
        });
        return false;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete staff member: ${errorMessage}`,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Added functions for staff working hours, payments, service records, and earnings
  // Updated to use number IDs to fix type issues

  const fetchWorkingHours = async (staffId: string | number) => {
    setIsLoading(true);
    try {
      // For now, using mock data - would normally fetch from API
      const mockHours: StaffWorkingHours[] = Array.from({ length: 7 }, (_, i) => ({
        id: i, // Use number for id
        staff_id: staffId,
        day_of_week: i,
        start_time: "09:00",
        end_time: "17:00",
        is_day_off: i === 0 || i === 6, // Weekends off by default
        is_available: !(i === 0 || i === 6)
      }));
      
      setWorkingHours(mockHours);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load working hours: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkingHours = async (
    staffId: string | number,
    dayOfWeek: number,
    updates: Partial<StaffWorkingHours>
  ) => {
    setIsLoading(true);
    try {
      // Mock API call
      setWorkingHours(prev => 
        prev.map(day => 
          day.day_of_week === dayOfWeek && day.staff_id === staffId
            ? { ...day, ...updates }
            : day
        )
      );
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update working hours: ${errorMessage}`,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaffPayments = async (staffId: string | number) => {
    setIsLoading(true);
    try {
      // Using mock data
      const mockPayments: StaffPayment[] = [
        {
          id: 1, // Use number for id
          staff_id: typeof staffId === 'number' ? staffId.toString() : staffId,
          payment_type: "salary",
          amount: 1200,
          payment_date: "2023-05-01",
          created_at: "2023-05-01",
          updated_at: "2023-05-01",
          date: "2023-05-01",
          type: "salary",
          description: "Monthly salary"
        },
        {
          id: 2, // Use number for id
          staff_id: typeof staffId === 'number' ? staffId.toString() : staffId,
          payment_type: "commission",
          amount: 350,
          payment_date: "2023-05-15",
          created_at: "2023-05-15",
          updated_at: "2023-05-15",
          date: "2023-05-15",
          type: "commission",
          description: "Commission for services"
        }
      ];
      
      setStaffPayments(mockPayments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServiceRecords = async (staffId: string | number) => {
    setIsLoading(true);
    try {
      // Using mock data
      const mockRecords: StaffServiceRecord[] = [
        {
          id: 1, // Use number for id
          staff_id: typeof staffId === 'number' ? staffId.toString() : staffId,
          service_id: 1,
          service_name: "Haircut",
          commission_rate: 0.1,
          created_at: "2023-05-10",
          updated_at: "2023-05-10",
          date: "2023-05-10",
          customer_name: "Jane Doe",
          price: 50,
          commission: 5
        },
        {
          id: 2, // Use number for id
          staff_id: typeof staffId === 'number' ? staffId.toString() : staffId,
          service_id: 2,
          service_name: "Hair coloring",
          commission_rate: 0.15,
          created_at: "2023-05-12",
          updated_at: "2023-05-12",
          date: "2023-05-12",
          customer_name: "John Smith",
          price: 120,
          commission: 18
        }
      ];
      
      setServiceRecords(mockRecords);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEarnings = async (
    staffId: string | number,
    month: number,
    year: number
  ) => {
    setIsLoading(true);
    try {
      // Mock calculation
      const mockEarnings: StaffEarnings = {
        salary: 1200,
        commission: 250,
        expenses: 50,
        total: 1400
      };
      
      setEarnings(mockEarnings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    selectedStaff,
    isLoading,
    error,
    fetchStaff,
    getStaffMember,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    workingHours,
    fetchWorkingHours,
    updateWorkingHours,
    staffPayments,
    fetchStaffPayments,
    serviceRecords,
    fetchServiceRecords,
    earnings,
    calculateEarnings
  };
}
