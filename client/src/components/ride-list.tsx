import RideCard from "@/components/ride-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface RideListProps {
  rides: any[];
  isLoading: boolean;
  onRideSelect: (ride: any) => void;
}

export default function RideList({ rides, isLoading, onRideSelect }: RideListProps) {
  if (isLoading) {
    return (
      <div className="px-4 pb-24">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-3 w-3/4 mb-3" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!rides || rides.length === 0) {
    return (
      <div className="px-4 pb-24 flex flex-col items-center justify-center pt-10">
        <div className="flex items-center justify-center bg-muted h-12 w-12 rounded-full mb-3">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No rides available</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Try changing your location or checking back later.
        </p>
      </div>
    );
  }
  
  // Get the lowest fare to mark the best deal
  const getBestDeal = () => {
    const lowestFare = Math.min(...rides.map(ride => parseFloat(ride.fare)));
    return rides.find(ride => parseFloat(ride.fare) === lowestFare);
  };
  
  const bestDeal = getBestDeal();
  
  return (
    <div className="px-4 pb-24">
      {rides.map((ride, index) => (
        <RideCard
          key={`${ride.service}-${ride.rideType}-${index}`}
          ride={ride}
          isBestDeal={bestDeal && ride === bestDeal}
          onBookNow={() => onRideSelect(ride)}
        />
      ))}
    </div>
  );
}
