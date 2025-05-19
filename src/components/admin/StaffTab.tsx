
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Percent,
  Scissors,
  CalendarPlus,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DetailDrawer from "@/components/common/DetailDrawer";
import MultiSelect from "@/components/common/MultiSelect";
import { useToast } from "@/hooks/use-toast";
import { useRoles } from "@/hooks/use-roles";
import { useStaff } from "@/hooks/use-staff";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

const StaffTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);
  const { roles } = useRoles();
  const { 
    staff, 
    isLoading,
    error,
    fetchStaff,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember 
  } = useStaff();

  // Available roles and services for dropdowns
  const staffPositions = ["Usta", "Stilist", "Administrator", "Manager", "Assistant"];
  const availableServices = [
    "Facial Treatment",
    "Haircut",
    "Manicure",
    "Pedicure",
    "Massage",
    "Hair Styling",
    "Hair Coloring",
    "Eyebrow Shaping",
    "Makeup",
  ];

  // Form state
  const [staffForm, setStaffForm] = useState({
    name: "",
    position: staffPositions[0],
    phone: "",
    email: "",
    specializations: [],
    salary: 0,
    commissionRate: 0,
    role_id: 2, // Default to admin role
  });

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Filter staff based on search term
  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.position && s.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate staff
  const totalPages = Math.ceil(filteredStaff.length / pageSize);
  const currentStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.phone) {
      setFormError("Tam ad və telefon vacibdir");
      return;
    }

    try {
      if (editMode && selected) {
        await updateStaffMember(selected.id, {
          name: staffForm.name,
          position: staffForm.position,
          specializations: staffForm.specializations,
          email: staffForm.email,
          phone: staffForm.phone,
          salary: staffForm.salary,
          commissionRate: staffForm.commissionRate,
          role_id: staffForm.role_id,
        });
      } else {
        await createStaffMember({
          name: staffForm.name,
          position: staffForm.position,
          specializations: staffForm.specializations,
          email: staffForm.email,
          phone: staffForm.phone,
          salary: staffForm.salary,
          commissionRate: staffForm.commissionRate,
          role_id: staffForm.role_id,
        });
      }
      
      setDrawerOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving staff:", error);
      setFormError("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    }
  };

  // Handle edit button click
  const handleEdit = (staff) => {
    setSelected(staff);
    setStaffForm({
      name: staff.name,
      position: staff.position || staffPositions[0],
      phone: staff.phone || "",
      email: staff.email || "",
      specializations: staff.specializations || [],
      salary: staff.salary || 0,
      commissionRate: staff.commissionRate || 0,
      role_id: staff.role_id || 2,
    });
    setEditMode(true);
    setDrawerOpen(true);
  };

  const handleDeleteStaff = (id: number) => {
    setStaffToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStaff = async () => {
    if (staffToDelete) {
      await deleteStaffMember(staffToDelete);
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  const cancelDeleteStaff = () => {
    setDeleteDialogOpen(false);
    setStaffToDelete(null);
  };

  const resetForm = () => {
    setStaffForm({
      name: "",
      position: staffPositions[0],
      phone: "",
      email: "",
      specializations: [],
      salary: 0,
      commissionRate: 0,
      role_id: 2,
    });
    setFormError("");
    setEditMode(false);
    setSelected(null);
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glamour-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading staff: {error}</p>
        <Button onClick={fetchStaff} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-glamour-800">
            Staff Management
          </h2>
          <Button
            className="bg-glamour-700 hover:bg-glamour-800 text-white w-full sm:w-auto"
            onClick={() => {
              setDrawerOpen(true);
              resetForm();
            }}
          >
            <CalendarPlus className="w-4 h-4 mr-2" /> Add Staff
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search staff..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile view - Cards */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {currentStaff.map((s) => (
            <div 
              key={s.id} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{s.name}</h3>
                <Badge variant="outline" className="capitalize">
                  {s.position || "Staff"}
                </Badge>
              </div>
              
              <div className="text-sm mb-2">
                {s.email && <p className="text-gray-600">{s.email}</p>}
                {s.phone && <p className="text-gray-600">{s.phone}</p>}
              </div>
              
              {s.role_id && (
                <div className="mb-2">
                  <Badge variant="secondary" className="capitalize">
                    <UserCog className="w-3 h-3 mr-1" />
                    {getRoleName(s.role_id)}
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                {s.salary > 0 && (
                  <span className="flex items-center text-sm bg-blue-50 px-2 py-1 rounded">
                    <DollarSign className="h-3 w-3 mr-1 text-blue-600" />
                    {s.salary}₼
                  </span>
                )}
                {s.commissionRate > 0 && (
                  <span className="flex items-center text-sm bg-green-50 px-2 py-1 rounded">
                    <Percent className="h-3 w-3 mr-1 text-green-600" />
                    {s.commissionRate}%
                  </span>
                )}
              </div>
              
              {s.specializations && s.specializations.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {s.specializations.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Scissors className="h-2 w-2 mr-1" />
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleEdit(s)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteStaff(s.id)}
                >
                  <Trash className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view - Table */}
        <div className="hidden lg:block border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStaff.map((s) => (
                <TableRow key={s.id} className="hover:bg-blue-50">
                  <TableCell>{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.position || "-"}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {s.email && <div>{s.email}</div>}
                      {s.phone && <div className="text-muted-foreground">{s.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.role_id && (
                      <Badge variant="secondary" className="capitalize">
                        {getRoleName(s.role_id)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {s.salary > 0 && (
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                          {s.salary}₼
                        </span>
                      )}
                      {s.commissionRate > 0 && (
                        <span className="flex items-center">
                          <Percent className="h-4 w-4 mr-1 text-green-600" />
                          {s.commissionRate}%
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.specializations && s.specializations.map((service, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center"
                        >
                          <Scissors className="h-3 w-3 mr-1" />
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(s)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteStaff(s.id)}
                        aria-label="Sil"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredStaff.length)} of{" "}
            {filteredStaff.length} entries
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Staff Form Drawer */}
      <DetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editMode ? "Düzəliş et" : "Əlavə et"}
      >
        <form className="space-y-4 p-2" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">
              Tam Adı <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={staffForm.name}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Xidmət növü</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={staffForm.position}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, position: e.target.value }))
              }
            >
              {staffPositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={staffForm.email}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">
              Telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2"
              value={staffForm.phone}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, phone: e.target.value }))
              }
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Sistem rolu</label>
            <Select
              value={staffForm.role_id.toString()}
              onValueChange={(value) =>
                setStaffForm((f) => ({ ...f, role_id: Number(value) }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Əmək haqqı və faiz</label>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <input
                  type="number"
                  min={0}
                  max={5000}
                  value={staffForm.salary}
                  onChange={(e) =>
                    setStaffForm((f) => ({
                      ...f,
                      salary: Number(e.target.value),
                    }))
                  }
                  placeholder="Minimum maaş"
                  className="w-24 border rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-green-600" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={staffForm.commissionRate}
                  onChange={(e) =>
                    setStaffForm((f) => ({
                      ...f,
                      commissionRate: Number(e.target.value),
                    }))
                  }
                  placeholder="Faiz"
                  className="w-16 border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Servislər</label>
            <MultiSelect
              options={availableServices.map((s) => ({ value: s, label: s }))}
              value={staffForm.specializations}
              onChange={(vals) =>
                setStaffForm((f) => ({ ...f, specializations: vals }))
              }
              placeholder="Servis seçin..."
            />
          </div>
          
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          
          <Button type="submit" className="bg-glamour-700 text-white w-full">
            {editMode ? "Yadda saxla" : "Əlavə et"}
          </Button>
        </form>
      </DetailDrawer>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>İşçini silmək istədiyinizə əminsiniz?</DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Bu əməliyyat geri qaytarıla bilməz. İşçi silinəcək.
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelDeleteStaff}>
              Ləğv et
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteStaff}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffTab;
