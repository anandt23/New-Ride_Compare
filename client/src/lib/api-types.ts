export interface RideEstimate {
  service: string;
  estimates: Array<{
    rideType: string;
    capacity: number;
    fare: string;
    currency: string;
    estimatedPickupTime: number;
    estimatedDuration: number;
    distance: string;
    deepLink: string;
  }>;
}

export interface SavedPlace {
  id: number;
  userId: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

export interface RideHistoryItem {
  id: number;
  userId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupLatitude: string;
  pickupLongitude: string;
  dropoffLatitude: string;
  dropoffLongitude: string;
  service: string;
  rideType: string;
  fare: string;
  distance: string;
  duration: string;
  timestamp: string;
  status: string;
  paymentMethod?: string;
  driverDetails?: any;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

export interface RideRequest {
  pickupLatitude: string;
  pickupLongitude: string;
  dropoffLatitude: string;
  dropoffLongitude: string;
  pickupLocation: string;
  dropoffLocation: string;
  service: string;
  rideType: string;
  fare: string;
  distance: string;
  duration: string;
  status: string;
  paymentMethod: string;
}
