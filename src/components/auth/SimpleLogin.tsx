
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
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sadə login - əslində authentication yoxdur, sadəcə user məlumatını yoxlayırıq
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Email və ya şifrə yanlışdır"
        });
        return;
      }

      // Local storage-da user məlumatını saxlayırıq
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast({
        title: "Uğurlu!",
        description: "Daxil oldunuz"
      });
      
      onLoginSuccess();
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
          <h1 className="text-2xl font-bold text-gray-900">Daxil ol</h1>
          <p className="text-gray-600">Hesabınıza daxil olun</p>
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
              placeholder="admin@example.com"
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
              placeholder="password123"
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

        <div className="mt-4 text-sm text-gray-600">
          <p>Test məlumatları:</p>
          <p>Email: admin@example.com</p>
          <p>Şifrə: password123</p>
        </div>
      </Card>
    </div>
  );
};

export default SimpleLogin;
