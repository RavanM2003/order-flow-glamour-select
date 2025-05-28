
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import AdminVerticalNav from './AdminVerticalNav';
import AdminHeader from './AdminHeader';

interface OptimizedAdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const OptimizedAdminLayout = ({ children, activeTab, onTabChange }: OptimizedAdminLayoutProps) => {
  const isMobile = useIsMobile();
  const { sidebarOpen, setSidebarOpen, notifications } = useAppStore();
  
  // Close sidebar when tab changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [activeTab, isMobile, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "z-20 transition-all duration-300",
          isMobile ? "fixed left-0 top-0 bottom-0" : "relative",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <AdminVerticalNav 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          notifications={notifications} 
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <AdminHeader />
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 z-30"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OptimizedAdminLayout;
