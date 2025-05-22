
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCustomers } from '@/hooks/use-customers';
import { Customer } from '@/models/customer.model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/format';

export function formatAppointmentDate(appointment: any): string {
  // Using created_at instead of createdAt
  return new Date(appointment.created_at).toLocaleDateString();
}

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        if (!id) return;
        
        // Fetch customer details
        // This is a placeholder - implement actual API call
        const mockCustomer: Customer = {
          id: id,
          name: "John Doe",
          email: "john@example.com",
          phone: "555-123-4567",
          gender: "male",
          lastVisit: new Date().toISOString(),
          totalSpent: 1250,
          full_name: "John Doe",
          created_at: new Date().toISOString(),
        };
        
        setCustomer(mockCustomer);
      } catch (err) {
        setError("Failed to load customer details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomerDetails();
  }, [id]);
  
  if (isLoading) return <div>Loading customer details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return <div>Customer not found</div>;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Name</h3>
            <p>{customer.full_name || customer.name}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Email</h3>
            <p>{customer.email}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Phone</h3>
            <p>{customer.phone}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Gender</h3>
            <p className="capitalize">{customer.gender || 'Not specified'}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Last Visit</h3>
            <p>{customer.lastVisit ? formatDate(customer.lastVisit) : 'Never'}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Customer Since</h3>
            <p>{customer.created_at ? formatDate(customer.created_at) : 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Add more sections here like appointment history, purchase history, etc. */}
    </div>
  );
};

export default CustomerDetailPage;
