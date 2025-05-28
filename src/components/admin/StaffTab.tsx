
import { useEffect, useState } from "react";
import { useStaff } from "@/hooks/use-staff";
import { useEnhancedAdmin } from "@/hooks/use-enhanced-admin";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/models/staff.model";
import { Trash2, Edit, Eye, UserPlus } from "lucide-react";

const StaffTab: React.FC = () => {
  const { staff, isLoading, error, fetchStaff, deleteStaffMember } = useStaff();
  const { handleApiCall, userService } = useEnhancedAdmin();
  const [staffWithDetails, setStaffWithDetails] = useState<any[]>([]);

  useEffect(() => {
    fetchStaff();
    loadStaffWithDetails();
  }, [fetchStaff]);

  const loadStaffWithDetails = async () => {
    const result = await handleApiCall(() => userService.getStaff());
    if (result) {
      setStaffWithDetails(result);
    }
  };

  const handleDelete = async (id: string | number) => {
    const result = await deleteStaffMember(id.toString());
    if (result) {
      toast({
        title: "Staff deleted",
        description: "Staff member has been deleted successfully",
      });
      fetchStaff();
      loadStaffWithDetails();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">Loading staff data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-red-500 text-center">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  const displayStaff = staffWithDetails.length > 0 ? staffWithDetails : staff;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Staff Management</CardTitle>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!displayStaff || displayStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No staff members found
                  </TableCell>
                </TableRow>
              ) : (
                displayStaff.map((member: any) => (
                  <TableRow key={member.id || member.user_id}>
                    <TableCell className="font-medium">
                      {member.full_name || member.name || "N/A"}
                    </TableCell>
                    <TableCell>{member.position || member.staff?.position || "N/A"}</TableCell>
                    <TableCell>{member.email || "N/A"}</TableCell>
                    <TableCell>{member.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{member.role || "staff"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(member.id || member.user_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffTab;
