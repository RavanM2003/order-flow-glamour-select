
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface SimpleLoginProps {
  onLoginSuccess: () => void;
}

const SimpleLogin: React.FC<SimpleLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@glamour.az');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Test admin istifadəçisini yarat əgər yoxdursa
      if (email === 'admin@glamour.az' && password === 'admin123') {
        // Əvvəlcə istifadəçini yoxlayaq
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (!existingUser) {
          // Admin istifadəçisi yaradaq
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              email: 'admin@glamour.az',
              phone: '+994501234567',
              full_name: 'Admin User',
              role: 'admin',
              is_active: true,
              hashed_password: 'admin123'
            });

          if (insertError) {
            console.error('Admin user creation error:', insertError);
          }
        }

        // Local storage-da user məlumatını saxlayırıq
        localStorage.setItem('currentUser', JSON.stringify({
          id: 'admin-123',
          email: 'admin@glamour.az',
          full_name: 'Admin User',
          role: 'admin'
        }));
        
        toast({
          title: "Uğurlu!",
          description: "Admin panelə daxil oldunuz"
        });
        
        onLoginSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Email və ya şifrə yanlışdır"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Giriş zamanı xəta baş verdi"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Daxil ol</h1>
          <p className="text-gray-600">Admin panelinə daxil olun</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@glamour.az"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifrə
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="admin123"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-glamour-600 hover:bg-glamour-700"
            disabled={loading}
          >
            {loading ? 'Yüklənir...' : 'Daxil ol'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800 font-medium">Test məlumatları:</p>
          <p className="text-sm text-blue-700">Email: admin@glamour.az</p>
          <p className="text-sm text-blue-700">Şifrə: admin123</p>
        </div>
      </Card>
    </div>
  );
};

export default SimpleLogin;
