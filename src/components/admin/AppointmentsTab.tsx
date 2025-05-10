
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Calendar as CalendarIcon,
  Clock,
  User
} from 'lucide-react';

const AppointmentsTab = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Mock appointments data
  const appointments = [
    { 
      id: 1, 
      customerName: "Anna Johnson", 
      customerPhone: "+994 50 123 4567",
      services: ["Facial Treatment"], 
      products: ["Moisturizer Cream"],
      date: "2025-05-10",
      time: "10:00", 
      duration: "60 min",
      totalAmount: 195,
      status: "confirmed" 
    },
    { 
      id: 2, 
      customerName: "David Brown", 
      customerPhone: "+994 55 876 5432",
      services: ["Hair Styling", "Manicure"], 
      products: [],
      date: "2025-05-10",
      time: "11:30", 
      duration: "75 min",
      totalAmount: 130,
      status: "pending" 
    },
    { 
      id: 3, 
      customerName: "Maria Garcia", 
      customerPhone: "+994 70 345 6789",
      services: ["Massage Therapy"], 
      products: ["Massage Oil"],
      date: "2025-05-10",
      time: "13:00", 
      duration: "45 min",
      totalAmount: 162,
      status: "confirmed" 
    },
    { 
      id: 4, 
      customerName: "John Smith", 
      customerPhone: "+994 77 987 6543",
      services: ["Makeup Application"], 
      products: ["Luxury Makeup Palette"],
      date: "2025-05-10",
      time: "15:30", 
      duration: "60 min",
      totalAmount: 175,
      status: "rejected" 
    },
    { 
      id: 5, 
      customerName: "Sarah Williams", 
      customerPhone: "+994 50 444 5555",
      services: ["Hair Treatment", "Manicure"], 
      products: ["Hair Care Kit"],
      date: "2025-05-11",
      time: "09:30", 
      duration: "90 min",
      totalAmount: 205,
      status: "pending" 
    },
  ];
  
  // Filter appointments for selected date
  const selectedDate = date ? date.toISOString().split('T')[0] : '';
  const filteredAppointments = appointments.filter(appointment => appointment.date === selectedDate);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Select Date
          </h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>
        
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-medium mb-4">Appointments for {date?.toLocaleDateString()}</h3>
          
          {filteredAppointments.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {appointment.time}
                          </div>
                          <span className="text-xs text-muted-foreground">{appointment.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-muted-foreground" />
                            {appointment.customerName}
                          </div>
                          <span className="text-xs text-muted-foreground">{appointment.customerPhone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {appointment.services.map((service, index) => (
                            <span key={index} className="text-xs bg-glamour-100 text-glamour-800 px-2 py-1 rounded-full">
                              {service}
                            </span>
                          ))}
                          {appointment.products.length > 0 && appointment.products.map((product, index) => (
                            <span key={`p-${index}`} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {product}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">${appointment.totalAmount}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {appointment.status !== 'pending' && (
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No appointments scheduled for this date
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsTab;
