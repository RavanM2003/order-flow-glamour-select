import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Eye } from 'lucide-react';

const mockCustomer = {
  id: 1,
  name: 'Customer 1',
  email: 'customer1@example.com',
  phone: '+994 50 123 45 67',
};

const mockAppointments = [
  {
    id: 1,
    date: '2024-06-10',
    service: 'Facial Treatment',
    staff: ['Aysel Məmmədova'],
    products: ['Moisturizer Cream', 'Anti-Aging Serum'],
  },
  {
    id: 2,
    date: '2024-06-15',
    service: 'Hair Styling',
    staff: ['Elvin Əliyev'],
    products: ['Hair Care Kit'],
  },
];

// Add prop type
type CustomerDetailPageProps = {
  customer?: { id: number; name: string; email: string; phone: string };
};

const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ customer: customerProp }) => {
  const { customerId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [customer, setCustomer] = useState(customerProp || mockCustomer);
  const [editForm, setEditForm] = useState({ name: customer.name, email: customer.email, phone: customer.phone });
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showAdd, setShowAdd] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ date: '', service: '', staff: '', products: '' });

  React.useEffect(() => {
    if (customerProp) {
      setCustomer(customerProp);
      setEditForm({ name: customerProp.name, email: customerProp.email, phone: customerProp.phone });
    }
  }, [customerProp]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = () => {
    setCustomer({ ...customer, ...editForm });
    setEditMode(false);
  };
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointments([
      ...appointments,
      {
        id: appointments.length + 1,
        date: newAppointment.date,
        service: newAppointment.service,
        staff: newAppointment.staff.split(',').map(s => s.trim()),
        products: newAppointment.products.split(',').map(p => p.trim()),
      },
    ]);
    setShowAdd(false);
    setNewAppointment({ date: '', service: '', staff: '', products: '' });
  };

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          {!editMode ? (
            <div className="relative">
              <div className="space-y-2">
                <div><span className="font-semibold">Name:</span> {customer.name}</div>
                <div><span className="font-semibold">Email:</span> {customer.email}</div>
                <div><span className="font-semibold">Phone:</span> {customer.phone}</div>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="bg-glamour-700 hover:bg-glamour-800 text-white" onClick={() => setEditMode(true)}>
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Button>
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
            <Button className="bg-glamour-700 hover:bg-glamour-800 text-white" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Appointment
            </Button>
          </div>
          <div className="mb-4 text-sm text-gray-600">Total Orders: {appointments.length}</div>
          <div className="space-y-4">
            {appointments.map(app => (
              <div key={app.id} className="border rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div><span className="font-semibold">Date:</span> {app.date}</div>
                  <div><span className="font-semibold">Service:</span> {app.service}</div>
                  <div><span className="font-semibold">Staff:</span> {app.staff.join(', ')}</div>
                  <div><span className="font-semibold">Products:</span> {app.products.join(', ')}</div>
                </div>
                <a href={`/booking-details/${app.id}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="mt-2 md:mt-0">
                    <Eye className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowAdd(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-glamour-800">Add Appointment</h2>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Date</label>
                <Input name="date" type="date" value={newAppointment.date} onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Service</label>
                <Input name="service" value={newAppointment.service} onChange={e => setNewAppointment({ ...newAppointment, service: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Staff (comma separated)</label>
                <Input name="staff" value={newAppointment.staff} onChange={e => setNewAppointment({ ...newAppointment, staff: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Products (comma separated)</label>
                <Input name="products" value={newAppointment.products} onChange={e => setNewAppointment({ ...newAppointment, products: e.target.value })} required />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800">Add</Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage; 