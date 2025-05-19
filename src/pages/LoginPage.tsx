
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from '@/config/env';

const LoginPage = () => {
  const { session, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
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
      
      const success = await login(email, password);
      
      if (success) {
        // Redirect to the page user was trying to access or to admin dashboard
        const redirect = location.state?.from?.pathname || '/admin';
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      setError('Gözlənilməz bir xəta baş verdi');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginAsUser = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const success = await login(userEmail, 'password123');
      
      if (success) {
        // Redirect to the page user was trying to access or to admin dashboard
        const redirect = location.state?.from?.pathname || '/admin';
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      setError('Gözlənilməz bir xəta baş verdi');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
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

          {config.usesMockData && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Test istifadəçiləri ilə giriş</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loginAsUser('admin@example.com')}
                  className="text-xs"
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Super Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loginAsUser('staff@example.com')}
                  className="text-xs"
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Staff
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loginAsUser('cash@example.com')}
                  className="text-xs"
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Cash Manager
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loginAsUser('appointment@example.com')}
                  className="text-xs"
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Appointment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loginAsUser('service@example.com')}
                  className="text-xs"
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Service
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loginAsUser('product@example.com')}
                  className="text-xs"
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Product
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Bütün test istifadəçilərinin şifrəsi: <code className="bg-gray-100 px-1 py-0.5 rounded">password123</code>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-500 w-full">
            <span className="font-medium">Salon İdarəetmə Sistemi</span> - Təhlükəsiz giriş tələb olunur
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
