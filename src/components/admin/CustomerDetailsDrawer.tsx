
import { Customer } from "@/models/customer.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";

interface CustomerDetailsDrawerProps {
  customer: Customer;
}

const CustomerDetailsDrawer = ({ customer }: CustomerDetailsDrawerProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-sm">{customer.full_name || customer.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm">{customer.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-sm">{customer.phone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-sm capitalize">{customer.gender || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Birth Date</label>
              <p className="text-sm">
                {customer.birth_date ? formatDate(customer.birth_date) : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge variant={(customer.user_id || customer.id) ? "default" : "outline"}>
                {(customer.user_id || customer.id) ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          {customer.note && (
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{customer.note}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-gray-500">Last Visit</label>
              <p className="text-sm">
                {customer.lastVisit ? formatDate(customer.lastVisit) : "Never"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Spent</label>
              <p className="text-sm font-medium">${customer.totalSpent || 0}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-sm">
                {customer.created_at ? formatDate(customer.created_at) : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailsDrawer;
