import { useEffect, useState, useRef } from "react";
import { Location } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Crosshair, Locate, MapPin, Target } from "lucide-react";
import { useGeolocation } from "@/lib/use-geolocation";
import L from "leaflet";
import { initializeMap, updateMapMarkers, cleanupMap, reverseGeocode } from "@/lib/map-utils";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  pickup: Location | null;
  dropoff: Location | null;
  onPickupChange: (location: Location) => void;
  onDropoffChange: (location: Location) => void;
}

export default function MapView({ pickup, dropoff, onPickupChange, onDropoffChange }: MapViewProps) {
  const { triggerGetLocation } = useGeolocation();
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Initialize map
  useEffect(() => {
    try {
      const mapContainer = document.getElementById('map-container');
      if (mapContainer) {
        const mapInstance = initializeMap('map-container');
        setMap(mapInstance);
        mapRef.current = mapInstance;
        
        // Add click handler to map
        mapInstance.on('click', async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          const address = await reverseGeocode(lat, lng);
          
          // If pickup is not set, set it as pickup
          // Otherwise, set as dropoff
          if (!pickup) {
            onPickupChange({
              latitude: lat,
              longitude: lng,
              address
            });
          } else if (!dropoff) {
            onDropoffChange({
              latitude: lat,
              longitude: lng,
              address
            });
          }
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
    
    return () => {
      cleanupMap();
    };
  }, []);
  
  // Update markers when pickup or dropoff change
  useEffect(() => {
    if (mapRef.current) {
      try {
        updateMapMarkers(mapRef.current, pickup, dropoff);
      } catch (error) {
        console.error("Error updating map markers:", error);
      }
    }
  }, [pickup, dropoff]);
  
  const handleGetCurrentLocation = () => {
    triggerGetLocation(async (location) => {
      if (location) {
        try {
          const address = await reverseGeocode(location.latitude, location.longitude);
          onPickupChange({
            latitude: location.latitude,
            longitude: location.longitude,
            address: address || "Current Location"
          });
        } catch (error) {
          onPickupChange({
            latitude: location.latitude,
            longitude: location.longitude,
            address: "Current Location"
          });
        }
      }
    });
  };
  
  // Handle manually setting pickup/dropoff location
  const [selectingMode, setSelectingMode] = useState<"pickup" | "dropoff" | null>(null);
  
  const handleManualLocationSelect = async (e: L.LeafletMouseEvent) => {
    if (!selectingMode) return;
    
    const { lat, lng } = e.latlng;
    const address = await reverseGeocode(lat, lng);
    
    if (selectingMode === "pickup") {
      onPickupChange({
        latitude: lat,
        longitude: lng,
        address
      });
    } else {
      onDropoffChange({
        latitude: lat,
        longitude: lng,
        address
      });
    }
    
    setSelectingMode(null);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    
    if (selectingMode) {
      mapRef.current.getContainer().style.cursor = 'crosshair';
      mapRef.current.on('click', handleManualLocationSelect);
    } else {
      mapRef.current.getContainer().style.cursor = '';
      mapRef.current.off('click', handleManualLocationSelect);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleManualLocationSelect);
      }
    };
  }, [selectingMode]);

  return (
    <div id="map-container" className="map-container relative">
      {/* Map will be rendered here by Leaflet */}
      
      {/* Instruction overlay during location selection */}
      {selectingMode && (
        <div className="absolute top-0 left-0 right-0 bg-black/70 text-white p-3 text-center z-10">
          <p className="text-sm">
            {selectingMode === "pickup" 
              ? "Tap on the map to set pickup location" 
              : "Tap on the map to set destination"}
          </p>
        </div>
      )}
      
      {/* Location selection controls */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setSelectingMode("pickup")}
                size="icon"
                variant={selectingMode === "pickup" ? "default" : "secondary"}
                className={`w-10 h-10 rounded-full shadow-lg ${selectingMode === "pickup" ? "bg-primary" : ""}`}
              >
                <MapPin className={selectingMode === "pickup" ? "text-white" : "text-primary"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Set pickup location</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setSelectingMode("dropoff")}
                size="icon"
                variant={selectingMode === "dropoff" ? "default" : "secondary"}
                className={`w-10 h-10 rounded-full shadow-lg ${selectingMode === "dropoff" ? "bg-accent" : ""}`}
              >
                <Target className={selectingMode === "dropoff" ? "text-white" : "text-accent"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Set destination location</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Geolocation button */}
      <div className="absolute bottom-4 right-4 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleGetCurrentLocation}
                size="icon"
                variant="secondary"
                className="w-10 h-10 rounded-full shadow-lg"
              >
                <Locate className="text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Use current location</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
