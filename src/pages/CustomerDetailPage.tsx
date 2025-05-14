
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Pencil, 
  Eye, 
  Clock, 
  UserCircle, 
  Calendar, 
  Package, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { API } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>({});

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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const toggleServiceDetails = (appointmentId: number) => {
    setExpandedServices({
      ...expandedServices,
      [appointmentId]: !expandedServices[appointmentId]
    });
  };

  const formatPaymentStatus = (app: any) => {
    if (!app.totalAmount) return 'No payment info';
    
    if (app.amountPaid >= app.totalAmount) {
      return 'Fully Paid';
    } else if (app.amountPaid > 0) {
      return 'Partially Paid';
    } else {
      return 'Unpaid';
    }
  };

  const getPaymentStatusColor = (app: any) => {
    if (!app.totalAmount) return 'text-gray-600';
    
    if (app.amountPaid >= app.totalAmount) {
      return 'text-green-600';
    } else if (app.amountPaid > 0) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
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
            <div className="space-y-4">
              {appointments.map(app => (
                <Accordion key={app.id} type="single" collapsible className="border rounded-md">
                  <AccordionItem value="details" className="border-none">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <Badge className={`${getStatusBadgeColor(app.status)}`}>
                            {app.status}
                          </Badge>
                          <span className="font-mono text-sm text-glamour-700 ml-2">
                            {app.orderId || `ORD-${app.id}`}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-2 gap-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{app.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{app.startTime} - {app.endTime}</span>
                          </div>
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
                            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                              <UserCircle className="h-4 w-4" />
                              Payment Details
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="text-sm">
                                <div className="flex justify-between mb-1">
                                  <span>Method:</span>
                                  <span className="font-medium">{app.paymentMethod || 'Cash'}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                  <span>Total:</span>
                                  <span className="font-medium">${app.totalAmount || 0}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                  <span>Paid:</span>
                                  <span className="font-medium">${app.amountPaid || 0}</span>
                                </div>
                                {(app.totalAmount && app.totalAmount > (app.amountPaid || 0)) && (
                                  <div className="flex justify-between text-red-600">
                                    <span>Balance:</span>
                                    <span className="font-medium">${(app.totalAmount - (app.amountPaid || 0)).toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <span>Status:</span>
                                    <span className={`font-medium ${getPaymentStatusColor(app)}`}>
                                      {formatPaymentStatus(app)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                              <Package className="h-4 w-4" />
                              Services & Products
                            </div>
                            
                            <Collapsible 
                              open={expandedServices[app.id] || false}
                              onOpenChange={() => toggleServiceDetails(app.id)}
                              className="bg-gray-50 rounded-md p-3"
                            >
                              <div className="flex justify-between items-center">
                                <div className="text-sm">
                                  <span className="font-medium">{app.service || 'Multiple Services'}</span>
                                  <span className="text-gray-500 ml-2">
                                    (${app.totalAmount || 0})
                                  </span>
                                </div>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                              
                              <CollapsibleContent className="mt-3 pt-3 border-t border-gray-200">
                                {app.services?.length > 0 ? (
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-500">SERVICES</h4>
                                    {app.services.map((service: any, idx: number) => (
                                      <div key={idx} className="flex justify-between items-center text-sm">
                                        <div>
                                          <div className="font-medium">{service.name}</div>
                                          {app.serviceProviders && app.serviceProviders.find((sp: any) => sp.serviceId === service.id) && (
                                            <div className="text-xs text-gray-500">
                                              Staff: {app.serviceProviders.find((sp: any) => sp.serviceId === service.id).name}
                                            </div>
                                          )}
                                        </div>
                                        <div className="font-medium">${service.price}</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  app.service && (
                                    <div className="flex justify-between items-center text-sm">
                                      <div>
                                        <div className="font-medium">{app.service}</div>
                                        {app.staff && <div className="text-xs text-gray-500">Staff: {app.staff}</div>}
                                      </div>
                                      <div className="font-medium">${app.totalAmount || 0}</div>
                                    </div>
                                  )
                                )}
                                
                                {app.products && app.products.length > 0 && (
                                  <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-500">PRODUCTS</h4>
                                    {app.products.map((product: any, idx: number) => (
                                      <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="font-medium">{product}</div>
                                        <div className="font-medium">
                                          {app.productQuantities && app.productQuantities[idx] > 1 && 
                                            `${app.productQuantities[idx]}x `}
                                          ${app.productPrices ? app.productPrices[idx] : ''}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Reference:</span> {app.orderId || `ORD-${app.id}`}
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
