
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface Booking {
  id: number;
  invoice_number: string;
  total_amount: number;
  status: string;
  appointment_json: Json;
  appointment_id: number;
  issued_at: string;
}

interface BookingFormData {
  invoice_number: string;
  customer_info: {
    full_name: string;
    gender: string;
    email: string;
    number: string;
    note: string;
    date: string;
    time: string;
  };
  services: Array<{
    id: number;
    name: string;
    price: number;
    duration: number;
    discount: number;
    discounted_price: number;
    user_id: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    discount: number;
    discounted_price: number;
  }>;
  request_info: {
    ip: string;
    device: string;
    os: string;
    browser: string;
    entry_time: string;
    page: string;
  };
  payment_details: {
    method: string;
    total_amount: number;
    discount_amount: number;
    paid_amount: number;
  };
}

export const createBooking = async (
  bookingData: BookingFormData
): Promise<ApiResponse<Booking>> => {
  try {
    // Normalize gender value to match database enum
    const normalizeGender = (gender: string): "male" | "female" | "other" => {
      const lowerGender = gender.toLowerCase().trim();
      if (lowerGender === "male" || lowerGender === "m") return "male";
      if (lowerGender === "female" || lowerGender === "f") return "female";
      return "other";
    };

    // Create the appointment JSON with properly typed gender
    const appointmentJson = {
      ...bookingData,
      customer_info: {
        ...bookingData.customer_info,
        gender: normalizeGender(bookingData.customer_info.gender),
      },
    };

    // Use a raw SQL insert to properly cast the gender enum
    const { data, error } = await supabase.rpc('create_invoice_with_appointment', {
      p_invoice_number: bookingData.invoice_number,
      p_total_amount: bookingData.payment_details.total_amount,
      p_status: "waiting",
      p_appointment_json: appointmentJson
    });

    if (error) {
      console.error("Database error:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("Service error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: errorMessage };
  }
};
