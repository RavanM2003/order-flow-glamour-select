import React, { useState, useEffect } from "react";
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
  Clock,
  DollarSign,
  CalendarPlus,
} from "lucide-react";
import DetailDrawer from "@/components/common/DetailDrawer";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useServices } from "@/hooks/use-services";
import { Service } from "@/models/service.model";

const allProducts = [
  "Moisturizer Cream",
  "Anti-Aging Serum",
  "Massage Oil",
  "Nail Polish",
  "Cuticle Oil",
  "Hair Care Kit",
  "Styling Gel",
  "Foundation",
  "Lipstick",
  "Mascara",
  "Body Scrub",
  "Body Lotion",
  "Color Protection Shampoo",
  "Eyebrow Gel",
  "Foot Cream",
  "Soothing Gel",
  "Hair Mask",
  "Hair Serum",
  "Eyelash Cleanser",
];

const ServicesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const { services: apiServices, fetchServices, createService, updateService, deleteService, isLoading } = useServices();
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({
    name: "",
    duration: 30, // Changed to number
    price: "",
    products: [],
    description: "",
    benefits: [],
  });
  const [addServiceError, setAddServiceError] = useState("");
  const [editServiceOpen, setEditServiceOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [editServiceForm, setEditServiceForm] = useState({
    name: "",
    duration: 30, // Changed to number
    price: "",
    products: [],
    description: "",
    benefits: [],
  });
  const [editServiceError, setEditServiceError] = useState("");
  const { toast, dismiss } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  // Effect to fetch services from API
  useEffect(() => {
    if (apiServices.length > 0) {
      setServices(apiServices);
    } else {
      fetchServices();
    }
  }, [apiServices, fetchServices]);

  // Filter services based on search term
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Paginate services
  const pageSize = 10;
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const currentServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Add Service logic
  const handleAddService = async (e) => {
    e.preventDefault();
    if (
      !newService.name ||
      !newService.duration ||
      !newService.price ||
      !newService.description
    ) {
      setAddServiceError("Name, duration, price, and description are required");
      return;
    }

    // Create service via API
    const serviceData = {
      name: newService.name,
      description: newService.description,
      duration: Number(newService.duration), // Ensure duration is a number
      price: Number(newService.price),
      benefits: newService.benefits.filter((b) => b.trim() !== ""),
      relatedProducts: [], // Add any related products if needed
    };
    
    const result = await createService(serviceData);
    
    if (result) {
      setNewService({
        name: "",
        duration: 30,
        price: "",
        products: [],
        description: "",
        benefits: [],
      });
      setAddServiceOpen(false);
      setAddServiceError("");
    }
  };

  // Delete Service logic
  const handleDeleteService = (id: number) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (serviceToDelete) {
      await deleteService(serviceToDelete);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const cancelDeleteService = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  // Multi-select handler
  const handleProductSelect = (product) => {
    setNewService((prev) =>
      prev.products.includes(product)
        ? { ...prev, products: prev.products.filter((p) => p !== product) }
        : { ...prev, products: [...prev.products, product] }
    );
  };

  // Edit Service logic
  const handleEditService = (service) => {
    setEditService(service);
    setEditServiceForm({
      name: service.name,
      duration: service.duration,
      price: service.price,
      products: service.products || [],
      description: service.description || "",
      benefits: service.benefits || [],
    });
    setEditServiceOpen(true);
    setEditServiceError("");
  };
  
  const handleEditServiceSubmit = async (e) => {
    e.preventDefault();
    if (
      !editServiceForm.name ||
      !editServiceForm.duration ||
      !editServiceForm.price
    ) {
      setEditServiceError("All fields are required");
      return;
    }

    // Update service via API
    const serviceData = {
      name: editServiceForm.name,
      description: editServiceForm.description,
      duration: Number(editServiceForm.duration), // Ensure duration is a number
      price: Number(editServiceForm.price),
      benefits: editServiceForm.benefits,
      relatedProducts: [], // Add any related products if needed
    };
    
    const result = await updateService(editService.id, serviceData);
    
    if (result) {
      setEditServiceOpen(false);
      setEditService(null);
      setEditServiceError("");
    }
  };
  
  const handleEditProductSelect = (product) => {
    setEditServiceForm((prev) =>
      prev.products.includes(product)
        ? { ...prev, products: prev.products.filter((p) => p !== product) }
        : { ...prev, products: [...prev.products, product] }
    );
  };

  // Format duration for display (convert minutes to a readable format)
  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-glamour-800">Services</h2>
          <Button
            className="bg-glamour-700 hover:bg-glamour-800 text-white"
            onClick={() => setAddServiceOpen(true)}
          >
            <CalendarPlus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
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
                <TableHead>Service Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Used Products</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {formatDuration(service.duration)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className="inline-flex items-center justify-end">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      {service.price}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {service.relatedProducts?.map((productId, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {productId}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteService(service.id)}
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
            {Math.min(currentPage * pageSize, filteredServices.length)} of{" "}
            {filteredServices.length} entries
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
      {/* Add Service Drawer */}
      <DetailDrawer
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        title="Add Service"
      >
        <form onSubmit={handleAddService} className="space-y-4 p-4">
          <Input
            placeholder="Service Name"
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
            required
          />
          <Input
            placeholder="Duration (minutes)"
            type="number"
            value={newService.duration}
            onChange={(e) =>
              setNewService({ ...newService, duration: Number(e.target.value) })
            }
            required
          />
          <Input
            placeholder="Price"
            type="number"
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
            required
          />
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full min-h-[150px] p-2 border rounded-md"
              placeholder="Enter detailed service description..."
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Benefits</label>
            <div className="space-y-2">
              {newService.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Enter benefit"
                    value={benefit}
                    onChange={(e) => {
                      const newBenefits = [...newService.benefits];
                      newBenefits[index] = e.target.value;
                      setNewService({ ...newService, benefits: newBenefits });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newBenefits = newService.benefits.filter(
                        (_, i) => i !== index
                      );
                      setNewService({ ...newService, benefits: newBenefits });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setNewService({
                    ...newService,
                    benefits: [...newService.benefits, ""],
                  })
                }
              >
                Add Benefit
              </Button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Used Products</label>
            <div className="flex flex-wrap gap-2">
              {allProducts.map((product) => (
                <button
                  type="button"
                  key={product}
                  className={`px-3 py-1 rounded-full border text-xs ${
                    newService.products.includes(product)
                      ? "bg-glamour-700 text-white border-glamour-700"
                      : "bg-white text-glamour-800 border-gray-300"
                  }`}
                  onClick={() => handleProductSelect(product)}
                >
                  {product}
                </button>
              ))}
            </div>
          </div>
          {addServiceError && (
            <div className="text-red-600 text-sm">{addServiceError}</div>
          )}
          <Button
            type="submit"
            className="bg-glamour-700 hover:bg-glamour-800 text-white w-full"
          >
            Add Service
          </Button>
        </form>
      </DetailDrawer>
      {/* Edit Service Drawer */}
      <DetailDrawer
        open={editServiceOpen}
        onOpenChange={setEditServiceOpen}
        title="Edit Service"
      >
        <form onSubmit={handleEditServiceSubmit} className="space-y-4 p-4">
          <Input
            placeholder="Service Name"
            value={editServiceForm.name}
            onChange={(e) =>
              setEditServiceForm({ ...editServiceForm, name: e.target.value })
            }
            required
          />
          <Input
            placeholder="Duration (minutes)"
            type="number"
            value={editServiceForm.duration}
            onChange={(e) =>
              setEditServiceForm({
                ...editServiceForm,
                duration: Number(e.target.value),
              })
            }
            required
          />
          <Input
            placeholder="Price"
            type="number"
            value={editServiceForm.price}
            onChange={(e) =>
              setEditServiceForm({ ...editServiceForm, price: e.target.value })
            }
            required
          />
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full min-h-[150px] p-2 border rounded-md"
              placeholder="Enter detailed service description..."
              value={editServiceForm.description}
              onChange={(e) =>
                setEditServiceForm({
                  ...editServiceForm,
                  description: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Benefits</label>
            <div className="space-y-2">
              {editServiceForm.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Enter benefit"
                    value={benefit}
                    onChange={(e) => {
                      const newBenefits = [...editServiceForm.benefits];
                      newBenefits[index] = e.target.value;
                      setEditServiceForm({
                        ...editServiceForm,
                        benefits: newBenefits,
                      });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newBenefits = editServiceForm.benefits.filter(
                        (_, i) => i !== index
                      );
                      setEditServiceForm({
                        ...editServiceForm,
                        benefits: newBenefits,
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditServiceForm({
                    ...editServiceForm,
                    benefits: [...editServiceForm.benefits, ""],
                  })
                }
              >
                Add Benefit
              </Button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Used Products</label>
            <div className="flex flex-wrap gap-2">
              {allProducts.map((product) => (
                <button
                  type="button"
                  key={product}
                  className={`px-3 py-1 rounded-full border text-xs ${
                    editServiceForm.products.includes(product)
                      ? "bg-glamour-700 text-white border-glamour-700"
                      : "bg-white text-glamour-800 border-gray-300"
                  }`}
                  onClick={() => handleEditProductSelect(product)}
                >
                  {product}
                </button>
              ))}
            </div>
          </div>
          {editServiceError && (
            <div className="text-red-600 text-sm">{editServiceError}</div>
          )}
          <Button
            type="submit"
            className="bg-glamour-700 hover:bg-glamour-800 text-white w-full"
          >
            Save Changes
          </Button>
        </form>
      </DetailDrawer>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>Xidməti silmək istədiyinizə əminsiniz?</DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Bu əməliyyat geri qaytarıla bilməz. Xidmət silinəcək.
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelDeleteService}>
              Ləğv et
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteService}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesTab;
