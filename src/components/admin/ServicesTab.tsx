import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useServices } from "@/hooks/use-services";
import { Service, ServiceFormData } from "@/models/service.model";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ServiceTableRow = ({ service, onEdit, onDelete }) => (
  <TableRow key={service.id}>
    <TableCell className="font-medium">{service.name}</TableCell>
    <TableCell>{service.duration} min</TableCell>
    <TableCell>${service.price.toFixed(2)}</TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="sm" onClick={() => onEdit(service)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDelete(service)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </TableCell>
  </TableRow>
);

const ServiceTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Duration</TableHead>
      <TableHead>Price</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
);

const ServiceTable = ({ services, onEdit, onDelete }) => (
  <Card>
    <CardContent className="p-0">
      <Table>
        <ServiceTableHeader />
        <TableBody>
          {services.map((service) => (
            <ServiceTableRow
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const ServiceFormFields = ({
  formData,
  handleInputChange,
  handleBenefitsChange,
}) => (
  <div className="grid gap-4 py-4">
    <div className="grid gap-2">
      <Label htmlFor="name">Name *</Label>
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        rows={3}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="duration">Duration (minutes) *</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          min="1"
          value={formData.duration}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Price ($) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
    <div className="grid gap-2">
      <Label htmlFor="benefits">Benefits (one per line)</Label>
      <Textarea
        id="benefits"
        name="benefits"
        value={formData.benefits?.join("\n") || ""}
        onChange={handleBenefitsChange}
        rows={3}
        placeholder="Enter each benefit on a new line"
      />
    </div>
  </div>
);

const DialogContentWrapper = ({ title, description, children }) => (
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    {children}
  </DialogContent>
);

const ServiceForm = ({
  onSubmit,
  formData,
  handleInputChange,
  handleBenefitsChange,
  resetForm,
  onOpenChange,
  submitText,
}) => (
  <form onSubmit={onSubmit}>
    <ServiceFormFields
      formData={formData}
      handleInputChange={handleInputChange}
      handleBenefitsChange={handleBenefitsChange}
    />
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          resetForm();
          onOpenChange(false);
        }}
      >
        Cancel
      </Button>
      <Button type="submit">{submitText}</Button>
    </DialogFooter>
  </form>
);

const CreateServiceDialog = ({
  open,
  onOpenChange,
  formData,
  handleInputChange,
  handleBenefitsChange,
  handleCreateSubmit,
  resetForm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContentWrapper
      title="Create New Service"
      description="Add a new service to your catalog."
    >
      <ServiceForm
        onSubmit={handleCreateSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleBenefitsChange={handleBenefitsChange}
        resetForm={resetForm}
        onOpenChange={onOpenChange}
        submitText="Create Service"
      />
    </DialogContentWrapper>
  </Dialog>
);

const EditServiceDialog = ({
  open,
  onOpenChange,
  formData,
  handleInputChange,
  handleBenefitsChange,
  handleEditSubmit,
  resetForm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContentWrapper
      title="Edit Service"
      description="Update the service details."
    >
      <ServiceForm
        onSubmit={handleEditSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleBenefitsChange={handleBenefitsChange}
        resetForm={resetForm}
        onOpenChange={onOpenChange}
        submitText="Update Service"
      />
    </DialogContentWrapper>
  </Dialog>
);

const DeleteServiceDialog = ({ open, onOpenChange, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContentWrapper
      title="Delete Service"
      description="Are you sure you want to delete this service? This action cannot be undone."
    >
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContentWrapper>
  </Dialog>
);

const ServicesTab = () => {
  const {
    services,
    isLoading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServices();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    benefits: [],
  });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "duration" || name === "price") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const benefitsText = e.target.value;
    const benefitsArray = benefitsText
      .split("\n")
      .map((benefit) => benefit.trim())
      .filter((benefit) => benefit !== "");

    setFormData({
      ...formData,
      benefits: benefitsArray,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      benefits: [],
    });
    setCurrentService(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.price <= 0 || formData.duration <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    const result = await createService(formData);
    if (result) {
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleEditClick = (service: Service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      duration: service.duration,
      price: service.price,
      benefits: service.benefits || [],
      category_id: service.category_id,
      image_urls: service.image_urls,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentService) return;

    if (!formData.name || formData.price <= 0 || formData.duration <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    const result = await updateService(currentService.id.toString(), formData);
    if (result) {
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteClick = (service: Service) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentService) return;

    const result = await deleteService(currentService.id.toString());
    if (result) {
      setIsDeleteDialogOpen(false);
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading services: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No services found. Create your first service to get started.
          </CardContent>
        </Card>
      ) : (
        <ServiceTable
          services={services}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleBenefitsChange={handleBenefitsChange}
        handleCreateSubmit={handleCreateSubmit}
        resetForm={resetForm}
      />

      <EditServiceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleBenefitsChange={handleBenefitsChange}
        handleEditSubmit={handleEditSubmit}
        resetForm={resetForm}
      />

      <DeleteServiceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ServicesTab;
