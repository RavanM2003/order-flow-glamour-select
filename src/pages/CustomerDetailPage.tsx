
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Clock,
  UserCircle,
  Calendar,
  Package,
  DollarSign,
  ChevronDown,
  Search,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Customer, CustomerFormData } from "@/models/customer.model";
import { Appointment } from "@/models/appointment.model";
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";
import { customerService, appointmentService } from "@/services";

// Add prop type
type CustomerDetailPageProps = {
  customer?: Customer;
};

const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  customer: customerProp,
}) => {
  const { customerId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(
    customerProp || null
  );
  const [editForm, setEditForm] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // If we have a customer prop, use it, otherwise fetch from API
    const initCustomer = async () => {
      if (customerProp) {
        setCustomer(customerProp);
        setEditForm({
          name: customerProp.name,
          email: customerProp.email,
          phone: customerProp.phone,
          gender: customerProp.gender || "",
        });

        // Fetch appointments for this customer
        try {
          const response = await appointmentService.getByCustomerId(customerProp.id.toString());
          if (response.data) {
            setAppointments(response.data);
          }
        } catch (error) {
          console.error("Failed to load appointments:", error);
        }
      } else if (customerId) {
        try {
          const response = await customerService.getById(customerId);
          if (response.data) {
            setCustomer(response.data);
            setEditForm({
              name: response.data.name,
              email: response.data.email,
              phone: response.data.phone,
              gender: response.data.gender || "",
            });

            // Fetch appointments for this customer
            const appointmentsResponse = await appointmentService.getByCustomerId(customerId);
            if (appointmentsResponse.data) {
              setAppointments(appointmentsResponse.data);
            }
          }
        } catch (error) {
          console.error("Failed to load customer:", error);
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
      if (customer?.id) {
        const response = await customerService.update(customer.id, editForm);
        if (response.data) {
          setCustomer({ ...customer, ...response.data });
          toast({
            title: "Customer updated",
            description: "Customer information has been updated successfully",
          });
        }
      }
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast({
        title: "Update failed",
        description: "Failed to update customer information",
        variant: "destructive",
      });
    }
  };

  // Get gender-based icon color
  const getGenderColor = () => {
    if (!customer) return "text-gray-500";
    
    switch(customer.gender) {
      case "female": return "text-pink-500";
      case "male": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial_payment":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (app: Appointment) => {
    if (!app.total) return "N/A";

    if (app.amountPaid && app.amountPaid >= (app.total || 0)) return "Fully Paid";
    if (app.amountPaid && app.amountPaid > 0) return "Partially Paid";
    return "Unpaid";
  };

  const getPaymentStatusBadge = (app: Appointment) => {
    const status = getPaymentStatusText(app);
    let className = "";

    switch (status) {
      case "Fully Paid":
        className = getStatusBadgeColor("paid");
        break;
      case "Partially Paid":
        className = getStatusBadgeColor("partial_payment");
        break;
      case "Unpaid":
        className = getStatusBadgeColor("unpaid");
        break;
      default:
        className = getStatusBadgeColor("");
    }

    return <Badge className={className}>{status}</Badge>;
  };

  // Filter appointments based on search term (order reference)
  const filteredAppointments = appointments.filter(app => 
    (app.orderReference?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    ((`ORD-${app.id}`).toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  if (loading) {
    return <div className="p-4 text-center">Loading customer details...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          {!editMode ? (
            <div className="relative">
              {/* Compact customer info display */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <UserCircle className={`h-8 w-8 ${getGenderColor()}`} />
                  <div>
                    <h3 className="text-xl font-semibold">{customer?.name || "-"}</h3>
                    {customer?.id && (
                      <p className="text-xs text-gray-500">ID: {customer.id}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{customer?.phone || "-"}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{customer?.email || "-"}</p>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-2 flex justify-end mt-6">
                <Button
                  className="bg-glamour-700 hover:bg-glamour-800 text-white"
                  onClick={() => setEditMode(true)}
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <Input
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm({ ...editForm, gender: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="submit"
                  className="bg-glamour-700 hover:bg-glamour-800 text-white"
                >
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
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

          {/* Search by Order Reference */}
          <div className="mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by order reference..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            Total Appointments: {filteredAppointments.length}
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No appointments found matching your search" : "No appointments found for this customer"}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map((app) => (
                <Accordion
                  key={app.id}
                  type="single"
                  collapsible
                  className="border rounded-md"
                >
                  <AccordionItem value="details" className="border-none">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="font-mono bg-glamour-50 border-glamour-200"
                          >
                            {app.orderReference || `ORD-${app.id}`}
                          </Badge>
                          <Badge
                            className={getStatusBadgeColor(app.status)}
                          >
                            {app.status}
                          </Badge>
                          {getPaymentStatusBadge(app)}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 items-center text-gray-600 mt-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{app.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {app.startTime || app.time} - {app.endTime}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Duration:</span> {app.duration || "60"} min
                          </div>
                        </div>
                        
                        <div className="mt-1 flex gap-4">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="font-medium">${app.totalAmount || 0}</span>
                          </div>
                          {(app.remainingBalance > 0 ||
                            app.totalAmount > (app.amountPaid || 0)) && (
                            <div className="text-red-600">
                              <span className="font-medium">Balance:</span> $
                              {app.remainingBalance ||
                                app.totalAmount - (app.amountPaid || 0)}
                            </div>
                          )}
                        </div>
                      </div>

                      <AccordionTrigger className="py-0 flex-shrink-0">
                        <span className="sr-only">Toggle details</span>
                      </AccordionTrigger>
                    </div>

                    <AccordionContent className="px-4 pb-4 pt-0 border-t">
                      <div className="space-y-4 mt-2">
                        {/* Services section */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2">
                            Services
                          </h5>
                          <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                            {app.services && app.services.length > 0 ? (
                              app.services.map((service: Service, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center border-b last:border-b-0 pb-2 last:pb-0"
                                >
                                  <div>
                                    <div className="font-medium">
                                      {service.name}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {service.duration || "60"} min
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                      <UserCircle className="h-3 w-3 mr-1" />
                                      {app.serviceProviders?.find(
                                        (provider) => provider.serviceId === service.id
                                      )?.name || "No provider assigned"}
                                    </div>
                                  </div>
                                  <div className="font-medium">
                                    ${service.price}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">
                                    {app.service}
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {app.duration || "60"} min
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center mt-1">
                                    <UserCircle className="h-3 w-3 mr-1" />
                                    {app.staff?.[0] || "No provider assigned"}
                                  </div>
                                </div>
                                <div className="font-medium">
                                  ${app.servicePrice || app.price || 0}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Products section */}
                        {(app.products && app.products.length > 0) ||
                        (app.selectedProducts && app.selectedProducts.length > 0) ? (
                          <div>
                            <h5 className="text-sm font-semibold mb-2 flex items-center">
                              <Package className="h-4 w-4 mr-1" /> Products
                            </h5>
                            <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                              {(app.products || app.selectedProducts || []).map(
                                (product: Product | string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center border-b last:border-b-0 pb-2 last:pb-0"
                                  >
                                    <div>
                                      {typeof product === "string" ? (
                                        <div className="font-medium">{product}</div>
                                      ) : (
                                        <>
                                          <div className="font-medium">
                                            {product.name}
                                          </div>
                                          {product.quantity && (
                                            <div className="text-xs text-gray-500">
                                              Qty: {product.quantity}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                    {typeof product !== "string" && product.price && (
                                      <div className="font-medium">${product.price}</div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ) : null}

                        {/* Payment info */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" /> Payment
                            Information
                          </h5>
                          <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-md">
                            <div>
                              <span className="font-medium">
                                Payment Method:
                              </span>{" "}
                              {app.paymentMethod || "Cash"}
                            </div>
                            <div>
                              <span className="font-medium">
                                Total Amount:
                              </span>{" "}
                              ${app.totalAmount || 0}
                            </div>
                            <div>
                              <span className="font-medium">
                                Amount Paid:
                              </span>{" "}
                              ${app.amountPaid || 0}
                            </div>
                            {(app.remainingBalance > 0 ||
                              app.totalAmount > (app.amountPaid || 0)) && (
                              <div className="text-red-600">
                                <span className="font-medium">Balance:</span>{" "}
                                $
                                {app.remainingBalance ||
                                  app.totalAmount - (app.amountPaid || 0)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Order created:</span>{" "}
                          {app.createdAt || "N/A"}
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
