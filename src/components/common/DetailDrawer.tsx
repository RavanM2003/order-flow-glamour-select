import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ open, onOpenChange, title, children }) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent className="max-w-xl ml-auto mr-0 max-h-[90vh] overflow-y-auto flex flex-col">
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerClose asChild>
          <Button variant="ghost" className="absolute top-2 right-2">Close</Button>
        </DrawerClose>
      </DrawerHeader>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </DrawerContent>
  </Drawer>
);

export default DetailDrawer; 