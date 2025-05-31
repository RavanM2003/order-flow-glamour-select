import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import { Service } from "@/models/service.model";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import DiscountBadge from "@/components/ui/discount-badge";
import PriceDisplay from "@/components/ui/price-display";
import { useLanguage } from "@/context";

const ServiceCard = ({ service }: { service: Service }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
      <DiscountBadge discount={service.discount || 0} />
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {service.image_urls && service.image_urls[0] ? (
          <img
            src={service.image_urls[0]}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Clock className="h-16 w-16 text-glamour-600" />
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-glamour-800">{service.name}</h3>
          <PriceDisplay
            price={service.price}
            discount={service.discount}
            className="ml-4"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {service.duration} {t("common.minutes")}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mb-6 line-clamp-3">
          {service.description || t("services.noDescription")}
        </p>
        <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
          <Link to={`/services/${service.id}`}>
            {t("home.viewDetails")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const HomeServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const query = supabase
          .from("services")
          .select("*")
          .limit(3)
          .order("discount", { ascending: false })
          .order("created_at", { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching services:", error);
          return;
        }

        if (data) {
          setServices(data as Service[]);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {services.length > 0 && (
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/services">
              {t("services.viewAllServices")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {services.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-6">
            {t("services.noServicesAdded")}
          </p>
          <Button asChild variant="outline">
            <Link to="/services">{t("services.viewServicesPage")}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomeServicesSection;
