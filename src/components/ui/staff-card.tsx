
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface StaffPosition {
  position: string;
  services: Array<{
    id: number;
    name: string;
    price: number;
    duration: number;
  }>;
}

interface StaffUser {
  bio?: string;
  role: string;
  full_name: string;
  photo_url?: string;
}

interface StaffData {
  user: StaffUser;
  positions: StaffPosition[];
}

interface StaffCardProps {
  staffData: StaffData;
}

const StaffCard: React.FC<StaffCardProps> = ({ staffData }) => {
  const { user, positions } = staffData;
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.photo_url ? (
              <img 
                src={user.photo_url} 
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-glamour-600">
                {user.full_name?.charAt(0)}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-glamour-800 mb-1">
            {user.full_name}
          </h3>
          <p className="text-glamour-600 mb-3 capitalize">
            {positions.map(p => p.position).join(', ')}
          </p>
          {user.bio && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-96 p-6" side="top">
        <div className="space-y-4">
          {/* Staff Info */}
          <div>
            <h4 className="text-lg font-semibold text-glamour-800 mb-2">{user.full_name}</h4>
            <Badge variant="secondary" className="mb-2">{user.role}</Badge>
            {user.bio && (
              <p className="text-gray-600 text-sm">{user.bio}</p>
            )}
          </div>
          
          {/* Positions and Services */}
          <div className="space-y-4">
            <h5 className="font-medium text-glamour-700">Specializations:</h5>
            {positions.map((position, index) => (
              <div key={index} className="border-l-2 border-glamour-200 pl-4">
                <h6 className="font-medium text-glamour-800 mb-2">{position.position}</h6>
                <div className="space-y-1">
                  {position.services.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{service.name}</span>
                      <span className="text-glamour-600 font-medium">
                        {service.price} AZN ({service.duration}min)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default StaffCard;
