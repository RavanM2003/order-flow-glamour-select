
// StaffTab.tsx file - update the specific lines that are causing errors:

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
