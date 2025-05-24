
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, UserCheck } from 'lucide-react';
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
              ? "border-glamour-700 bg-glamour-50" 
              : "border-gray-200 hover:border-glamour-300"
          )}
          onClick={() => onChange('male')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              "p-3 rounded-full transition-all",
              value === 'male'
                ? "bg-glamour-700 text-white"
                : "bg-gray-100 text-glamour-700"
            )}>
              {value === 'male' ? (
                <UserCheck className="h-6 w-6" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors hidden md:block",
              value === 'male' ? "text-glamour-700" : "text-gray-600"
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
              ? "border-glamour-700 bg-glamour-50" 
              : "border-gray-200 hover:border-glamour-300"
          )}
          onClick={() => onChange('female')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              "p-3 rounded-full transition-all",
              value === 'female'
                ? "bg-glamour-700 text-white"
                : "bg-gray-100 text-glamour-700"
            )}>
              {value === 'female' ? (
                <UserCheck className="h-6 w-6" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors hidden md:block",
              value === 'female' ? "text-glamour-700" : "text-gray-600"
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
