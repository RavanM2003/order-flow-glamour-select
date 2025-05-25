
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CardPaymentProps {
  totalAmount: number;
  onPaymentSubmit: (cardData: any) => void;
  isLoading?: boolean;
}

const CardPayment: React.FC<CardPaymentProps> = ({
  totalAmount,
  onPaymentSubmit,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentSubmit(cardData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <CreditCard className="h-5 w-5 mr-2 text-glamour-700" />
        <h3 className="text-lg font-semibold">{t('booking.cardPayment')}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cardholderName">Kart sahibinin adı</Label>
          <Input
            id="cardholderName"
            type="text"
            value={cardData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="Ad Soyad"
            required
          />
        </div>

        <div>
          <Label htmlFor="cardNumber">Kart nömrəsi</Label>
          <Input
            id="cardNumber"
            type="text"
            value={cardData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Son istifadə tarixi</Label>
            <Input
              id="expiryDate"
              type="text"
              value={cardData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="text"
              value={cardData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <Lock className="h-4 w-4 mr-1" />
            Təhlükəsiz ödəniş
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Ümumi məbləğ</div>
            <div className="text-lg font-bold text-glamour-700">
              {totalAmount.toFixed(2)} AZN
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Ödəniş işlənir...' : `${totalAmount.toFixed(2)} AZN Ödə`}
        </Button>
      </form>
    </Card>
  );
};

export default CardPayment;
