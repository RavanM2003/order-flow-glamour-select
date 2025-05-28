
import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Building2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CardPayment from '@/components/CardPayment';

const PaymentDetails = () => {
  const { t } = useLanguage();
  const { orderState, setPaymentMethod } = useOrder();
  const [selectedMethod, setSelectedMethod] = useState(orderState.paymentMethod || '');
  const [showCardForm, setShowCardForm] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: t('booking.cardPayment'),
      icon: CreditCard,
      description: t('booking.cardPaymentDesc')
    },
    {
      id: 'cash',
      name: t('booking.cashPayment'),
      icon: Banknote,
      description: t('booking.cashPaymentDesc')
    },
    {
      id: 'bank',
      name: t('booking.bankTransfer'),
      icon: Building2,
      description: t('booking.bankTransferDesc')
    }
  ];

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
    setShowCardForm(method === 'card');
  };

  const handlePaymentSubmit = (cardData: any) => {
    console.log('Payment submitted:', cardData);
    // Handle payment submission logic here
  };

  const totalAmount = orderState.totalAmount || 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('booking.orderSummary')}</h3>
        
        <div className="space-y-2 mb-4">
          {orderState.selectedService && (
            <div className="flex justify-between">
              <span>{orderState.selectedService.name}</span>
              <span>{orderState.selectedService.price} AZN</span>
            </div>
          )}
          
          {orderState.selectedProducts?.map((product) => {
            const quantity = product.quantity || 1;
            return (
              <div key={product.id} className="flex justify-between">
                <span>{product.name} x{quantity}</span>
                <span>{((product.price || 0) * quantity).toFixed(2)} AZN</span>
              </div>
            );
          })}
        </div>
        
        <div className="border-t pt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>{t('booking.total')}</span>
            <span>{totalAmount.toFixed(2)} AZN</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('booking.paymentMethod')}</h3>
        
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center space-x-3 flex-1">
                  <IconComponent className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label htmlFor={method.id} className="font-medium cursor-pointer">
                      {method.name}
                    </Label>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </Card>

      {showCardForm && (
        <Card className="p-6">
          <CardPayment 
            totalAmount={totalAmount}
            onPaymentSubmit={handlePaymentSubmit}
          />
        </Card>
      )}

      {selectedMethod && !showCardForm && (
        <Button className="w-full" size="lg">
          {t('booking.confirmPayment')} - {totalAmount.toFixed(2)} AZN
        </Button>
      )}
    </div>
  );
};

export default PaymentDetails;
