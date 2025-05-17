
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Staff, StaffPayment, StaffServiceRecord } from '@/models/staff.model';
import { Calendar, Clock, DollarSign, User, Percent, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useStaff } from '@/hooks/use-staff';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StaffDetailsProps {
  staffId: number | string;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ staffId }) => {
  const { 
    selectedStaff, 
    getStaffMember, 
    staffPayments, 
    fetchStaffPayments,
    serviceRecords,
    fetchServiceRecords,
    earnings,
    calculateEarnings,
    isLoading 
  } = useStaff();
  
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  useEffect(() => {
    if (staffId) {
      getStaffMember(staffId);
      fetchStaffPayments(staffId);
      fetchServiceRecords(staffId);
    }
  }, [staffId, getStaffMember, fetchStaffPayments, fetchServiceRecords]);
  
  useEffect(() => {
    if (staffId) {
      calculateEarnings(staffId, currentMonth, currentYear);
    }
  }, [staffId, currentMonth, currentYear, calculateEarnings]);
  
  const handleMonthChange = (value: string) => {
    setCurrentMonth(parseInt(value));
  };
  
  const handleYearChange = (value: string) => {
    setCurrentYear(parseInt(value));
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentDate = new Date();
  const availableYears = Array.from(
    { length: 5 }, 
    (_, i) => currentDate.getFullYear() - 2 + i
  );
  
  if (!selectedStaff) {
    return (
      <div className="p-4 text-center">
        {isLoading ? "Loading..." : "Staff member not found"}
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
        <p className="text-muted-foreground">{selectedStaff.position || 'Staff Member'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2" /> Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Type:</span>
                <span className="font-medium">{selectedStaff.paymentType || 'Not specified'}</span>
              </div>
              {(selectedStaff.paymentType === 'salary' || selectedStaff.paymentType === 'both') && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Salary:</span>
                  <span className="font-medium">${selectedStaff.salary || 0}</span>
                </div>
              )}
              {(selectedStaff.paymentType === 'commission' || selectedStaff.paymentType === 'both') && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission Rate:</span>
                  <span className="font-medium">{selectedStaff.commissionRate || 0}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" /> Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="month">Month</Label>
                <Select 
                  value={currentMonth.toString()} 
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="year">Year</Label>
                <Select 
                  value={currentYear.toString()} 
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" /> Earnings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnings ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="font-medium">${earnings.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission:</span>
                  <span className="font-medium">${earnings.commission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expenses:</span>
                  <span className="font-medium">-${earnings.expenses}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">${earnings.total}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                {isLoading ? "Calculating..." : "No earnings data"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Records</CardTitle>
        </CardHeader>
        <CardContent>
          {serviceRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.customerName}</TableCell>
                    <TableCell>{record.serviceName}</TableCell>
                    <TableCell className="text-right">${record.amount}</TableCell>
                    <TableCell className="text-right">${record.commission || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              {isLoading ? "Loading service records..." : "No service records found"}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {staffPayments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffPayments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <span className={`capitalize ${payment.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                        {payment.type}
                      </span>
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell className="text-right">
                      {payment.type === 'expense' ? '-' : ''}${payment.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              {isLoading ? "Loading payment history..." : "No payment history found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDetails;
