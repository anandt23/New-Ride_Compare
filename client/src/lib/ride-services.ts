// This file contains the utilities for interacting with ride services APIs

import { apiRequest } from "./queryClient";
import { Location, RideEstimate } from "./api-types";

/**
 * Get ride estimates from all supported services
 */
export async function getRideEstimates(pickup: Location, dropoff: Location): Promise<RideEstimate[]> {
  if (!pickup || !dropoff) {
    throw new Error("Pickup and dropoff locations are required");
  }
  
  try {
    const response = await apiRequest("POST", "/api/ride-estimates", {
      pickupLatitude: pickup.latitude.toString(),
      pickupLongitude: pickup.longitude.toString(),
      dropoffLatitude: dropoff.latitude.toString(),
      dropoffLongitude: dropoff.longitude.toString()
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching ride estimates:", error);
    throw error;
  }
}

/**
 * Book a ride with the selected service
 */
export async function bookRide(
  pickup: Location,
  dropoff: Location,
  rideDetails: {
    service: string;
    rideType: string;
    fare: string;
    distance: string;
    estimatedDuration: number;
  }
): Promise<any> {
  if (!pickup || !dropoff || !rideDetails) {
    throw new Error("Ride details are incomplete");
  }
  
  try {
    const rideData = {
      pickupLatitude: pickup.latitude.toString(),
      pickupLongitude: pickup.longitude.toString(),
      dropoffLatitude: dropoff.latitude.toString(),
      dropoffLongitude: dropoff.longitude.toString(),
      pickupLocation: pickup.address || "Current Location",
      dropoffLocation: dropoff.address || "Destination",
      service: rideDetails.service,
      rideType: rideDetails.rideType,
      fare: rideDetails.fare,
      distance: rideDetails.distance,
      duration: rideDetails.estimatedDuration.toString(),
      status: "booked",
      paymentMethod: "card"
    };
    
    const response = await apiRequest("POST", "/api/rides", rideData);
    return await response.json();
  } catch (error) {
    console.error("Error booking ride:", error);
    throw error;
  }
}

/**
 * Open the appropriate app for completing the booking
 */
export function openRideServiceApp(service: string, deepLink: string): void {
  // In a real implementation, this would use the deep link to open the app
  // For now, we'll just log it
  console.log(`Opening ${service} app with deep link: ${deepLink}`);
  
  // Mock implementation to simulate opening an app
  if (deepLink) {
    window.open(deepLink, '_blank');
  }
  
  // In a real mobile implementation, we would use:
  // For React Native: Linking.openURL(deepLink)
  // For mobile web: window.location.href = deepLink;
}

/**
 * Get service logo URLs by service name
 */
export function getServiceLogoUrl(service: string): string {
  switch (service.toLowerCase()) {
    case 'uber':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/2048px-Uber_App_Icon.svg.png';
    case 'ola':
      return 'https://play-lh.googleusercontent.com/S96EI9Y8GgZQFcF7f3ox0mAQe0ShjZH5mU7MYp3_cH3Y4_aiTDBu2W2_gKeaNLbgYQ';
    case 'rapido':
      return 'https://play-lh.googleusercontent.com/g1wLRu3cZ9CV_UbHYGa9Pk1kaYlPUTgQfIpTbFj6HSS2vn7pBzZosTSPKFWQECdI150';
    default:
      return 'https://via.placeholder.com/30';
  }
}

/**
 * Format currency based on locale
 */
export function formatCurrency(amount: string, currency: string = '₹'): string {
  return `${currency}${amount}`;
}

/**
 * Format time from minutes
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  
  return `${mins} min`;
}

/**
 * Calculate estimated arrival time
 */
export function calculateArrivalTime(etaMinutes: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + etaMinutes);
  
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
