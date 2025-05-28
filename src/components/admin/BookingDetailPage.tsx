
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Printer, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  Clock, 
  CreditCard,
  Package,
  MapPin,
  Smartphone,
  Monitor,
  Globe
} from "lucide-react";
import { format } from "date-fns";

interface ServiceItem {
  id: number;
  name: string;
  price: number;
  discount: number;
  discounted_price: number;
  duration: number;
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  discounted_price: number;
}

interface BookingDetailProps {
  invoice: {
    invoice_number: string;
    issued_at: string;
    status: string;
    total_amount: number;
    appointment_json: {
      customer_info?: {
        full_name?: string;
        email?: string;
        number?: string;
        gender?: string;
        date?: string;
        time?: string;
        note?: string;
      };
      services?: ServiceItem[];
      products?: ProductItem[];
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
    };
  };
}

const BookingDetailPage: React.FC<BookingDetailProps> = ({ invoice }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  console.log('BookingDetailPage: Received invoice:', invoice);
  
  const { appointment_json } = invoice;
  
  // Provide default values to prevent errors
  const customerInfo = appointment_json?.customer_info || {};
  const services = appointment_json?.services || [];
  const products = appointment_json?.products || [];
  const paymentDetails = appointment_json?.payment_details || {};
  const requestInfo = appointment_json?.request_info || {};

  console.log('BookingDetailPage: Parsed data:', {
    customerInfo,
    services,
    products,
    paymentDetails,
    requestInfo
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      waiting: "bg-yellow-500",
      confirmed: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500"
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (newStatus: string) => {
    // TODO: Implement status change logic
    console.log(`Changing status to: ${newStatus}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-glamour-800">
                Invoice #{invoice.invoice_number}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {formatDateTime(invoice.issued_at)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {getStatusBadge(invoice.status)}
              <div className="flex gap-2">
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Invoice Preview</DialogTitle>
                    </DialogHeader>
                    <div className="print:block">
                      <InvoicePrintView invoice={invoice} />
                    </div>
                    <Button onClick={handlePrint} className="mt-4">
                      <Printer className="h-4 w-4 mr-2" />
                      Print Invoice
                    </Button>
                  </DialogContent>
                </Dialog>
                
                {invoice.status === 'waiting' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange('completed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                )}
                
                {invoice.status !== 'cancelled' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <CustomerInfoCard customerInfo={customerInfo} />
        
        {/* Payment Summary */}
        <PaymentSummaryCard paymentDetails={paymentDetails} />
      </div>

      {/* Services Section */}
      <ServicesCard services={services} />

      {/* Products Section */}
      <ProductsCard products={products} />

      {/* Request Info (Debug Panel) */}
      <RequestInfoCard requestInfo={requestInfo} />
    </div>
  );
};

const CustomerInfoCard: React.FC<{ customerInfo: any }> = ({ customerInfo }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Customer Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div>
        <p className="font-semibold text-lg">{customerInfo.full_name || 'N/A'}</p>
        <p className="text-gray-600">{customerInfo.email || 'N/A'}</p>
        <p className="text-gray-600">{customerInfo.number || 'N/A'}</p>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">Gender</p>
          <p className="text-gray-600 capitalize">{customerInfo.gender || 'N/A'}</p>
        </div>
        <div>
          <p className="font-medium">Appointment</p>
          <p className="text-gray-600 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {customerInfo.date || 'N/A'}
          </p>
          <p className="text-gray-600 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {customerInfo.time || 'N/A'}
          </p>
        </div>
      </div>
      {customerInfo.note && (
        <>
          <Separator />
          <div>
            <p className="font-medium text-sm">Note</p>
            <p className="text-gray-600 text-sm">{customerInfo.note}</p>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const PaymentSummaryCard: React.FC<{ paymentDetails: any }> = ({ paymentDetails }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Payment Summary
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${(paymentDetails.total_amount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount:</span>
          <span>-${(paymentDetails.discount_amount || 0).toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Paid:</span>
          <span>${(paymentDetails.paid_amount || 0).toFixed(2)}</span>
        </div>
      </div>
      <Separator />
      <div>
        <p className="font-medium text-sm">Payment Method</p>
        <p className="text-gray-600 capitalize">{paymentDetails.method || 'N/A'}</p>
      </div>
    </CardContent>
  </Card>
);

const ServicesCard: React.FC<{ services: ServiceItem[] }> = ({ services }) => (
  <Card>
    <CardHeader>
      <CardTitle>Services</CardTitle>
    </CardHeader>
    <CardContent>
      {services.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No services found</p>
      ) : (
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={service.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold">{service.name || 'Unnamed Service'}</h4>
                <p className="text-sm text-gray-600">{service.duration || 0} minutes</p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                {(service.discount || 0) > 0 && (
                  <p className="text-sm text-gray-500 line-through">${(service.price || 0).toFixed(2)}</p>
                )}
                <p className="font-semibold">${(service.discounted_price || service.price || 0).toFixed(2)}</p>
                {(service.discount || 0) > 0 && (
                  <p className="text-xs text-green-600">{service.discount}% off</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const ProductsCard: React.FC<{ products: ProductItem[] }> = ({ products }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        Products
      </CardTitle>
    </CardHeader>
    <CardContent>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No products found</p>
      ) : (
        <div className="space-y-3">
          {products.map((product, index) => (
            <div key={product.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold">{product.name || 'Unnamed Product'}</h4>
                <p className="text-sm text-gray-600">Quantity: {product.quantity || 0}</p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                {(product.discount || 0) > 0 && (
                  <p className="text-sm text-gray-500 line-through">${((product.price || 0) * (product.quantity || 0)).toFixed(2)}</p>
                )}
                <p className="font-semibold">${((product.discounted_price || product.price || 0) * (product.quantity || 0)).toFixed(2)}</p>
                {(product.discount || 0) > 0 && (
                  <p className="text-xs text-green-600">{product.discount}% off</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const RequestInfoCard: React.FC<{ requestInfo: any }> = ({ requestInfo }) => (
  <Card>
    <Accordion type="single" collapsible>
      <AccordionItem value="request-info">
        <AccordionTrigger className="px-6">
          <span className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Request Information (Debug)
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">IP Address:</span>
                <span className="text-gray-600">{requestInfo.ip || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span className="font-medium">Device:</span>
                <span className="text-gray-600">{requestInfo.device || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="font-medium">OS:</span>
                <span className="text-gray-600">{requestInfo.os || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="font-medium">Browser:</p>
                <p className="text-gray-600 text-xs">{requestInfo.browser || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Entry Page:</p>
                <p className="text-gray-600">{requestInfo.page || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Entry Time:</p>
                <p className="text-gray-600">
                  {requestInfo.entry_time ? format(new Date(requestInfo.entry_time), "MMM dd, yyyy HH:mm:ss") : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
);

const InvoicePrintView: React.FC<{ invoice: any }> = ({ invoice }) => {
  const customerInfo = invoice.appointment_json?.customer_info || {};
  const services = invoice.appointment_json?.services || [];
  const products = invoice.appointment_json?.products || [];
  const paymentDetails = invoice.appointment_json?.payment_details || {};

  return (
    <div className="p-6 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">INVOICE</h1>
        <p className="text-gray-600">#{invoice.invoice_number}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Customer:</h3>
          <p>{customerInfo.full_name || 'N/A'}</p>
          <p>{customerInfo.email || 'N/A'}</p>
          <p>{customerInfo.number || 'N/A'}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Appointment:</h3>
          <p>Date: {customerInfo.date || 'N/A'}</p>
          <p>Time: {customerInfo.time || 'N/A'}</p>
          <p>Status: {invoice.status}</p>
        </div>
      </div>

      {services.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Services:</h3>
          {services.map((service: ServiceItem, index: number) => (
            <div key={service.id || index} className="flex justify-between py-1">
              <span>{service.name || 'Unnamed Service'} ({service.duration || 0}min)</span>
              <span>${(service.discounted_price || service.price || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Products:</h3>
          {products.map((product: ProductItem, index: number) => (
            <div key={product.id || index} className="flex justify-between py-1">
              <span>{product.name || 'Unnamed Product'} (x{product.quantity || 0})</span>
              <span>${((product.discounted_price || product.price || 0) * (product.quantity || 0)).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Paid:</span>
          <span>${(paymentDetails.paid_amount || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
