
import React, { useState, useEffect } from "react";
import { Bell, Search, LogOut, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { config } from "@/config/env";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

const AdminHeader = () => {
  const isMobile = useIsMobile();
  const [searchVisible, setSearchVisible] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mockUser, setMockUser] = useState<any>(null);
  const { t } = useLanguage();
  
  // Check for mock user
  useEffect(() => {
    const mockUserData = localStorage.getItem('MOCK_USER_DATA');
    if (mockUserData) {
      try {
        const { user, expiry } = JSON.parse(mockUserData);
        if (expiry && expiry > Date.now()) {
          setMockUser(user);
        } else {
          localStorage.removeItem('MOCK_USER_DATA');
        }
      } catch (e) {
        localStorage.removeItem('MOCK_USER_DATA');
      }
    }
  }, []);
  
  // Determine environment indicator
  const getEnvIndicator = () => {
    if (!config.features.debugMode) return null;
    
    return (
      <div className="px-2 py-1 rounded text-xs font-semibold hidden md:block">
        {mockUser ? (
          <span className="text-purple-600">DEMO MODE</span>
        ) : config.usesMockData ? (
          <span className="text-amber-600">LOCAL MODE</span>
        ) : (
          <span className="text-green-600">API MODE</span>
        )}
      </div>
    );
  };

  const handleLogout = () => {
    // Check if this is a mock user
    if (mockUser) {
      localStorage.removeItem('MOCK_USER_DATA');
      toast({
        title: t('common.logout'),
        description: t('common.logoutSuccess')
      });
    }
    
    // Navigate to the home page
    navigate('/');
  };

  return (
    <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between">
      {isMobile && searchVisible ? (
        <div className="flex-1 flex items-center">
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
          <div className={cn("flex items-center gap-2", isMobile ? "w-auto" : "w-64")}>
            {mockUser && (
              <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                Demo: {mockUser.role}
              </div>
            )}
            
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchVisible(true)}
              >
                <Search size={20} />
              </Button>
            ) : (
              <div className="relative w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder={t('admin.searchPlaceholder')}
                  className="pl-8 pr-4"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language Selector - adding it here */}
            <LanguageSelector />
            
            {mockUser && (
              <div className="hidden md:flex items-center mr-2">
                <User size={16} className="text-gray-500 mr-2" />
                <span className="text-sm">
                  {mockUser.firstName} {mockUser.lastName}
                </span>
              </div>
            )}
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-1 md:gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              {!isMobile && <span>{t('admin.logout')}</span>}
            </Button>
          </div>
        </>
      )}
      
      {/* Add environment indicator */}
      {getEnvIndicator()}
    </header>
  );
};

export default AdminHeader;
