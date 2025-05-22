
import { Staff, StaffFormData } from "@/models/staff.model";
import { ApiService } from "./api.service";
import { ApiResponse } from "@/models/types";
import { config } from "@/config/env";
import { supabase } from "@/integrations/supabase/client";
import { withUserId, getCurrentUserId } from "@/utils/withUserId";

export class StaffService extends ApiService {
  constructor() {
    super();
  }

  async getAll(): Promise<ApiResponse<Staff[]>> {
    try {
      const { data, error } = await supabase.from("staff").select("*");

      if (error) throw error;

      return { data: data as Staff[] };
    } catch (error) {
      console.error("Error fetching staff members:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to fetch staff members",
      };
    }
  }

  async getStaffMembers(): Promise<ApiResponse<Staff[]>> {
    return this.getAll();
  }

  async getStaffMemberById(id: string | number): Promise<ApiResponse<Staff>> {
    // Convert to string if it's a number
    const staffId = typeof id === 'number' ? id.toString() : id;
    
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("id", staffId)
        .single();

      if (error) throw error;

      return { data: data as Staff };
    } catch (error) {
      console.error("Error fetching staff member:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to fetch staff member",
      };
    }
  }

  async createStaffMember(staffData: StaffFormData): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      const mockStaff: Staff = {
        id: Date.now().toString(),
        name: staffData.name, // Use name instead of user_id
        position: staffData.position,
        specializations: staffData.specializations,
        user_id: getCurrentUserId() || 'mocked_user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: staffData.email,
        phone: staffData.phone,
        role_id: staffData.role_id,
        salary: staffData.salary,
        commissionRate: staffData.commissionRate,
        paymentType: staffData.paymentType,
      };
      
      return { data: mockStaff, message: "Mock staff member created successfully" };
    }

    try {
      // Add the current user_id for tracking purposes
      const staffWithUserId = withUserId({
        ...staffData,
      });

      const { data, error } = await supabase
        .from("staff")
        .insert([staffWithUserId])
        .select()
        .single();

      if (error) throw error;

      return { 
        data: data as Staff,
        message: "İşçi uğurla yaradıldı" 
      };
    } catch (error) {
      console.error("Error creating staff member:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to create staff member",
      };
    }
  }

  async updateStaffMember(
    id: string,
    updates: Partial<StaffFormData>
  ): Promise<ApiResponse<Staff>> {
    try {
      const { data, error } = await supabase
        .from("staff")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { 
        data: data as Staff,
        message: "İşçi uğurla yeniləndi" 
      };
    } catch (error) {
      console.error("Error updating staff member:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to update staff member",
      };
    }
  }

  async deleteStaffMember(id: string | number): Promise<ApiResponse<boolean>> {
    const staffId = typeof id === 'number' ? id.toString() : id;
    
    try {
      const { error } = await supabase.from("staff").delete().eq("id", staffId);

      if (error) throw error;

      return { data: true, message: "İşçi uğurla silindi" };
    } catch (error) {
      console.error("Error deleting staff member:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to delete staff member",
      };
    }
  }
}

export const staffService = new StaffService();
