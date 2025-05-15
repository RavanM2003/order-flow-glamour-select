import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DetailDrawer from "@/components/common/DetailDrawer";
import MultiSelect from "@/components/common/MultiSelect";
import { useToast } from "@/hooks/use-toast";

// Define Staff type
type Staff = {
  id: number;
  fullname: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  minSalary: number;
  commissionPercent: number;
  services: string[];
};

// Mock data for staff
const initialStaff: Staff[] = [
  {
    id: 1,
    fullname: "John Doe",
    role: "Usta",
    phone: "1234567890",
    email: "john@example.com",
    address: "123 Main St",
    minSalary: 2000,
    commissionPercent: 0,
    services: ["Facial Treatment", "Haircut"],
  },
  {
    id: 2,
    fullname: "Jane Smith",
    role: "Stilist",
    phone: "0987654321",
    email: "jane@example.com",
    address: "456 Oak St",
    minSalary: 0,
    commissionPercent: 30,
    services: ["Manicure", "Pedicure"],
  },
  {
    id: 3,
    fullname: "Ali Veli",
    role: "Administrator",
    phone: "0551234567",
    email: "ali@glamour.az",
    address: "789 Elm St",
    minSalary: 1000,
    commissionPercent: 10,
    services: ["Massage"],
  },
];

// Available roles and services for dropdowns
const roles = ["Usta", "Stilist", "Administrator"];
const availableServices = [
  "Facial Treatment",
  "Haircut",
  "Manicure",
  "Pedicure",
  "Massage",
];

const StaffTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Staff | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast, dismiss } = useToast();

  // Form state
  const [staffForm, setStaffForm] = useState<Omit<Staff, "id">>({
    fullname: "",
    role: roles[0],
    phone: "",
    email: "",
    address: "",
    minSalary: 0,
    commissionPercent: 0,
    services: [],
  });

  // Filter staff based on search term
  const filteredStaff = staff.filter(
    (s) =>
      s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate staff
  const totalPages = Math.ceil(filteredStaff.length / pageSize);
  const currentStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.fullname || !staffForm.phone) {
      setFormError("Tam ad və telefon vacibdir");
      return;
    }
    if (editMode && selected) {
      setStaff(
        staff.map((s) => (s.id === selected.id ? { ...s, ...staffForm } : s))
      );
      setEditMode(false);
      setSelected(null);
    } else {
      setStaff([{ id: staff.length + 1, ...staffForm }, ...staff]);
    }
    setDrawerOpen(false);
    setStaffForm({
      fullname: "",
      role: roles[0],
      phone: "",
      email: "",
      address: "",
      minSalary: 0,
      commissionPercent: 0,
      services: [],
    });
    setFormError("");
  };

  // Handle edit button click
  const handleEdit = (staff: Staff) => {
    setSelected(staff);
    setStaffForm({
      fullname: staff.fullname,
      role: staff.role,
      phone: staff.phone,
      email: staff.email,
      address: staff.address,
      minSalary: staff.minSalary,
      commissionPercent: staff.commissionPercent,
      services: staff.services,
    });
    setEditMode(true);
    setDrawerOpen(true);
  };

  const handleDeleteStaff = (id: number) => {
    toast({
      title: "Silmək istədiyinizə əminsiniz?",
      action: (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-red-600 text-white"
            onClick={() => {
              setStaff((staff) => staff.filter((s) => s.id !== id));
              dismiss();
            }}
          >
            Bəli, sil
          </Button>
          <Button size="sm" variant="outline" onClick={() => dismiss()}>
            Ləğv et
          </Button>
        </div>
      ),
      duration: 10000,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-glamour-800">
            Staff Management
          </h2>
          <Button
            className="bg-glamour-700 hover:bg-glamour-800 text-white"
            onClick={() => {
              setDrawerOpen(true);
              setEditMode(false);
              setSelected(null);
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

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStaff.map((s) => (
                <TableRow key={s.id} className="hover:bg-blue-50">
                  <TableCell>{s.id}</TableCell>
                  <TableCell className="font-medium">{s.fullname}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{s.email}</div>
                      <div className="text-muted-foreground">{s.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {s.minSalary > 0 && (
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                          {s.minSalary}₼
                        </span>
                      )}
                      {s.commissionPercent > 0 && (
                        <span className="flex items-center">
                          <Percent className="h-4 w-4 mr-1 text-green-600" />
                          {s.commissionPercent}%
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.services.map((service, index) => (
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredStaff.length)} of{" "}
            {filteredStaff.length} entries
          </div>
          <div className="flex gap-2">
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
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
              value={staffForm.fullname}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, fullname: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Xidmət növü</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={staffForm.role}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, role: e.target.value }))
              }
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={staffForm.email}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ünvan</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={staffForm.address}
              onChange={(e) =>
                setStaffForm((f) => ({ ...f, address: e.target.value }))
              }
            />
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
                  value={staffForm.minSalary}
                  onChange={(e) =>
                    setStaffForm((f) => ({
                      ...f,
                      minSalary: Number(e.target.value),
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
                  value={staffForm.commissionPercent}
                  onChange={(e) =>
                    setStaffForm((f) => ({
                      ...f,
                      commissionPercent: Number(e.target.value),
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
              value={staffForm.services}
              onChange={(vals) =>
                setStaffForm((f) => ({ ...f, services: vals }))
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
    </div>
  );
};

export default StaffTab;
