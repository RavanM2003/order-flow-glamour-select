
import { useEffect, useState } from "react";
import { useServices } from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, PowerIcon } from "lucide-react";
import ServiceForm from "@/components/ServiceForm";
import DetailDrawer from "@/components/common/DetailDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/ui/price-display";
import { formatDurationMultiLanguage } from "@/utils/validation";
import { useLanguage } from "@/context/LanguageContext";

const ServicesTable = ({ 
  services, 
  onEdit, 
  onToggleStatus,
  className = ""
}) => {
  const { t } = useLanguage();
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Name</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[100px]">Duration</TableHead>
            <TableHead className="min-w-[80px]">Price</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell min-w-[200px]">Description</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right min-w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!services || services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No services found
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500 sm:hidden">
                      {formatDurationMultiLanguage(service.duration, t)} • <PriceDisplay price={service.price} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDurationMultiLanguage(service.duration, t)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <PriceDisplay price={service.price} discount={service.discount} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {service.category_id || "Uncategorized"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="max-w-[200px] truncate">
                    {service.description || "No description"}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(service)}
                      className="text-xs px-2 py-1"
                    >
                      <EditIcon className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(service.id)}
                      className="text-xs px-2 py-1 text-orange-600 hover:text-orange-700"
                    >
                      <PowerIcon className="h-3 w-3 mr-1" />
                      Disable
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const ServicesHeader = ({ searchTerm, setSearchTerm, onAddClick }) => (
  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <CardTitle>Services</CardTitle>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search services..."
          className="w-full sm:w-[200px] pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Service
      </Button>
    </div>
  </CardHeader>
);

const ServicesTab = () => {
  const { services, isLoading, error, fetchServices } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Add defensive check for services array
  const safeServices = Array.isArray(services) ? services : [];

  const filteredServices = safeServices.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (serviceId) => {
    // TODO: Implement disable service functionality
    console.log('Disable service:', serviceId);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingService(null);
    fetchServices();
  };

  const handleFormSubmit = (data) => {
    // TODO: Implement actual service creation/update logic
    console.log('Form submitted:', data);
    handleFormSuccess();
  };

  return (
    <Card>
      <ServicesHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => {
          setEditingService(null);
          setIsFormOpen(true);
        }}
      />
      <CardContent className="p-0 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading services...</div>
        ) : error ? (
          <div className="text-red-500 p-8 text-center">Error: {error}</div>
        ) : (
          <ServicesTable
            services={filteredServices}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            className="px-4 sm:px-0"
          />
        )}
      </CardContent>

      {/* Service Form Drawer */}
      <DetailDrawer
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingService ? "Edit Service" : "Add New Service"}
        position="right"
      >
        <ServiceForm
          initialData={editingService}
          onSubmit={handleFormSubmit}
          isSubmitting={false}
        />
      </DetailDrawer>
    </Card>
  );
};

export default ServicesTab;
