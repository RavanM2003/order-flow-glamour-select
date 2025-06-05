
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Trash, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onDeleteClick: (id: string) => void; // Changed from number to string
}

export default function ServiceCard({ service, onDeleteClick }: ServiceCardProps) {
  // Format duration for display (convert minutes to a readable format)
  const formatDuration = (minutes: number): string => {
    return `${minutes} dəq`;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <p className="text-glamour-600">Xidmət Şəkli</p>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-glamour-800">{service.name}</h2>
          <div className="text-glamour-700 font-semibold">${service.price}</div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          <span className="inline-flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            {formatDuration(service.duration)}
          </span>
        </p>
        <p className="text-gray-600 mb-6 line-clamp-3">{service.description}</p>
        <div className="flex gap-2">
          <Button className="flex-1 bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to={`/services/${service.id}`}>
              Ətraflı bax
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            asChild
          >
            <Link to={`/services/${service.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            onClick={() => onDeleteClick(service.id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
