
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GenderSelectorProps {
  value: 'male' | 'female' | '';
  onChange: (value: 'male' | 'female') => void;
  className?: string;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ value, onChange, className }) => {
  const { t } = useLanguage();

  return (
    <div className={cn("space-y-4", className)}>
      <label className="text-sm font-medium text-gray-700">
        {t('booking.gender')} *
      </label>
      <div className="grid grid-cols-2 gap-4">
        {/* Male Option */}
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-md",
            value === 'male' 
              ? "border-glamour-700 bg-glamour-700" 
              : "border-gray-200 hover:border-glamour-300 bg-white"
          )}
          onClick={() => onChange('male')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              "p-3 rounded-full transition-all",
              value === 'male'
                ? "bg-white text-glamour-700"
                : "bg-gray-100 text-glamour-700"
            )}>
              <User className="h-6 w-6" />
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors hidden md:block",
              value === 'male' ? "text-white" : "text-gray-600"
            )}>
              {t('booking.male')}
            </span>
          </div>
        </Card>

        {/* Female Option */}
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-md",
            value === 'female' 
              ? "border-glamour-700 bg-glamour-700" 
              : "border-gray-200 hover:border-glamour-300 bg-white"
          )}
          onClick={() => onChange('female')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              "p-3 rounded-full transition-all",
              value === 'female'
                ? "bg-white text-glamour-700"
                : "bg-gray-100 text-glamour-700"
            )}>
              <Users className="h-6 w-6" />
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors hidden md:block",
              value === 'female' ? "text-white" : "text-gray-600"
            )}>
              {t('booking.female')}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GenderSelector;
