import { useEffect, useState, useRef } from "react";
import { Location } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Crosshair, Locate } from "lucide-react";
import { useGeolocation } from "@/lib/use-geolocation";
import L from "leaflet";
import { initializeMap, updateMapMarkers, cleanupMap, reverseGeocode } from "@/lib/map-utils";
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
  
  return (
    <div id="map-container" className="map-container relative">
      {/* Map will be rendered here by Leaflet */}
      
      {/* Geolocation button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button 
          onClick={handleGetCurrentLocation}
          size="icon"
          variant="secondary"
          className="w-10 h-10 rounded-full shadow-lg"
        >
          <Locate className="text-primary" />
        </Button>
      </div>
    </div>
  );
}
