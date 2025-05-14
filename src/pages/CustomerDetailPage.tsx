
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pencil, Eye, Clock, UserCircle, Calendar, Package, DollarSign } from 'lucide-react';
import { API } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Add prop type
type CustomerDetailPageProps = {
  customer?: { id: number; name: string; email: string; phone: string; gender?: string };
};

const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ customer: customerProp }) => {
  const { customerId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [customer, setCustomer] = useState(customerProp || { id: 0, name: '', email: '', phone: '', gender: '' });
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', gender: '' });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a customer prop, use it, otherwise fetch from API
    const initCustomer = async () => {
      if (customerProp) {
        setCustomer(customerProp);
        setEditForm({ 
          name: customerProp.name, 
          email: customerProp.email, 
          phone: customerProp.phone,
          gender: customerProp.gender || ''
        });
        
        // Fetch appointments for this customer
        try {
          const { data } = await API.appointments.getByCustomer(customerProp.id);
          setAppointments(data || []);
        } catch (error) {
          console.error('Failed to load appointments:', error);
        }
        
      } else if (customerId) {
        try {
          const { data } = await API.customers.get(customerId);
          if (data) {
            setCustomer(data);
            setEditForm({ 
              name: data.name, 
              email: data.email, 
              phone: data.phone,
              gender: data.gender || ''
            });
            
            // Fetch appointments for this customer
            const appointmentsResponse = await API.appointments.getByCustomer(customerId);
            setAppointments(appointmentsResponse.data || []);
          }
        } catch (error) {
          console.error('Failed to load customer:', error);
        }
      }
      setLoading(false);
    };
    
    initCustomer();
  }, [customerProp, customerId]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  
  const handleEditSave = async () => {
    try {
      if (customer.id) {
        const { data } = await API.customers.update(customer.id, editForm);
        if (data) {
          setCustomer({ ...customer, ...editForm });
          toast({
            title: "Customer updated",
            description: "Customer information has been updated successfully"
          });
        }
      }
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast({
        title: "Update failed",
        description: "Failed to update customer information",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading customer details...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          {!editMode ? (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium w-24">Name:</span>
                  <span className="flex-1 text-right">{customer.name || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium w-24">Email:</span>
                  <span className="flex-1 text-right">{customer.email || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium w-24">Phone:</span>
                  <span className="flex-1 text-right">{customer.phone || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium w-24">Gender:</span>
                  <span className="flex items-center justify-end flex-1">
                    {customer.gender === 'female' && <UserCircle className="h-4 w-4 mr-1 text-pink-500" />}
                    {customer.gender === 'male' && <UserCircle className="h-4 w-4 mr-1 text-blue-500" />}
                    {customer.gender || '-'}
                  </span>
                </div>
                <div className="sm:col-span-2 flex justify-end mt-4">
                  <Button className="bg-glamour-700 hover:bg-glamour-800 text-white" onClick={() => setEditMode(true)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input name="name" value={editForm.name} onChange={handleEditChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input name="email" value={editForm.email} onChange={handleEditChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <Input name="phone" value={editForm.phone} onChange={handleEditChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select 
                  name="gender" 
                  value={editForm.gender} 
                  onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800 text-white">Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-glamour-800">Appointments</h3>
          </div>
          
          <div className="mb-4 text-sm text-gray-600">Total Appointments: {appointments.length}</div>
          
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No appointments found for this customer</div>
          ) : (
            <div className="space-y-6">
              {appointments.map(app => (
                <Accordion key={app.id} type="single" collapsible className="border rounded-md">
                  <AccordionItem value="details" className="border-none">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center">
                          <h4 className="text-lg font-semibold">{app.service}</h4>
                          <Badge className={`ml-2 ${getStatusBadgeColor(app.status)}`}>
                            {app.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{app.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{app.startTime} - {app.endTime}</span>
                        </div>
                      </div>
                      
                      <AccordionTrigger className="py-0 flex-shrink-0">
                        <span className="sr-only">Toggle details</span>
                      </AccordionTrigger>
                    </div>
                    
                    <AccordionContent className="px-4 pb-4 pt-0 border-t">
                      <div className="space-y-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-semibold mb-1 flex items-center">
                              <UserCircle className="h-4 w-4 mr-1" /> Staff
                            </h5>
                            <div className="text-sm">{app.staff?.join(', ') || '-'}</div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-semibold mb-1 flex items-center">
                              <Package className="h-4 w-4 mr-1" /> Products Used
                            </h5>
                            <div className="text-sm">{app.products?.join(', ') || 'No products'}</div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-semibold mb-1 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" /> Payment
                            </h5>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="font-medium">Total:</span> ${app.totalAmount || 0}
                              </div>
                              <div>
                                <span className="font-medium">Paid:</span> ${app.amountPaid || 0}
                              </div>
                              {(app.remainingBalance > 0) && (
                                <div className="text-red-600">
                                  <span className="font-medium">Balance:</span> ${app.remainingBalance}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Reference ID:</span> {app.id}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailPage;
