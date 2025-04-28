import { Location } from "./api-types";
import L from "leaflet";

// Store map instance globally for reuse
let mapInstance: L.Map | null = null;
let pickupMarker: L.Marker | null = null;
let dropoffMarker: L.Marker | null = null;
let routeLine: L.Polyline | null = null;

/**
 * Create a new map instance or return the existing one
 */
export function initializeMap(elementId: string): L.Map {
  if (mapInstance) return mapInstance;
  
  // Create a new map instance
  mapInstance = L.map(elementId, {
    center: [12.9716, 77.5946], // Default center (Bangalore)
    zoom: 13,
    zoomControl: false
  });
  
  // Add tile layer (map background)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance);
  
  return mapInstance;
}

/**
 * Create custom marker icons
 */
export function createMarkerIcon(type: 'pickup' | 'dropoff'): L.Icon {
  return L.icon({
    iconUrl: type === 'pickup' 
      ? 'https://cdn-icons-png.flaticon.com/512/684/684908.png'
      : 'https://cdn-icons-png.flaticon.com/512/684/684850.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
}

/**
 * Update map markers based on locations
 */
export function updateMapMarkers(
  map: L.Map, 
  pickup: Location | null, 
  dropoff: Location | null
): void {
  if (!map) return;
  
  // Update pickup marker
  if (pickup) {
    const pickupLatLng = L.latLng(pickup.latitude, pickup.longitude);
    
    if (pickupMarker) {
      pickupMarker.setLatLng(pickupLatLng);
    } else {
      pickupMarker = L.marker(pickupLatLng, { 
        icon: createMarkerIcon('pickup'),
        draggable: true
      }).addTo(map);
      
      // Add popup with address
      if (pickup.address) {
        pickupMarker.bindPopup(pickup.address);
      }
    }
    
    // Center map if only pickup is set
    if (!dropoff) {
      map.setView(pickupLatLng, 15);
    }
  } else if (pickupMarker) {
    map.removeLayer(pickupMarker);
    pickupMarker = null;
  }
  
  // Update dropoff marker
  if (dropoff) {
    const dropoffLatLng = L.latLng(dropoff.latitude, dropoff.longitude);
    
    if (dropoffMarker) {
      dropoffMarker.setLatLng(dropoffLatLng);
    } else {
      dropoffMarker = L.marker(dropoffLatLng, { 
        icon: createMarkerIcon('dropoff'),
        draggable: true
      }).addTo(map);
      
      // Add popup with address
      if (dropoff.address) {
        dropoffMarker.bindPopup(dropoff.address);
      }
    }
  } else if (dropoffMarker) {
    map.removeLayer(dropoffMarker);
    dropoffMarker = null;
  }
  
  // Draw route line if both markers are set
  if (pickup && dropoff) {
    drawRouteLine(map, pickup, dropoff);
    
    // Fit map to show both markers
    const bounds = L.latLngBounds(
      L.latLng(pickup.latitude, pickup.longitude),
      L.latLng(dropoff.latitude, dropoff.longitude)
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  } else if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }
}

/**
 * Draw a line between pickup and dropoff
 */
function drawRouteLine(map: L.Map, pickup: Location, dropoff: Location): void {
  const points = [
    L.latLng(pickup.latitude, pickup.longitude),
    L.latLng(dropoff.latitude, dropoff.longitude)
  ];
  
  if (routeLine) {
    routeLine.setLatLngs(points);
  } else {
    routeLine = L.polyline(points, {
      color: '#4A6CF7',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map);
  }
}

/**
 * Get the current map bounds
 */
export function getMapBounds(map: L.Map): { 
  north: number; 
  south: number; 
  east: number; 
  west: number; 
} | null {
  if (!map) return null;
  
  const bounds = map.getBounds();
  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest()
  };
}

/**
 * Get the distance between two coordinates in kilometers
 */
export function getDistance(start: Location, end: Location): number {
  if (!start || !end) return 0;
  
  const startLatLng = L.latLng(start.latitude, start.longitude);
  const endLatLng = L.latLng(end.latitude, end.longitude);
  
  // Distance in meters
  const distanceInMeters = startLatLng.distanceTo(endLatLng);
  
  // Convert to kilometers and round to 1 decimal place
  return Math.round(distanceInMeters / 100) / 10;
}

/**
 * Geocode an address to coordinates
 * Note: In a real app, you would use a geocoding service like Google Maps or Mapbox
 */
export async function geocodeAddress(address: string): Promise<Location | null> {
  // This is a mock function that would normally call a geocoding API
  // For demo purposes, we'll return random coordinates near Bangalore
  
  // Generate random coordinates near Bangalore
  const lat = 12.9716 + (Math.random() - 0.5) * 0.1;
  const lng = 77.5946 + (Math.random() - 0.5) * 0.1;
  
  return {
    latitude: lat,
    longitude: lng,
    address: address,
    accuracy: 1
  };
}

/**
 * Reverse geocode coordinates to an address
 * Note: In a real app, you would use a geocoding service like Google Maps or Mapbox
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // This is a mock function that would normally call a reverse geocoding API
  // For demo purposes, we'll return a placeholder address
  return "Location at coordinates";
}

/**
 * Clean up map resources
 */
export function cleanupMap(): void {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    pickupMarker = null;
    dropoffMarker = null;
    routeLine = null;
  }
}
