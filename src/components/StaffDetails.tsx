
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, DollarSign, User, Users, Phone, Mail, Briefcase, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaff } from '@/hooks/use-staff';
import { Staff } from '@/models/staff.model';
import StaffWorkingHoursEditor from './StaffWorkingHoursEditor';

interface StaffDetailsProps {
  staffId?: string | number;
  onEdit?: () => void;
}

const StaffDetails: React.FC<StaffDetailsProps> = ({ staffId, onEdit }) => {
  const { staff, isLoading, error } = useStaff();
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffPayments, setStaffPayments] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, commission: 0, salary: 0 });
  
  useEffect(() => {
    // Find the staff member in the staff array
    if (staffId && staff && staff.length > 0) {
      const found = staff.find(s => s.id.toString() === staffId.toString());
      if (found) {
        setSelectedStaff(found);
      }
    }
    
    // Mock data for now
    setStaffPayments([]);
    setServiceRecords([]);
    setEarnings({
      total: 5200,
      commission: 1200,
      salary: 4000
    });
  }, [staff, staffId]);

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Loading staff details...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading staff details: {error}</div>;
  }

  if (!selectedStaff) {
    return <div className="p-4">No staff member selected</div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getPaymentTypeDisplay = (type?: string) => {
    switch(type) {
      case "salary": return "Salary Only";
      case "commission": return "Commission Only";
      case "hybrid": return "Salary + Commission";
      default: return "Not set";
    }
  };

  return (
    <div className="space-y-6">
      {/* Staff Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24">
              {selectedStaff.avatar_url ? (
                <img src={selectedStaff.avatar_url} alt={selectedStaff.name} className="rounded-full" />
              ) : (
                <AvatarFallback className="text-2xl">
                  {getInitials(selectedStaff.name)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
                  <p className="text-gray-500">{selectedStaff.position || "Staff Member"}</p>
                </div>
                
                <Button variant="outline" onClick={onEdit}>
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-gray-500" />
                  <span>{selectedStaff.phone || "No phone number"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-gray-500" />
                  <span>{selectedStaff.email || "No email"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-gray-500" />
                  <span>Payment: {getPaymentTypeDisplay(selectedStaff.paymentType)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {selectedStaff.specializations && selectedStaff.specializations.length > 0 ? (
                      selectedStaff.specializations.map(spec => (
                        <Badge key={spec} variant="outline">
                          Service #{spec}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No specializations</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" /> Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">Total Earnings</p>
              <p className="text-2xl font-bold">${earnings.total}</p>
            </div>
            
            {(selectedStaff.paymentType === "commission" || selectedStaff.paymentType === "hybrid") && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">Commission</p>
                <p className="text-2xl font-bold">${earnings.commission}</p>
              </div>
            )}
            
            {(selectedStaff.paymentType === "salary" || selectedStaff.paymentType === "hybrid") && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-700">Salary</p>
                <p className="text-2xl font-bold">${earnings.salary}</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Monthly Target</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <StaffWorkingHoursEditor staffId={staffId} />

      {/* Tabs for Payments, Services, etc */}
      <Tabs defaultValue="payments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {staffPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No payment history found for this staff member
                </div>
              ) : (
                <div>Payment history will be shown here</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {serviceRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No service records found for this staff member
                </div>
              ) : (
                <div>Service records will be shown here</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-500">
                Schedule information will be shown here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDetails;
