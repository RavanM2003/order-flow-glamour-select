
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Download
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatCard = ({ title, value, icon, trend, onClick }: StatCardProps) => (
  <Card className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className={`flex items-center text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {trend.value}
            </div>
          )}
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
}

const QuickAction = ({ title, description, icon, onClick, badge }: QuickActionProps) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface OptimizedDashboardProps {
  stats: {
    customers: number;
    revenue: number;
    appointments: number;
    growth: number;
  };
  loading?: boolean;
}

const OptimizedDashboard = ({ stats, loading = false }: OptimizedDashboardProps) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Dashboard yüklənir...</span>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Yeni müştəri",
      description: "Sistemə yeni müştəri əlavə et",
      icon: <Users className="h-5 w-5" />,
      onClick: () => console.log('Add customer'),
    },
    {
      title: "Təyinat yarat",
      description: "Yeni randevu təyin et",
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => console.log('Create appointment'),
      badge: "Yeni"
    },
    {
      title: "Hesabat al",
      description: "Aylıq hesabatı yüklə",
      icon: <Download className="h-5 w-5" />,
      onClick: () => console.log('Download report'),
    },
    {
      title: "Analitika",
      description: "Detallı statistikalar",
      icon: <Eye className="h-5 w-5" />,
      onClick: () => console.log('View analytics'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <StatCard
          title="Müştərilər"
          value={stats.customers}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: "+12% bu ay", isPositive: true }}
        />
        <StatCard
          title="Gəlir"
          value={`${stats.revenue} AZN`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: "+8% bu ay", isPositive: true }}
        />
        <StatCard
          title="Təyinatlar"
          value={stats.appointments}
          icon={<Calendar className="h-5 w-5" />}
          trend={{ value: "+5% bu ay", isPositive: true }}
        />
        <StatCard
          title="Artım"
          value={`${stats.growth}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: "+2% əvvəlki aya nisbətən", isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Sürətli əməliyyatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Son fəaliyyətlər</CardTitle>
          <Button variant="outline" size="sm">
            Hamısını gör
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Yeni müştəri qeydiyyatı</p>
                  <p className="text-xs text-muted-foreground">5 dəqiqə əvvəl</p>
                </div>
                <Badge variant="outline" className="text-xs">Yeni</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedDashboard;
