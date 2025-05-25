
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

    // Ensure gender is properly typed as gender_enum
    const appointmentJson = {
      ...bookingData,
      customer_info: {
        ...bookingData.customer_info,
        gender: normalizeGender(bookingData.customer_info.gender),
      },
    };

    const { data, error } = await supabase
      .from("invoices")
      .insert([
        {
          invoice_number: bookingData.invoice_number,
          total_amount: bookingData.payment_details.total_amount,
          status: "waiting",
          appointment_json: appointmentJson,
        },
      ])
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: errorMessage };
  }
};
