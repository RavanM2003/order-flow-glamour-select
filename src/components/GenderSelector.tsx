
import React from 'react';
import { Card } from '@/components/ui/card';
import { User, UserX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GenderSelectorProps {
  selectedGender: string;
  onGenderSelect: (gender: 'male' | 'female') => void;
  value?: string;
  onChange?: (value: any) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  selectedGender,
  onGenderSelect,
  value,
  onChange,
}) => {
  const { t } = useLanguage();

  // Use value/onChange if provided, otherwise use selectedGender/onGenderSelect
  const currentValue = value !== undefined ? value : selectedGender;
  const handleChange = onChange || onGenderSelect;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {t('booking.gender')} *
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Card
          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
            currentValue === 'male'
              ? 'border-glamour-700 bg-glamour-50'
              : 'border-gray-200'
          }`}
          onClick={() => handleChange('male')}
        >
          <div className="flex items-center justify-center space-x-2">
            <User className="h-3 w-3 text-blue-600" />
            <span className="text-sm font-medium">{t('booking.male')}</span>
          </div>
        </Card>
        <Card
          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
            currentValue === 'female'
              ? 'border-glamour-700 bg-glamour-50'
              : 'border-gray-200'
          }`}
          onClick={() => handleChange('female')}
        >
          <div className="flex items-center justify-center space-x-2">
            <UserX className="h-3 w-3 text-pink-600" />
            <span className="text-sm font-medium">{t('booking.female')}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GenderSelector;
