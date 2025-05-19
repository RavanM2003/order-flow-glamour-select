
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useServiceData } from '../hooks/useServiceData';
import ServiceCard from './ServiceCard';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";

export default function ServiceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { services, isLoading, error } = useServiceData();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-glamour-800">Xidmətlər</h2>
          <Button
            className="bg-glamour-700 hover:bg-glamour-800 text-white"
            asChild
          >
            <Link to="/services/create">
              <CalendarPlus className="w-4 h-4 mr-2" /> Xidmət əlavə et
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Xidmətləri axtar..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Xidmətlər yüklənir...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onDeleteClick={(id) => {
                  setServiceToDelete(id);
                  setDeleteDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {searchTerm ? `"${searchTerm}" ilə uyğun xidmət tapılmadı` : "Heç bir xidmət tapılmadı"}
            </p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>Xidməti silmək istədiyinizə əminsiniz?</DialogHeader>
            <div className="py-4 text-sm text-muted-foreground">
              Bu əməliyyat geri qaytarıla bilməz. Xidmət silinəcək.
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Ləğv et
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  // Add delete logic here
                  setDeleteDialogOpen(false);
                  setServiceToDelete(null);
                }}
              >
                Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
