import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  CalendarPlus,
  Info,
  RefreshCcw,
  Edit,
  CheckCircle,
} from "lucide-react";
import DetailDrawer from "@/components/common/DetailDrawer";
import { OrderProvider } from "@/context/OrderContext";
import CheckoutFlow from "@/components/CheckoutFlow";
import { Input } from "@/components/ui/input";

interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  services: string[];
  products: string[];
  date: string;
  time: string;
  duration: string;
  totalAmount: number;
  status: string;
  executors: Record<string, number>;
  rejectReason: string;
  paymentMethod?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500">Confirmed</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-500">Rejected</Badge>;
    case "completed":
      return <Badge className="bg-blue-500">Completed</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const AppointmentTableRow = ({
  appointment,
  onAccept,
  onReject,
  onEdit,
  onMarkCompleted,
  onView,
  onRepeat,
}) => (
  <TableRow>
    <TableCell className="font-medium">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          {appointment.time}
        </div>
        <span className="text-xs text-muted-foreground">
          {appointment.duration}
        </span>
      </div>
    </TableCell>
    <TableCell>
      <div className="flex flex-col">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1 text-muted-foreground" />
          {appointment.customerName}
        </div>
        <span className="text-xs text-muted-foreground">
          {appointment.customerPhone}
        </span>
      </div>
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <div className="flex flex-wrap gap-1">
        {appointment.services.map((service, index) => (
          <span
            key={index}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
          >
            {service}
          </span>
        ))}
        {appointment.products.map((product, index) => (
          <span
            key={`p-${index}`}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
          >
            {product}
          </span>
        ))}
      </div>
    </TableCell>
    <TableCell className="text-right hidden md:table-cell font-medium">
      ${appointment.totalAmount}
    </TableCell>
    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
    <TableCell>
      <div className="flex justify-center gap-2">
        {appointment.status === "pending" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
              onClick={() => onAccept(appointment)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
              onClick={() => onReject(appointment)}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        {appointment.status === "confirmed" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="p-1 text-blue-600 hover:text-blue-700"
              onClick={() => onEdit(appointment)}
            >
              <Edit className="h-4 w-4 mr-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-1 text-green-600 hover:text-green-700"
              onClick={() => onMarkCompleted(appointment)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
            </Button>
          </div>
        )}
        {(appointment.status === "completed" ||
          appointment.status === "rejected") && (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => onView(appointment)}
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
              onClick={() => onRepeat(appointment)}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </TableCell>
  </TableRow>
);

const AppointmentsTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Time</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead className="hidden md:table-cell">
        Services and Products
      </TableHead>
      <TableHead className="text-right hidden md:table-cell">Total</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-center">Actions</TableHead>
    </TableRow>
  </TableHeader>
);

const AppointmentsTable = ({
  appointments,
  onAccept,
  onReject,
  onEdit,
  onMarkCompleted,
  onView,
  onRepeat,
}) => (
  <div className="border rounded-md overflow-auto">
    <Table>
      <AppointmentsTableHeader />
      <TableBody>
        {appointments.map((appointment) => (
          <AppointmentTableRow
            key={appointment.id}
            appointment={appointment}
            onAccept={onAccept}
            onReject={onReject}
            onEdit={onEdit}
            onMarkCompleted={onMarkCompleted}
            onView={onView}
            onRepeat={onRepeat}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

// Add these component definitions before the AppointmentsTab component
const EditCustomerSection = ({ editForm, setEditForm, isEditing, onSave }) => (
  <div className="border rounded-md p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold">Customer Information</h3>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onSave}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
    {isEditing ? (
      <div className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-xs mb-1">
            Name
          </label>
          <Input
            id="customerName"
            value={editForm.customerName}
            onChange={(e) =>
              setEditForm({ ...editForm, customerName: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="customerPhone" className="block text-xs mb-1">
            Phone
          </label>
          <Input
            id="customerPhone"
            value={editForm.customerPhone}
            onChange={(e) =>
              setEditForm({ ...editForm, customerPhone: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    ) : (
      <div>
        <div>{editForm.customerName}</div>
        <div className="text-sm text-muted-foreground">
          {editForm.customerPhone}
        </div>
      </div>
    )}
  </div>
);

const EditServicesSection = ({
  editForm,
  setEditForm,
  isEditing,
  onSave,
  serviceSearch,
  setServiceSearch,
  filteredServices,
}) => (
  <div className="border rounded-md p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold">Services</h3>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onSave}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
    {isEditing ? (
      <div className="space-y-4">
        <Input
          placeholder="Search services..."
          value={serviceSearch}
          onChange={(e) => setServiceSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-40 overflow-y-auto">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between py-1"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.services.includes(service.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEditForm({
                        ...editForm,
                        services: [...editForm.services, service.id],
                      });
                    } else {
                      setEditForm({
                        ...editForm,
                        services: editForm.services.filter(
                          (id) => id !== service.id
                        ),
                      });
                    }
                  }}
                />
                {service.name}
              </label>
              <span>${service.price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    ) : (
      <div>
        {editForm.services.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No services selected
          </div>
        ) : (
          <div className="space-y-1">
            {filteredServices.map((service) => (
              <div key={service.id} className="flex justify-between">
                <span>{service.name}</span>
                <span>${service.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

const EditProductsSection = ({
  editForm,
  setEditForm,
  isEditing,
  onSave,
  productSearch,
  setProductSearch,
  filteredProducts,
}) => (
  <div className="border rounded-md p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold">Products</h3>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onSave}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
    {isEditing ? (
      <div className="space-y-4">
        <Input
          placeholder="Search products..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-40 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-1"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.products.includes(product.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEditForm({
                        ...editForm,
                        products: [...editForm.products, product.id],
                      });
                    } else {
                      setEditForm({
                        ...editForm,
                        products: editForm.products.filter(
                          (id) => id !== product.id
                        ),
                      });
                    }
                  }}
                />
                {product.name}
              </label>
              <span>${product.price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    ) : (
      <div>
        {editForm.products.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No products selected
          </div>
        ) : (
          <div className="space-y-1">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span>${product.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

const EditDateTimeSection = ({ editForm, setEditForm, isEditing, onSave }) => (
  <div className="border rounded-md p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold">Date & Time</h3>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onSave}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
    {isEditing ? (
      <div className="space-y-4">
        <div>
          <label htmlFor="appointmentDate" className="block text-xs mb-1">
            Date
          </label>
          <Input
            id="appointmentDate"
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="appointmentTime" className="block text-xs mb-1">
            Time
          </label>
          <Input
            id="appointmentTime"
            type="time"
            value={editForm.time}
            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
          />
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    ) : (
      <div>
        {editForm.date} at {editForm.time}
      </div>
    )}
  </div>
);

const CalendarCard = ({ date, setDate }) => (
  <Card className="p-6">
    <h3 className="text-lg font-medium mb-4 flex items-center">
      <CalendarIcon className="mr-2 h-5 w-5" />
      Select Date
    </h3>
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  </Card>
);

const AppointmentsListCard = ({
  date,
  filteredAppointments,
  onAccept,
  onReject,
  onEdit,
  onMarkCompleted,
  onView,
  onRepeat,
  setAddAppointmentOpen,
}) => (
  <Card className="lg:col-span-2 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium mb-4">
        Appointments for {date?.toLocaleDateString()}
      </h3>
      <Button
        className="bg-glamour-700 hover:bg-glamour-800 text-white"
        onClick={() => setAddAppointmentOpen(true)}
      >
        <CalendarPlus className="w-4 h-4 mr-2" /> Add Appointment
      </Button>
    </div>

    {filteredAppointments.length > 0 ? (
      <AppointmentsTable
        appointments={filteredAppointments}
        onAccept={onAccept}
        onReject={onReject}
        onEdit={onEdit}
        onMarkCompleted={onMarkCompleted}
        onView={onView}
        onRepeat={onRepeat}
      />
    ) : (
      <div className="text-center py-12 text-muted-foreground">
        No appointments scheduled for this date
      </div>
    )}
  </Card>
);

const AppointmentsContent = ({
  date,
  setDate,
  filteredAppointments,
  onAccept,
  onReject,
  onEdit,
  onMarkCompleted,
  onView,
  onRepeat,
  setAddAppointmentOpen,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <CalendarCard date={date} setDate={setDate} />
      <AppointmentsListCard
        date={date}
        filteredAppointments={filteredAppointments}
        onAccept={onAccept}
        onReject={onReject}
        onEdit={onEdit}
        onMarkCompleted={onMarkCompleted}
        onView={onView}
        onRepeat={onRepeat}
        setAddAppointmentOpen={setAddAppointmentOpen}
      />
    </div>
  </div>
);

const AppointmentsTab = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);

  // Mock appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      customerName: "Anna Johnson",
      customerPhone: "+994 50 123 4567",
      services: ["Facial Treatment"],
      products: ["Moisturizer Cream"],
      date: "2025-05-10",
      time: "10:00",
      duration: "60 min",
      totalAmount: 195,
      status: "confirmed",
      executors: {},
      rejectReason: "",
    },
    {
      id: 2,
      customerName: "David Brown",
      customerPhone: "+994 55 876 5432",
      services: ["Hair Styling", "Manicure"],
      products: [],
      date: "2025-05-10",
      time: "11:30",
      duration: "75 min",
      totalAmount: 130,
      status: "pending",
      executors: {},
      rejectReason: "",
    },
    {
      id: 3,
      customerName: "Maria Garcia",
      customerPhone: "+994 70 345 6789",
      services: ["Massage Therapy"],
      products: ["Massage Oil"],
      date: "2025-05-10",
      time: "13:00",
      duration: "45 min",
      totalAmount: 162,
      status: "confirmed",
      executors: {},
      rejectReason: "",
    },
    {
      id: 4,
      customerName: "John Smith",
      customerPhone: "+994 77 987 6543",
      services: ["Makeup Application"],
      products: ["Luxury Makeup Palette"],
      date: "2025-05-10",
      time: "15:30",
      duration: "60 min",
      totalAmount: 175,
      status: "rejected",
      executors: {},
      rejectReason: "Gecikmə səbəbi ilə qəbul edilmədi.",
    },
    {
      id: 5,
      customerName: "Sarah Williams",
      customerPhone: "+994 50 444 5555",
      services: ["Hair Treatment", "Manicure"],
      products: ["Hair Care Kit"],
      date: "2025-05-11",
      time: "09:30",
      duration: "90 min",
      totalAmount: 205,
      status: "pending",
      executors: {},
      rejectReason: "",
    },
    {
      id: 6,
      customerName: "Completed User",
      customerPhone: "+994 50 999 9999",
      services: ["Facial Treatment"],
      products: ["Moisturizer Cream"],
      date: "2025-05-12",
      time: "14:00",
      duration: "60 min",
      totalAmount: 150,
      status: "completed",
      executors: { "Facial Treatment": 1 },
      rejectReason: "",
    },
  ]);

  // Filter appointments for selected date
  const selectedDate = date ? date.toISOString().split("T")[0] : "";
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.date === selectedDate
  );

  const staffList = [
    { id: 1, name: "Sarah Johnson" },
    { id: 2, name: "David Chen" },
    { id: 3, name: "Amina Khalid" },
    { id: 4, name: "Michael Rodriguez" },
    { id: 5, name: "Leyla Mammadova" },
    { id: 6, name: "John Smith" },
  ];
  const productStock = {
    "Moisturizer Cream": 5,
    "Massage Oil": 0,
    "Luxury Makeup Palette": 2,
    "Hair Care Kit": 1,
  };

  const [acceptDrawerOpen, setAcceptDrawerOpen] = useState(false);
  const [rejectDrawerOpen, setRejectDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [serviceStaff, setServiceStaff] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [isEditingProducts, setIsEditingProducts] = useState(false);
  const [isEditingDateTime, setIsEditingDateTime] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerPhone: "",
    services: [],
    products: [],
    date: "",
    time: "",
    paymentMethod: "",
    executors: {},
  });

  // Mock all services and products with id, name, price
  const allServices = [
    { id: 1, name: "Facial Treatment", price: 150 },
    { id: 2, name: "Massage Therapy", price: 120 },
    { id: 3, name: "Manicure", price: 50 },
    { id: 4, name: "Hair Styling", price: 80 },
    { id: 5, name: "Makeup Application", price: 90 },
  ];
  const allProducts = [
    { id: 1, name: "Moisturizer Cream", price: 45 },
    { id: 2, name: "Anti-Aging Serum", price: 75 },
    { id: 3, name: "Hair Care Kit", price: 60 },
  ];

  // Add search state for services/products
  const [serviceSearch, setServiceSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Filtered lists for search
  const filteredServices = allServices.filter((s) =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );
  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Payment calculation for edit form
  const selectedServiceObjs = allServices.filter((s) =>
    editForm.services.includes(s.id)
  );
  const selectedProductObjs = allProducts.filter((p) =>
    editForm.products.includes(p.id)
  );
  const servicesTotal = selectedServiceObjs.reduce(
    (sum, s) => sum + s.price,
    0
  );
  const productsTotal = selectedProductObjs.reduce(
    (sum, p) => sum + p.price,
    0
  );
  const total = servicesTotal + productsTotal;

  // When editMode is enabled, initialize editForm with selectedAppointment data
  useEffect(() => {
    if (editMode && selectedAppointment) {
      setEditForm({
        customerName: selectedAppointment.customerName,
        customerPhone: selectedAppointment.customerPhone,
        services: Array.isArray(selectedAppointment.services)
          ? [...selectedAppointment.services]
          : [],
        products: Array.isArray(selectedAppointment.products)
          ? [...selectedAppointment.products]
          : [],
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        paymentMethod: selectedAppointment.paymentMethod || "",
        executors: selectedAppointment.executors
          ? { ...selectedAppointment.executors }
          : {},
      });
    }
  }, [editMode, selectedAppointment]);

  // Save handler for each section
  const handleSaveCustomer = () => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment?.id
          ? {
              ...app,
              customerName: editForm.customerName,
              customerPhone: editForm.customerPhone,
            }
          : app
      )
    );
    setIsEditingCustomer(false);
  };
  const handleSaveServices = () => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment?.id
          ? {
              ...app,
              services: [...editForm.services],
              executors: { ...editForm.executors },
            }
          : app
      )
    );
    setIsEditingServices(false);
  };
  const handleSaveProducts = () => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment?.id
          ? { ...app, products: [...editForm.products] }
          : app
      )
    );
    setIsEditingProducts(false);
  };
  const handleSaveDateTime = () => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment?.id
          ? { ...app, date: editForm.date, time: editForm.time }
          : app
      )
    );
    setIsEditingDateTime(false);
  };
  const handleSavePayment = () => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment?.id
          ? { ...app, paymentMethod: editForm.paymentMethod }
          : app
      )
    );
    setIsEditingPayment(false);
  };

  // Mark as completed handler
  const handleMarkCompleted = (appointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointment.id ? { ...app, status: "completed" } : app
      )
    );
    setViewDrawerOpen(false);
    setSelectedAppointment(null);
  };

  // Accept handler
  const handleAccept = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setServiceStaff({});
    setAcceptDrawerOpen(true);
  };
  // Reject handler
  const handleReject = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRejectReason("");
    setRejectDrawerOpen(true);
  };
  // View handler
  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditMode(false);
    setViewDrawerOpen(true);
  };
  // Edit handler
  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditMode(true);
    setEditDrawerOpen(true);
  };

  // Accept Confirm handler
  const handleAcceptConfirm = () => {
    if (!selectedAppointment) return;
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment.id
          ? { ...app, status: "confirmed", executors: { ...serviceStaff } }
          : app
      )
    );
    setAcceptDrawerOpen(false);
    setSelectedAppointment(null);
    setServiceStaff({});
  };

  // Reject Confirm handler
  const handleRejectConfirm = () => {
    if (!selectedAppointment) return;
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment.id
          ? { ...app, status: "rejected", rejectReason }
          : app
      )
    );
    setRejectDrawerOpen(false);
    setSelectedAppointment(null);
    setRejectReason("");
  };

  // Repeat handler
  const handleRepeat = (appointment: Appointment) => {
    setAppointments((prev) => [
      {
        ...appointment,
        id: prev.length + 1,
        status: "pending",
        services: [...appointment.services],
        products: [...appointment.products],
        date: appointment.date,
        time: appointment.time,
        paymentMethod: appointment.paymentMethod,
        executors: {},
        rejectReason: "",
      },
      ...prev,
    ]);
  };

  return (
    <>
      <AppointmentsContent
        date={date}
        setDate={setDate}
        filteredAppointments={filteredAppointments}
        onAccept={handleAccept}
        onReject={handleReject}
        onEdit={handleEdit}
        onMarkCompleted={handleMarkCompleted}
        onView={handleView}
        onRepeat={handleRepeat}
        setAddAppointmentOpen={setAddAppointmentOpen}
      />
      {/* Drawers */}
      <DetailDrawer
        open={addAppointmentOpen}
        onOpenChange={setAddAppointmentOpen}
        title="Book now"
      >
        <OrderProvider>
          <CheckoutFlow />
        </OrderProvider>
      </DetailDrawer>
      {/* Accept Drawer */}
      <DetailDrawer
        open={acceptDrawerOpen}
        onOpenChange={setAcceptDrawerOpen}
        title="Appointment Acceptance"
      >
        {selectedAppointment && (
          <div className="space-y-4 p-4">
            <div>
              <h4 className="font-semibold mb-2">Servislər və Staff seçimi</h4>
              {selectedAppointment.services.map((service) => (
                <div key={service} className="mb-2 flex items-center gap-2">
                  <span>{service}</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={serviceStaff[service] || ""}
                    onChange={(e) =>
                      setServiceStaff({
                        ...serviceStaff,
                        [service]: e.target.value,
                      })
                    }
                  >
                    <option value="">Staff seçin</option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-2">İstifadə olunan məhsullar</h4>
              {selectedAppointment.products.length === 0 && <div>Yoxdur</div>}
              {selectedAppointment.products.map((product) => (
                <div key={product} className="flex items-center gap-2">
                  <span>{product}</span>
                  {productStock[product] > 0 ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Stokda var
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      Stokda yoxdur
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Button
              className="bg-glamour-700 hover:bg-glamour-800 text-white w-full"
              onClick={handleAcceptConfirm}
            >
              Təsdiqlə
            </Button>
          </div>
        )}
      </DetailDrawer>
      {/* Reject Drawer */}
      <DetailDrawer
        open={rejectDrawerOpen}
        onOpenChange={setRejectDrawerOpen}
        title="Appointment Rejection"
      >
        {selectedAppointment && (
          <div className="space-y-4 p-4">
            <div>
              <label htmlFor="rejectReason" className="block mb-1 font-medium">
                Səbəb
              </label>
              <textarea
                id="rejectReason"
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Reject səbəbini daxil edin..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white w-full"
              onClick={handleRejectConfirm}
            >
              Təsdiqlə
            </Button>
          </div>
        )}
      </DetailDrawer>
      {/* View Details Drawer - Updated to show read-only info */}
      <DetailDrawer
        open={viewDrawerOpen}
        onOpenChange={setViewDrawerOpen}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-4 p-4">
            {/* Customer Info */}
            <div>
              <div className="font-semibold">Müştəri:</div>
              <div>
                {selectedAppointment.customerName} (
                {selectedAppointment.customerPhone})
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="font-semibold">Servislər:</div>
              <ul className="flex flex-wrap gap-2 ml-0">
                {selectedAppointment.services.map((service) => (
                  <li
                    key={service}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
                  >
                    {service} —{" "}
                    <span className="text-glamour-700 font-medium">
                      {selectedAppointment.executors?.[service]
                        ? staffList.find(
                            (s) =>
                              s.id ===
                              Number(selectedAppointment.executors[service])
                          )?.name || "Seçilməyib"
                        : "Seçilməyib"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <div className="font-semibold">Məhsullar:</div>
              <ul className="flex flex-wrap gap-2 ml-0">
                {selectedAppointment.products.length === 0 && <div>Yoxdur</div>}
                {selectedAppointment.products.map((product) => (
                  <li
                    key={product}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </div>

            {/* Date/Time */}
            <div>
              <div className="font-semibold">Tarix və saat:</div>
              <div>
                {selectedAppointment.date} {selectedAppointment.time} (
                {selectedAppointment.duration})
              </div>
            </div>

            {/* Payment */}
            <div>
              <div className="font-semibold">Ödəniş:</div>
              <div>Ümumi: ${selectedAppointment.totalAmount}</div>
              {selectedAppointment.paymentMethod && (
                <div>Ödəniş üsulu: {selectedAppointment.paymentMethod}</div>
              )}
            </div>

            {/* Status */}
            <div>
              <div className="font-semibold">Status:</div>
              <div>{selectedAppointment.status}</div>
            </div>

            {/* Rejection reason if applicable */}
            {selectedAppointment.status === "rejected" &&
              selectedAppointment.rejectReason && (
                <div>
                  <div className="font-semibold">Reject səbəbi:</div>
                  <div className="text-red-700">
                    {selectedAppointment.rejectReason}
                  </div>
                </div>
              )}

            {/* Action button for repeat */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                handleRepeat(selectedAppointment);
                setViewDrawerOpen(false);
              }}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Təkrar et
            </Button>
          </div>
        )}
      </DetailDrawer>
      {/* Edit Drawer for Book now form */}
      <DetailDrawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        title="Edit Appointment"
      >
        {selectedAppointment && (
          <div className="p-4 space-y-6">
            <EditCustomerSection
              editForm={editForm}
              setEditForm={setEditForm}
              isEditing={isEditingCustomer}
              onSave={() => {
                handleSaveCustomer();
                setIsEditingCustomer(!isEditingCustomer);
              }}
            />

            <EditServicesSection
              editForm={editForm}
              setEditForm={setEditForm}
              isEditing={isEditingServices}
              onSave={() => {
                handleSaveServices();
                setIsEditingServices(!isEditingServices);
              }}
              serviceSearch={serviceSearch}
              setServiceSearch={setServiceSearch}
              filteredServices={filteredServices}
            />

            <EditProductsSection
              editForm={editForm}
              setEditForm={setEditForm}
              isEditing={isEditingProducts}
              onSave={() => {
                handleSaveProducts();
                setIsEditingProducts(!isEditingProducts);
              }}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              filteredProducts={filteredProducts}
            />

            <EditDateTimeSection
              editForm={editForm}
              setEditForm={setEditForm}
              isEditing={isEditingDateTime}
              onSave={() => {
                handleSaveDateTime();
                setIsEditingDateTime(!isEditingDateTime);
              }}
            />

            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Payment</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsEditingPayment(!isEditingPayment)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xl font-bold">Total: ${total}</div>
              {isEditingPayment ? (
                <div className="space-y-4 mt-2">
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-xs mb-1"
                    >
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      className="w-full border rounded px-3 py-2"
                      value={editForm.paymentMethod}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option value="">Select payment method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleSavePayment}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  {editForm.paymentMethod ? (
                    <div>Method: {editForm.paymentMethod}</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No payment method selected
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setEditDrawerOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </>
  );
};

export default AppointmentsTab;
