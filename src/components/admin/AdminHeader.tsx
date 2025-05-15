
import React, { useState } from "react";
import { Bell, Search, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const AdminHeader = () => {
  const isMobile = useIsMobile();
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between">
      {isMobile && searchVisible ? (
        <div className="flex-1 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-full" 
              autoFocus
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="ml-2"
            onClick={() => setSearchVisible(false)}
          >
            <X size={20} />
          </Button>
        </div>
      ) : (
        <>
          <div className={cn("relative", isMobile ? "w-auto" : "w-64")}>
            {isMobile ? (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSearchVisible(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10" />
              </>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-1 md:gap-2"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <LogOut size={18} />
              {!isMobile && <span>Çıx</span>}
            </Button>
          </div>
        </>
      )}
    </header>
  );
};

export default AdminHeader;
