
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart,
  Users,
  Scissors,
  Package,
  Calendar,
  DollarSign, 
  TrendingDown,
  TrendingUp
} from 'lucide-react';

const DashboardTab = () => {
  const [reportPeriod, setReportPeriod] = useState('daily');
  
  // Mock data
  const reportData = {
    daily: {
      customersCount: 15,
      servicesSales: 980,
      productsSales: 420,
      appointmentsBooked: 12,
      appointmentsValue: 1200,
      appointmentsRejected: 3,
      rejectedValue: 300,
      expenses: 450
    },
    biweekly: {
      customersCount: 85,
      servicesSales: 5800,
      productsSales: 2100,
      appointmentsBooked: 67,
      appointmentsValue: 7200,
      appointmentsRejected: 15,
      rejectedValue: 1500,
      expenses: 2400
    },
    monthly: {
      customersCount: 180,
      servicesSales: 12400,
      productsSales: 4800,
      appointmentsBooked: 145,
      appointmentsValue: 15600,
      appointmentsRejected: 32,
      rejectedValue: 3400,
      expenses: 5200
    },
    yearly: {
      customersCount: 2100,
      servicesSales: 148000,
      productsSales: 58000,
      appointmentsBooked: 1720,
      appointmentsValue: 186000,
      appointmentsRejected: 380,
      rejectedValue: 41000,
      expenses: 62400
    }
  };
  
  const currentData = reportData[reportPeriod as keyof typeof reportData];
  
  return (
    <div className="space-y-6">
      <div>
        <Tabs value={reportPeriod} onValueChange={setReportPeriod} className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="biweekly">15 Days</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.customersCount}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round(currentData.customersCount * 0.12)} from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Sales</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentData.servicesSales}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              +8% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Sales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentData.productsSales}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              +12% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentData.expenses}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              -2% from previous period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Appointments Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-green-700">Booked</h4>
                <Calendar className="h-4 w-4 text-green-700" />
              </div>
              <p className="text-2xl font-bold text-green-700">{currentData.appointmentsBooked}</p>
              <p className="text-sm text-green-600">${currentData.appointmentsValue}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-red-700">Rejected</h4>
                <Calendar className="h-4 w-4 text-red-700" />
              </div>
              <p className="text-2xl font-bold text-red-700">{currentData.appointmentsRejected}</p>
              <p className="text-sm text-red-600">${currentData.rejectedValue}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-blue-700">Total</h4>
                <BarChart className="h-4 w-4 text-blue-700" />
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {currentData.appointmentsBooked + currentData.appointmentsRejected}
              </p>
              <p className="text-sm text-blue-600">
                ${currentData.appointmentsValue + currentData.rejectedValue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <div className="text-lg text-muted-foreground">
            Chart visualization will go here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
