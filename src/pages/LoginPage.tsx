
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, UserCheck, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from '@/config/env';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const { session, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [authDebug, setAuthDebug] = useState<string | null>(null);
  
  // Check for Supabase connection issues
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('count()', { count: 'exact', head: true });
        
        if (error) {
          console.error('Supabase connection test error:', error);
          setAuthDebug(`Supabase bağlantı xətası: ${error.message}`);
        } else {
          console.log('Supabase connection successful');
          setAuthDebug(null);
        }
      } catch (err) {
        console.error('Unexpected error in Supabase connection test:', err);
        setAuthDebug('Supabase ilə gözlənilməz bağlantı xətası');
      }
    };
    
    checkSupabaseConnection();
  }, []);
  
  // Redirect if user is already logged in
  if (session.isAuthenticated) {
    const redirect = location.state?.from?.pathname || '/admin';
    return <Navigate to={redirect} replace />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (!email || !password) {
        setError('Email və şifrə tələb olunur');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Attempting login with Supabase...');
      const success = await login(email, password);
      
      if (success) {
        // Redirect to the page user was trying to access or to admin dashboard
        toast({
          title: "Uğurla giriş etdiniz",
          description: "Admin panelinə yönləndirilirsiniz..."
        });
        const redirect = location.state?.from?.pathname || '/admin';
        navigate(redirect, { replace: true });
      } else {
        setError('Email və ya şifrə yanlışdır');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gözlənilməz bir xəta baş verdi';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginAsUser = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('admin123'); // Using the password from our SQL insert
    
    try {
      setIsSubmitting(true);
      setError('');
      
      console.log('Attempting login with test account...');
      const success = await login(userEmail, 'admin123');
      
      if (success) {
        // Redirect to the page user was trying to access or to admin dashboard
        toast({
          title: "Uğurla giriş etdiniz",
          description: "Admin panelinə yönləndirilirsiniz..."
        });
        const redirect = location.state?.from?.pathname || '/admin';
        navigate(redirect, { replace: true });
      } else {
        setError('Test istifadəçi məlumatları ilə giriş alınmadı. Zəhmət olmasa administrator ilə əlaqə saxlayın.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gözlənilməz bir xəta baş verdi';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Special direct login for demo purposes - no actual auth check
  const bypassLogin = (role: string) => {
    const mockUserMap: Record<string, any> = {
      'admin': {
        id: 'mock-admin-id',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      'staff': {
        id: 'mock-staff-id',
        email: 'staff@example.com',
        firstName: 'Staff',
        lastName: 'Member',
        role: 'staff',
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      'cashier': {
        id: 'mock-cashier-id',
        email: 'cash@example.com',
        firstName: 'Cash',
        lastName: 'Manager',
        role: 'cashier',
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      'appointment': {
        id: 'mock-appointment-id',
        email: 'appointment@example.com',
        firstName: 'Appointment',
        lastName: 'Manager',
        role: 'appointment',
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      'service': {
        id: 'mock-service-id',
        email: 'service@example.com',
        firstName: 'Service',
        lastName: 'Manager',
        role: 'service',
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      'product': {
        id: 'mock-product-id',
        email: 'product@example.com',
        firstName: 'Product',
        lastName: 'Manager',
        role: 'product',
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
    };
    
    if (role in mockUserMap) {
      // Store mock user data in local storage
      const mockUser = mockUserMap[role];
      localStorage.setItem('MOCK_USER_DATA', JSON.stringify({
        user: mockUser,
        expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));
      
      toast({
        title: "Demo giriş aktivləşdirildi",
        description: `${mockUser.firstName} ${mockUser.lastName} kimi giriş etdiniz (${mockUser.role})`
      });
      
      const redirect = location.state?.from?.pathname || '/admin';
      navigate(redirect, { replace: true });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Salon İdarəetmə Sistemi</CardTitle>
          <CardDescription className="text-center">
            Sistemə daxil olmaq üçün hesabınıza giriş edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authDebug && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Supabase bağlantı xətası</AlertTitle>
              <AlertDescription>
                {authDebug}
                <div className="mt-2 text-xs">
                  Bu problemi həll etmək üçün şəbəkə bağlantınızı yoxlayın və ya administratorla əlaqə saxlayın.
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || isLoading}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gözləyin...
                </>
              ) : (
                'Daxil ol'
              )}
            </Button>
          </form>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Demo giriş</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => bypassLogin('admin')}
                className="text-xs"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Super Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => bypassLogin('staff')}
                className="text-xs"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Staff
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => bypassLogin('cashier')}
                className="text-xs"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Cash Manager
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => bypassLogin('appointment')}
                className="text-xs"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Appointment
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => bypassLogin('service')}
                className="text-xs"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Service
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => bypassLogin('product')}
                className="text-xs"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Product
              </Button>
            </div>
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Test hesablar (email/şifrə)</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => loginAsUser('admin@example.com')}
                  className="text-xs"
                  disabled={isSubmitting || !!authDebug}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Super Admin
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => loginAsUser('manager@example.com')}
                  className="text-xs"
                  disabled={isSubmitting || !!authDebug}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Admin
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => loginAsUser('cash@example.com')}
                  className="text-xs"
                  disabled={isSubmitting || !!authDebug}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Cash Manager
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => loginAsUser('appointment@example.com')}
                  className="text-xs"
                  disabled={isSubmitting || !!authDebug}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Appointment
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => loginAsUser('service@example.com')}
                  className="text-xs"
                  disabled={isSubmitting || !!authDebug}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Service
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => loginAsUser('product@example.com')}
                  className="text-xs"
                  disabled={isSubmitting || !!authDebug}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Product
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Test istifadəçiləri üçün şifrə: <code className="bg-gray-100 px-1 py-0.5 rounded">admin123</code>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-500 w-full">
            <span className="font-medium">Salon İdarəetmə Sistemi</span> - Təhlükəsiz giriş tələb olunur
            <br />
            <span className="text-xs mt-1 block">
              {config.usesMockData ? 'Demo rejimində işləyir' : (config.usesSupabase ? 'Supabase ilə bağlantı var' : 'API ilə işləyir')}
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
