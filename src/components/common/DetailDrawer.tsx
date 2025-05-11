import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { OrderProvider } from '@/context/OrderContext';

interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ open, onOpenChange, title, children }) => (
  <OrderProvider>
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-1/2 max-w-[70vw] ml-auto mr-0 h-[99vh] max-h-[99vh] overflow-y-auto flex flex-col">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" className="absolute top-1 right-1">Close</Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 min-h-0 flex flex-col">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  </OrderProvider>
);

export default DetailDrawer; 