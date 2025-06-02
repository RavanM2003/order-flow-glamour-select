
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, Banknote, Building2 } from 'lucide-react';

interface PaymentStepProps {
  paymentMethod: string;
  onUpdate: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMethod,
  onUpdate,
  onNext,
  onBack
}) => {
  const paymentOptions = [
    {
      id: 'cash',
      name: 'Nağd',
      description: 'Salonumuzda nağd ödəniş',
      icon: Banknote
    },
    {
      id: 'card',
      name: 'Kartla',
      description: 'Bank kartı ilə ödəniş',
      icon: CreditCard
    },
    {
      id: 'bank',
      name: 'Bank köçürməsi',
      description: 'Bank hesabına köçürmə',
      icon: Building2
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-glamour-800 mb-2">Ödəniş Növü</h2>
        <p className="text-gray-600">Ödəniş üsulunu seçin</p>
      </div>

      <div className="grid gap-4">
        {paymentOptions.map(option => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.id;
          
          return (
            <Card 
              key={option.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-glamour-500 bg-glamour-50' : ''
              }`}
              onClick={() => onUpdate(option.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isSelected ? 'bg-glamour-200' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-glamour-700' : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{option.name}</h3>
                  <p className="text-gray-600">{option.description}</p>
                </div>
                
                {isSelected && (
                  <div className="w-5 h-5 bg-glamour-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Geri
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!paymentMethod}
          className="bg-glamour-600 hover:bg-glamour-700"
        >
          Növbəti Addım
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
