import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Crosshair, Clock, Search } from "lucide-react";
import { Location } from "@/lib/api-types";
import { useGeolocation } from "@/lib/use-geolocation";

interface LocationInputProps {
  pickup: Location | null;
  dropoff: Location | null;
  onPickupChange: (location: Location | null) => void;
  onDropoffChange: (location: Location | null) => void;
}

export default function LocationInput({ pickup, dropoff, onPickupChange, onDropoffChange }: LocationInputProps) {
  const { triggerGetLocation } = useGeolocation();
  const [pickupInput, setPickupInput] = useState(pickup?.address || "");
  const [dropoffInput, setDropoffInput] = useState(dropoff?.address || "");
  
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupInput(e.target.value);
    
    // In a real app, we would use a geocoding service to convert the address to coordinates
    // For now, we'll just update the address
    if (pickup) {
      onPickupChange({
        ...pickup,
        address: e.target.value
      });
    }
  };
  
  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropoffInput(e.target.value);
    
    // In a real app, we would use a geocoding service to convert the address to coordinates
    // For now, we'll just update the address or create a new location if none exists
    if (dropoff) {
      onDropoffChange({
        ...dropoff,
        address: e.target.value
      });
    } else if (e.target.value) {
      // Create a mock location for demo purposes
      onDropoffChange({
        latitude: 12.9716,
        longitude: 77.5946,
        address: e.target.value
      });
    }
  };
  
  const handleGetCurrentLocation = () => {
    triggerGetLocation((location) => {
      if (location) {
        setPickupInput("Current Location");
        onPickupChange({
          latitude: location.latitude,
          longitude: location.longitude,
          address: "Current Location"
        });
      }
    });
  };
  
  return (
    <div className="px-4 py-4 border-b border-gray">
      <div className="flex items-start mb-4">
        <div className="flex flex-col items-center mr-3">
          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
          <div className="w-0.5 h-full bg-muted my-1 flex-grow"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-accent"></div>
        </div>
        
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3 mb-3 flex items-center">
            <Input 
              type="text"
              placeholder="Current location"
              className="bg-transparent border-none p-0 h-auto shadow-none focus-visible:ring-0"
              value={pickupInput}
              onChange={handlePickupChange}
            />
            <Crosshair 
              className="h-5 w-5 text-primary cursor-pointer flex-shrink-0 ml-2" 
              onClick={handleGetCurrentLocation}
            />
          </div>
          
          <div className="bg-muted rounded-lg p-3 flex items-center">
            <Input 
              type="text"
              placeholder="Where to?"
              className="bg-transparent border-none p-0 h-auto shadow-none focus-visible:ring-0"
              value={dropoffInput}
              onChange={handleDropoffChange}
            />
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <button className="flex items-center text-primary">
          <Clock className="mr-1 h-4 w-4" /> Schedule
        </button>
        
        <div className="h-4 border-r border-gray"></div>
        
        <button className="flex items-center text-primary">
          <MapPin className="mr-1 h-4 w-4" /> Saved Places
        </button>
      </div>
    </div>
  );
}
