
import React, { useState } from 'react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/context/LanguageContext';

interface BookingDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  maxAdvanceDays?: number;
}

const BookingDatePicker: React.FC<BookingDatePickerProps> = ({
  value,
  onChange,
  maxAdvanceDays = 30
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const today = startOfDay(new Date());
  const maxDate = addDays(today, maxAdvanceDays);

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || isBefore(maxDate, date);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && !isDateDisabled(selectedDate)) {
      onChange(selectedDate);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{t('booking.selectDate')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
          fromDate={today}
          toDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
};

export default BookingDatePicker;
