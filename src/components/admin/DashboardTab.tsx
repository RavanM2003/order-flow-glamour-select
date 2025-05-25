import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Users,
  Scissors,
  Package,
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LucideIcon } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trendValue,
  trendIcon: TrendIcon,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trendValue: string;
  trendIcon?: LucideIcon;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-xl md:text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center">
        {TrendIcon && <TrendIcon className="mr-1 h-4 w-4 text-green-500" />}
        <span className="whitespace-nowrap">{trendValue}</span>
      </p>
    </CardContent>
  </Card>
);

const StatsGrid = ({ currentData }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
    <StatCard
      title="Customers"
      value={currentData.customersCount}
      icon={Users}
      trendValue={`+${Math.round(
        currentData.customersCount * 0.12
      )} from previous period`}
    />
    <StatCard
      title="Service Sales"
      value={`$${currentData.servicesSales}`}
      icon={Scissors}
      trendValue="+8% from previous"
      trendIcon={TrendingUp}
    />
    <StatCard
      title="Product Sales"
      value={`$${currentData.productsSales}`}
      icon={Package}
      trendValue="+12% from previous"
      trendIcon={TrendingUp}
    />
    <StatCard
      title="Expenses"
      value={`$${currentData.expenses}`}
      icon={DollarSign}
      trendValue="-2% from previous"
      trendIcon={TrendingDown}
    />
  </div>
);

const AppointmentCard = ({
  title,
  value,
  amount,
  icon: Icon,
  bgColor,
  textColor,
}) => (
  <div className={`${bgColor} p-4 rounded-md`}>
    <div className="flex justify-between items-center mb-2">
      <h4 className={`text-sm font-medium ${textColor}`}>{title}</h4>
      <Icon className={`h-4 w-4 ${textColor}`} />
    </div>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    <p className={`text-sm ${textColor}`}>${amount}</p>
  </div>
);

const AppointmentsSummary = ({ currentData }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-balance">Appointments Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AppointmentCard
          title="Booked"
          value={currentData.appointmentsBooked}
          amount={currentData.appointmentsValue}
          icon={Calendar}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <AppointmentCard
          title="Rejected"
          value={currentData.appointmentsRejected}
          amount={currentData.rejectedValue}
          icon={Calendar}
          bgColor="bg-red-50"
          textColor="text-red-700"
        />
        <AppointmentCard
          title="Total"
          value={
            currentData.appointmentsBooked + currentData.appointmentsRejected
          }
          amount={currentData.appointmentsValue + currentData.rejectedValue}
          icon={BarChart}
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
      </div>
    </CardContent>
  </Card>
);

const PerformanceChart = ({ isMobile }) => (
  <Card>
    <CardHeader>
      <CardTitle>Performance Chart</CardTitle>
    </CardHeader>
    <CardContent className={isMobile ? "h-60" : "h-80"}>
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-md md:text-lg text-muted-foreground">
          Chart visualization will go here
        </div>
      </div>
    </CardContent>
  </Card>
);

const ReportTabs = ({ reportPeriod, setReportPeriod }) => (
  <div className="overflow-x-auto sm-touch-scroll pb-2">
    <Tabs
      value={reportPeriod}
      onValueChange={setReportPeriod}
      className="space-y-4"
    >
      <TabsList className="inline-flex w-full sm:w-auto">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="biweekly">15 Days</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
);

const DashboardTab = () => {
  const [reportPeriod, setReportPeriod] = useState("daily");
  const isMobile = useIsMobile();

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
      expenses: 450,
    },
    biweekly: {
      customersCount: 85,
      servicesSales: 5800,
      productsSales: 2100,
      appointmentsBooked: 67,
      appointmentsValue: 7200,
      appointmentsRejected: 15,
      rejectedValue: 1500,
      expenses: 2400,
    },
    monthly: {
      customersCount: 180,
      servicesSales: 12400,
      productsSales: 4800,
      appointmentsBooked: 145,
      appointmentsValue: 15600,
      appointmentsRejected: 32,
      rejectedValue: 3400,
      expenses: 5200,
    },
    yearly: {
      customersCount: 2100,
      servicesSales: 148000,
      productsSales: 58000,
      appointmentsBooked: 1720,
      appointmentsValue: 186000,
      appointmentsRejected: 380,
      rejectedValue: 41000,
      expenses: 62400,
    },
  };

  const currentData = reportData[reportPeriod as keyof typeof reportData];

  return (
    <div className="space-y-6">
      <ReportTabs
        reportPeriod={reportPeriod}
        setReportPeriod={setReportPeriod}
      />
      <StatsGrid currentData={currentData} />
      <AppointmentsSummary currentData={currentData} />
      <PerformanceChart isMobile={isMobile} />
    </div>
  );
};

export default DashboardTab;
