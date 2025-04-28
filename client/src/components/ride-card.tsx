import { Button } from "@/components/ui/button";
import { Clock, Info, User, Bike } from "lucide-react";

interface RideCardProps {
  ride: {
    service: string;
    rideType: string;
    capacity: number;
    fare: string;
    currency: string;
    estimatedPickupTime: number;
    estimatedDuration: number;
    distance: string;
    deepLink?: string;
  };
  isBestDeal?: boolean;
  onBookNow: () => void;
}

export default function RideCard({ ride, isBestDeal = false, onBookNow }: RideCardProps) {
  const getServiceLogo = (service: string) => {
    switch (service.toLowerCase()) {
      case 'uber':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="platform-logo">
            <path d="M32 64C14.3 64 0 49.7 0 32S14.3 0 32 0s32 14.3 32 32-14.3 32-32 32z" fill="#000"/>
            <path d="M19.4 36.8v6c0 .4.3.7.7.7h2.7c.4 0 .7-.3.7-.7v-6c0-.4-.3-.7-.7-.7h-2.7c-.4 0-.7.3-.7.7zm11.9-17.6v23.6c0 .4.3.7.7.7h2.7c.4 0 .7-.3.7-.7V19.2c0-.4-.3-.7-.7-.7h-2.7c-.4 0-.7.3-.7.7zM43 27.6v15.2c0 .4.3.7.7.7h2.7c.4 0 .7-.3.7-.7V27.6c0-.4-.3-.7-.7-.7h-2.7c-.4 0-.7.3-.7.7z" fill="#fff"/>
          </svg>
        );
      case 'ola':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="platform-logo">
            <circle cx="32" cy="32" r="32" fill="#4B9E5F"/>
            <path d="M32 14c-9.4 0-17 7.6-17 17s7.6 17 17 17 17-7.6 17-17-7.6-17-17-17zm0 28c-6.1 0-11-4.9-11-11s4.9-11 11-11 11 4.9 11 11-4.9 11-11 11z" fill="#fff"/>
          </svg>
        );
      case 'rapido':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="platform-logo">
            <circle cx="32" cy="32" r="32" fill="#F0483E"/>
            <path d="M20 24v16h24V24H20zm12 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" fill="#fff"/>
          </svg>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Info className="h-4 w-4 text-gray-500" />
          </div>
        );
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 mb-4 border ${isBestDeal ? 'border-secondary relative' : 'border-gray'}`}>
      {isBestDeal && (
        <div className="absolute top-0 right-0 transform -translate-y-1/2 bg-secondary text-dark text-xs font-semibold px-2 py-0.5 rounded-md">
          BEST DEAL
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="mr-3 h-8 w-8">
            {getServiceLogo(ride.service)}
          </div>
          <div>
            <h3 className="font-medium">{ride.rideType}</h3>
            <div className="flex items-center text-sm text-gray-500">
              {ride.rideType.toLowerCase().includes('bike') ? (
                <Bike className="h-3.5 w-3.5 mr-1" />
              ) : (
                <User className="h-3.5 w-3.5 mr-1" />
              )}
              {ride.capacity} {ride.capacity > 1 ? 'seats' : 'seat'}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold text-lg">{ride.currency}{ride.fare}</div>
          <div className="text-sm text-gray-500">{ride.estimatedPickupTime} min away</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mb-3">
        <Clock className="h-3.5 w-3.5 inline mr-1" />
        Est. arrival: {new Date(Date.now() + ride.estimatedPickupTime * 60000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} 
        ({ride.estimatedDuration} min trip)
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button onClick={onBookNow} size="sm">
          Book Now
        </Button>
      </div>
    </div>
  );
}
