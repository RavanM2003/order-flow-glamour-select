
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
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_number', invoiceId)
        .single();

      if (error) {
        console.error('Error fetching invoice:', error);
        setError('Invoice not found');
        return;
      }

      if (data) {
        setInvoice(data);
      }
    } catch (err) {
      console.error('Error:', err);
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
        </div>
      </div>
    );
  }

  return <BookingDetailPage invoice={invoice} />;
};

export default BookingDetails;
