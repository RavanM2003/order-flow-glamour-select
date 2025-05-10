
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ChevronRight, Settings, Users } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("services");
  
  const services = [
    { id: 1, name: "Facial Treatment", price: 150, duration: "60 min" },
    { id: 2, name: "Massage Therapy", price: 120, duration: "45 min" },
    { id: 3, name: "Manicure", price: 50, duration: "30 min" },
    { id: 4, name: "Hair Styling", price: 80, duration: "45 min" },
    { id: 5, name: "Makeup Application", price: 90, duration: "60 min" }
  ];
  
  const customers = [
    { id: 1, name: "Anna Johnson", email: "anna@example.com", phone: "+994 50 123 4567" },
    { id: 2, name: "Melissa Smith", email: "melissa@example.com", phone: "+994 55 987 6543" },
    { id: 3, name: "David Brown", email: "david@example.com", phone: "+994 70 456 7890" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-2xl text-glamour-800">Glamour Studio Admin</div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <a href="/">Back to Website</a>
            </Button>
            <Button variant="outline">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
            <Button className="bg-glamour-700 hover:bg-glamour-800">
              <Users size={16} className="mr-2" />
              Staff
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>
              <TabsContent value="services" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Services Management</h3>
                  <Button className="bg-glamour-700 hover:bg-glamour-800">Add New Service</Button>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Service Name</th>
                        <th className="py-3 px-4 text-left">Duration</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id} className="border-t">
                          <td className="py-3 px-4">{service.id}</td>
                          <td className="py-3 px-4">{service.name}</td>
                          <td className="py-3 px-4">{service.duration}</td>
                          <td className="py-3 px-4 text-right">${service.price}</td>
                          <td className="py-3 px-4 flex justify-center gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="customers" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Customer Management</h3>
                  <Button className="bg-glamour-700 hover:bg-glamour-800">Add New Customer</Button>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Phone</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-t">
                          <td className="py-3 px-4">{customer.id}</td>
                          <td className="py-3 px-4">{customer.name}</td>
                          <td className="py-3 px-4">{customer.email}</td>
                          <td className="py-3 px-4">{customer.phone}</td>
                          <td className="py-3 px-4 flex justify-center gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="appointments" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Upcoming Appointments</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Search..." className="w-64" />
                    <Button className="bg-glamour-700 hover:bg-glamour-800">New Appointment</Button>
                  </div>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  No appointments scheduled
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
