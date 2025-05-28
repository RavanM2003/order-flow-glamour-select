
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/format';
import PriceDisplay from '@/components/ui/price-display';

interface CustomerOrdersAccordionProps {
  customerId: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  total_amount: number;
  status: string;
  appointment_status: string;
  issued_at: string;
  appointment_json: any;
}

const CustomerOrdersAccordion: React.FC<CustomerOrdersAccordionProps> = ({ customerId }) => {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['customer-invoices', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('appointment_json->>customer_info->>customer_id', customerId)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading orders...</div>;
  }

  if (!invoices || invoices.length === 0) {
    return <div className="p-4 text-center text-gray-500">No orders found</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-3">Customer Orders</h3>
      <Accordion type="single" collapsible value={expandedInvoice || ''} onValueChange={setExpandedInvoice}>
        {invoices.map((invoice) => (
          <AccordionItem key={invoice.id.toString()} value={invoice.id.toString()}>
            <AccordionTrigger className="text-left">
              <div className="flex items-center justify-between w-full mr-4">
                <span className="font-medium">{invoice.invoice_number}</span>
                <div className="flex items-center gap-2">
                  <PriceDisplay price={invoice.total_amount} className="text-sm" />
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'outline'}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Order Details</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span> {formatDate(invoice.issued_at)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span> {invoice.appointment_status || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Total:</span> <PriceDisplay price={invoice.total_amount} />
                    </p>
                  </div>
                  
                  {invoice.appointment_json && (
                    <div>
                      <h4 className="font-medium mb-2">Services & Products</h4>
                      {invoice.appointment_json.services && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Services:</p>
                          {invoice.appointment_json.services.map((service: any, index: number) => (
                            <p key={index} className="text-sm">
                              {service.name} - <PriceDisplay price={service.discounted_price || service.price} />
                            </p>
                          ))}
                        </div>
                      )}
                      {invoice.appointment_json.products && invoice.appointment_json.products.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Products:</p>
                          {invoice.appointment_json.products.map((product: any, index: number) => (
                            <p key={index} className="text-sm">
                              {product.name} (x{product.quantity}) - <PriceDisplay price={product.discounted_price || product.price} />
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CustomerOrdersAccordion;
