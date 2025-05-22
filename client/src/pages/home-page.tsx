import { useState, useEffect } from "react";
import Header from "@/components/header";
import SideMenu from "@/components/side-menu";
import MapView from "@/components/map-view";
import BottomSheet from "@/components/bottom-sheet";
import LocationInput from "@/components/location-input";
import RideTypeSelector from "@/components/ride-type-selector";
import RideList from "@/components/ride-list";
import BookingModal from "@/components/booking-modal";
import RideTracking from "@/components/ride-tracking";
import FooterNav from "@/components/footer-nav";
import ChatSupport from "@/components/chat-support";
import { useGeolocation } from "@/lib/use-geolocation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Location, RideEstimate, RideHistoryItem } from "@/lib/api-types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [selectedRideType, setSelectedRideType] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("price");
  
  const { location: currentLocation, triggerGetLocation } = useGeolocation();
  
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  
  // Get ride history to display past bookings
  const { data: rideHistory } = useQuery<RideHistoryItem[]>({
    queryKey: ['/api/rides'],
    enabled: !!user,
  });
  
  // Use query for ride estimates when both pickup and dropoff are set
  const { data: rideEstimates, isLoading: isLoadingEstimates } = useQuery<RideEstimate[]>({
    queryKey: ['/api/ride-estimates', pickup?.latitude, pickup?.longitude, dropoff?.latitude, dropoff?.longitude],
    enabled: !!(pickup && dropoff),
    queryFn: async () => {
      if (!pickup || !dropoff) return [];
      
      try {
        const res = await apiRequest("POST", "/api/ride-estimates", {
          pickupLatitude: pickup.latitude.toString(),
          pickupLongitude: pickup.longitude.toString(),
          dropoffLatitude: dropoff.latitude.toString(),
          dropoffLongitude: dropoff.longitude.toString()
        });
        return await res.json();
      } catch (error) {
        console.error("Error fetching ride estimates:", error);
        toast({
          title: "Error",
          description: "Failed to fetch ride estimates. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    }
  });
  
  // Save ride to history when booked
  const bookRideMutation = useMutation({
    mutationFn: async (rideDetails: any) => {
      if (!pickup || !dropoff) throw new Error("Pickup and dropoff locations are required");
      
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
      
      const res = await apiRequest("POST", "/api/rides", rideData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Ride Booked",
        description: "Your ride has been booked successfully!",
      });
      setIsBookingModalOpen(false);
      
      // Invalidate ride history query to fetch updated history
      queryClient.invalidateQueries({ queryKey: ['/api/rides'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Set current location as pickup when available
  useEffect(() => {
    if (currentLocation && !pickup) {
      setPickup({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: "Current Location"
      });
    }
  }, [currentLocation, pickup]);
  
  // Get current location on component mount
  useEffect(() => {
    triggerGetLocation();
  }, []);
  
  const handleRideSelect = (ride: any) => {
    setSelectedRide(ride);
    setIsBookingModalOpen(true);
  };
  
  const handleBookRide = () => {
    if (selectedRide) {
      bookRideMutation.mutate(selectedRide);
    }
  };
  
  const filteredRides = rideEstimates
    ? rideEstimates.flatMap(service => 
        service.estimates.map(estimate => ({
          ...estimate,
          service: service.service
        }))
      ).filter(ride => 
        selectedRideType === "all" || 
        ride.rideType.toLowerCase().includes(selectedRideType.toLowerCase())
      ).sort((a, b) => {
        if (sortOption === "price") {
          return parseFloat(a.fare) - parseFloat(b.fare);
        } else if (sortOption === "eta") {
          return a.estimatedPickupTime - b.estimatedPickupTime;
        }
        return 0;
      })
    : [];
  
  return (
    <div className="app min-h-screen flex flex-col bg-light">
      <Header onMenuClick={() => setIsSideMenuOpen(true)} />
      
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col">
        <MapView 
          pickup={pickup}
          dropoff={dropoff}
          onPickupChange={setPickup}
          onDropoffChange={setDropoff}
        />
        
        <BottomSheet>
          <LocationInput 
            pickup={pickup}
            dropoff={dropoff}
            onPickupChange={setPickup}
            onDropoffChange={setDropoff}
          />
          
          <RideTypeSelector 
            selectedType={selectedRideType}
            onTypeChange={setSelectedRideType}
          />
          
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">Sort by:</span>
              <select 
                className="bg-transparent border-none outline-none font-medium ml-1"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="price">Price (lowest)</option>
                <option value="eta">ETA (fastest)</option>
              </select>
            </div>
            <div className="text-sm">
              <span>{filteredRides.length} rides available</span>
            </div>
          </div>
          
          <RideList 
            rides={filteredRides}
            isLoading={isLoadingEstimates}
            onRideSelect={handleRideSelect}
          />
        </BottomSheet>
      </main>
      
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        ride={selectedRide}
        pickup={pickup}
        dropoff={dropoff}
        onConfirm={handleBookRide}
        isLoading={bookRideMutation.isPending}
      />
      
      <ChatSupport />
      <FooterNav />
    </div>
  );
}
