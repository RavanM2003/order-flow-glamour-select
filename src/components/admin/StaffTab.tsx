// Import necessary dependencies and hooks
import { useEffect } from "react";
import { useStaff } from "@/hooks/use-staff";
import { toast } from "@/components/ui/use-toast";
import { Staff } from "@/models/staff.model";

const StaffTable = ({
  staff,
  onDelete,
}: {
  staff: Staff[];
  onDelete: (id: string | number) => void;
}) => (
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
            <button className="mr-2">Details</button>
            <button className="mr-2">Edit</button>
            <button
              onClick={() => onDelete(member.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const StaffTab: React.FC = () => {
  const { staff, isLoading, error, fetchStaff, deleteStaffMember } = useStaff();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleDelete = async (id: string | number) => {
    const result = await deleteStaffMember(id.toString());
    if (result) {
      toast({
        title: "Staff deleted",
        description: "Staff member has been deleted successfully",
      });
    }
  };

  return (
    <div>
      <h1>Staff Management</h1>
      {isLoading ? (
        <p>Loading staff data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <StaffTable staff={staff} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default StaffTab;
