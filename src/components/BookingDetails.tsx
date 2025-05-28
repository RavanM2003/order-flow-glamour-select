
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import BookingDetailPage from "@/components/admin/BookingDetailPage";

interface BookingDetailsProps {
  invoiceId?: string;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('BookingDetails: invoiceId received:', invoiceId);
    if (invoiceId) {
      fetchInvoiceDetails();
    } else {
      setError('No invoice ID provided');
      setLoading(false);
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching invoice with invoice_number:', invoiceId);
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_number', invoiceId)
        .single();

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setError('Invoice not found');
        return;
      }

      if (data) {
        console.log('Invoice data found:', data);
        console.log('appointment_json structure:', data.appointment_json);
        
        // Validate appointment_json structure
        if (!data.appointment_json) {
          console.error('appointment_json is null or undefined');
          setError('Invalid invoice data: missing appointment information');
          return;
        }

        // Check for required fields in appointment_json
        const appointmentJson = data.appointment_json;
        if (!appointmentJson.customer_info) {
          console.error('Missing customer_info in appointment_json');
          setError('Invalid invoice data: missing customer information');
          return;
        }

        if (!appointmentJson.services) {
          console.error('Missing services in appointment_json');
        }

        if (!appointmentJson.products) {
          console.error('Missing products in appointment_json');
        }

        if (!appointmentJson.payment_details) {
          console.error('Missing payment_details in appointment_json');
        }

        if (!appointmentJson.request_info) {
          console.error('Missing request_info in appointment_json');
        }

        setInvoice(data);
      } else {
        console.error('No data returned from query');
        setError('Invoice not found');
      }
    } catch (err) {
      console.error('Error in fetchInvoiceDetails:', err);
      setError('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || 'The invoice you are looking for does not exist.'}
          </p>
          <p className="text-sm text-gray-500">Invoice ID: {invoiceId}</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <p className="text-sm">Searched for invoice_number: {invoiceId}</p>
            <p className="text-sm">Check the console for more details</p>
          </div>
        </div>
      </div>
    );
  }

  return <BookingDetailPage invoice={invoice} />;
};

export default BookingDetails;
