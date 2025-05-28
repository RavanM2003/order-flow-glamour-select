
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import BookingDetailPage from "@/components/admin/BookingDetailPage";

// Type guards and interfaces for appointment_json
interface AppointmentJson {
  customer_info?: {
    full_name?: string;
    email?: string;
    number?: string;
    gender?: string;
    date?: string;
    time?: string;
    note?: string;
  };
  services?: Array<{
    id: number;
    name: string;
    price: number;
    discount: number;
    discounted_price: number;
    duration: number;
  }>;
  products?: Array<{
    id: number;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    discounted_price: number;
  }>;
  payment_details?: {
    method?: string;
    paid_amount?: number;
    total_amount?: number;
    discount_amount?: number;
  };
  request_info?: {
    ip?: string;
    browser?: string;
    device?: string;
    os?: string;
    page?: string;
    entry_time?: string;
  };
}

const isValidAppointmentJson = (data: any): data is AppointmentJson => {
  return data && typeof data === 'object' && !Array.isArray(data);
};

const BookingDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('BookingDetails: orderId from URL params:', orderId);
    if (orderId) {
      fetchInvoiceDetails();
    } else {
      setError('Sifariş ID-si tapılmadı');
      setLoading(false);
    }
  }, [orderId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching invoice with invoice_number:', orderId);
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_number', orderId)
        .single();

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setError('Sifariş tapılmadı');
        return;
      }

      if (data) {
        console.log('Invoice data found:', data);
        console.log('appointment_json structure:', data.appointment_json);
        
        // Validate appointment_json structure
        if (!data.appointment_json) {
          console.error('appointment_json is null or undefined');
          setError('Sifariş məlumatları natamam: təyinat məlumatları yoxdur');
          return;
        }

        // Type cast and validate the appointment_json
        const appointmentJson = data.appointment_json as any;
        
        if (!isValidAppointmentJson(appointmentJson)) {
          console.error('appointment_json is not a valid object');
          setError('Sifariş məlumatları səhvdir: təyinat məlumatları düzgün formatda deyil');
          return;
        }

        // Check for required fields in appointment_json
        if (!appointmentJson.customer_info) {
          console.error('Missing customer_info in appointment_json');
          setError('Sifariş məlumatları natamam: müştəri məlumatları yoxdur');
          return;
        }

        setInvoice(data);
      } else {
        console.error('No data returned from query');
        setError('Sifariş tapılmadı');
      }
    } catch (err) {
      console.error('Error in fetchInvoiceDetails:', err);
      setError('Sifariş məlumatları yüklənə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (orderId) {
      fetchInvoiceDetails();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600 font-medium">Sifariş məlumatları yüklənir...</span>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-56 w-full rounded-xl" />
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-2xl mx-auto pt-16">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                  Sifariş Tapılmadı
                </CardTitle>
                <p className="text-slate-600">
                  {error || 'Axtardığınız sifariş mövcud deyil.'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-amber-800">
                  <div className="space-y-2">
                    <p className="font-medium">Məlumat:</p>
                    <p>Sifariş ID: <Badge variant="outline" className="ml-1">{orderId || 'Təyin edilməyib'}</Badge></p>
                    <p className="text-sm">Axtarılan invoice_number: {orderId}</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  disabled={!orderId}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenidən Cəhd Et
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="px-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri Qayıt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <BookingDetailPage invoice={invoice} />
    </div>
  );
};

export default BookingDetails;
