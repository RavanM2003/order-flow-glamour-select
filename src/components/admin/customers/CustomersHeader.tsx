
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface CustomersHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddClick: () => void;
}

const CustomersHeader: React.FC<CustomersHeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  onAddClick 
}) => (
  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <CardTitle>Customers</CardTitle>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="w-full sm:w-[200px] pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Customer
      </Button>
    </div>
  </CardHeader>
);

export default CustomersHeader;
