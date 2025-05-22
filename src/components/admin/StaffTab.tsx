
// Import necessary dependencies and hooks
import React, { useState, useEffect } from "react";
import { useStaff } from "@/hooks/use-staff";
import { Staff } from "@/models/staff.model";
import { toast } from "@/components/ui/use-toast";

const StaffTab: React.FC = () => {
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { 
    staff,
    isLoading,
    error,
    fetchStaff,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember
  } = useStaff();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Fix line 171:31 error - convert number to string when calling deleteStaffMember
  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      const result = await deleteStaffMember(id.toString());
      if (result) {
        toast({
          title: "Staff deleted",
          description: "Staff member has been deleted successfully"
        });
      }
    }
  };

  // Fix line 319:52 - convert string to number or use as string
  const handleEditClick = (id: string | number) => {
    const staffId = typeof id === 'string' ? id : id.toString();
    setEditStaffId(staffId);
    setShowEditModal(true);
  };

  // Fix line 406:58 - convert string to number or use as string  
  const handleDetailsClick = (id: string | number) => {
    const staffId = typeof id === 'string' ? id : id.toString();
    setSelectedStaffId(staffId);
    setShowDetailsModal(true);
  };
  
  // Render staff tab contents
  // This is a placeholder implementation - replace with your actual implementation
  return (
    <div>
      <h1>Staff Management</h1>
      {isLoading ? (
        <p>Loading staff data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {/* Staff list and actions */}
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.position}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>
                    <button 
                      onClick={() => handleDetailsClick(member.id)}
                      className="mr-2"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => handleEditClick(member.id)}
                      className="mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffTab;
