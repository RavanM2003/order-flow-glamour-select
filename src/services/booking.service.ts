
import { supabase } from '@/integrations/supabase/client';

export interface BookingFormData {
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
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
    discount: number;
    discounted_price: number;
    user_id: string;
  }[];
  products: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    discount: number;
    discounted_price: number;
  }[];
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

export const createBooking = async (bookingData: BookingFormData) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: bookingData.invoice_number,
        total_amount: bookingData.payment_details.total_amount,
        status: 'waiting',
        appointment_json: bookingData as any // Cast to any to satisfy JSON type
      })
      .select()
      .single();

    if (error) {
      console.error('Booking creation error:', error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error('Unexpected booking error:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
