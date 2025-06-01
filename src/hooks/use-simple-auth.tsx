
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/models/user.model';
import { toast } from '@/components/ui/use-toast';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Bu hissə backend API ilə inteqrasiya olunacaq
      // Hazırda sadə mock authentication
      if (email === 'admin@glamour.az' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          email: 'admin@glamour.az',
          full_name: 'Admin User',
          role: 'super_admin',
          phone: '+994501234567'
        };
        
        setUser(adminUser);
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        
        toast({
          title: "Uğurla daxil oldunuz",
          description: "Admin panelinə yönləndirilirsiniz...",
        });
        
        return { success: true };
      } else {
        return { success: false, error: 'Email və ya şifrə yanlışdır' };
      }
    } catch (error) {
      return { success: false, error: 'Xəta baş verdi' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    toast({
      title: "Çıxış edildi",
      description: "Təhlükəsiz şəkildə çıxış etdiniz",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
