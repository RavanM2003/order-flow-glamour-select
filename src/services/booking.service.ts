
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
    customer_id?: string;
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

    // Create the appointment JSON with properly typed gender and ensure all required fields
    const appointmentJson = {
      customer_info: {
        full_name: bookingData.customer_info.full_name,
        gender: normalizeGender(bookingData.customer_info.gender),
        email: bookingData.customer_info.email,
        number: bookingData.customer_info.number,
        note: bookingData.customer_info.note || '',
        date: bookingData.customer_info.date,
        time: bookingData.customer_info.time,
        customer_id: bookingData.customer_info.customer_id || null
      },
      services: bookingData.services.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        discount: service.discount || 0,
        discounted_price: service.discounted_price,
        user_id: service.user_id
      })),
      products: bookingData.products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        discount: product.discount || 0,
        discounted_price: product.discounted_price
      })),
      payment_details: {
        method: bookingData.payment_details.method,
        total_amount: bookingData.payment_details.total_amount,
        discount_amount: bookingData.payment_details.discount_amount || 0,
        paid_amount: bookingData.payment_details.paid_amount
      },
      request_info: {
        ip: bookingData.request_info.ip || 'unknown',
        device: bookingData.request_info.device || 'unknown',
        os: bookingData.request_info.os || 'unknown',
        browser: bookingData.request_info.browser || 'unknown',
        entry_time: bookingData.request_info.entry_time || new Date().toISOString(),
        page: bookingData.request_info.page || 'booking'
      }
    };

    console.log('Creating booking with appointment JSON:', appointmentJson);

    // Use the SQL function to properly handle gender enum casting and appointment notes
    const { data, error } = await supabase.rpc('create_invoice_with_appointment', {
      p_invoice_number: bookingData.invoice_number,
      p_total_amount: bookingData.payment_details.total_amount,
      p_status: "waiting",
      p_appointment_json: appointmentJson as any
    });

    if (error) {
      console.error("Database error:", error);
      return { error: error.message };
    }

    // The function returns an array, get the first item
    const bookingResult = Array.isArray(data) ? data[0] : data;
    
    if (!bookingResult) {
      return { error: "No booking data returned from database function" };
    }

    console.log('Booking created successfully:', bookingResult);
    return { data: bookingResult };
  } catch (error) {
    console.error("Service error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: errorMessage };
  }
};
