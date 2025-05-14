
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface DetailDrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  className?: string;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ 
  children, 
  open, 
  onOpenChange, 
  title, 
  className = '' 
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`w-full md:max-w-lg lg:max-w-xl overflow-y-auto ${className}`} side="right">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)]">
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default DetailDrawer;
