import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, MessageCircle, User, Star, Clock } from "lucide-react";
import { RideHistoryItem } from "@/lib/api-types";

interface RideTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  ride: RideHistoryItem | null;
}

export default function RideTracking({ isOpen, onClose, ride }: RideTrackingProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Driver is on the way");
  const [eta, setEta] = useState<number>(0);
  const [driverDetails, setDriverDetails] = useState({
    name: "John Doe",
    rating: 4.8,
    carModel: "Toyota Camry",
    carColor: "White",
    licensePlate: "KA 01 AB 1234",
    phoneNumber: "+91 98765 43210",
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  });

  // Simulate ride progress
  useEffect(() => {
    if (!isOpen || !ride) return;

    // Reset progress when modal opens
    setProgress(0);
    
    // Calculate estimated arrival time based on ride duration
    const duration = parseInt(ride.duration);
    setEta(duration);

    // Simulate driver arriving
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("Arrived at destination");
          return 100;
        }
        
        // Update status based on progress
        if (prev === 0) {
          setStatus("Driver is on the way");
        } else if (prev === 20) {
          setStatus("Driver has arrived at pickup location");
        } else if (prev === 40) {
          setStatus("Ride in progress");
        } else if (prev === 80) {
          setStatus("Approaching destination");
        }
        
        // Update ETA
        const remainingTime = Math.ceil(duration * (1 - prev / 100));
        setEta(remainingTime);
        
        return prev + 1;
      });
    }, duration * 10); // Compress the journey into a shorter timeframe for demo

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, ride]);

  if (!ride) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ride in Progress</DialogTitle>
          <DialogDescription>Track your ride in real-time</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status section */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-lg">{status}</h3>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">ETA: {eta} min</span>
            </div>
            <Progress value={progress} className="mt-3 h-2" />
          </div>

          {/* Driver details */}
          <div>
            <h4 className="font-medium mb-2">Driver Details</h4>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-muted mr-3 overflow-hidden">
                <img src={driverDetails.photo} alt="Driver" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="font-medium">{driverDetails.name}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400 mr-1" />
                  {driverDetails.rating}
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle details */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vehicle</span>
              <span>{driverDetails.carModel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Color</span>
              <span>{driverDetails.carColor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">License Plate</span>
              <span>{driverDetails.licensePlate}</span>
            </div>
          </div>

          <Separator />

          {/* Route details */}
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-3">
                <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                <div className="w-0.5 h-full bg-muted-foreground/20 my-1 flex-grow"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-accent"></div>
              </div>
              
              <div className="flex-1">
                <div className="mb-2">
                  <div className="font-medium text-sm">Pickup</div>
                  <div className="text-sm text-muted-foreground">{ride.pickupLocation}</div>
                </div>
                
                <div>
                  <div className="font-medium text-sm">Destination</div>
                  <div className="text-sm text-muted-foreground">{ride.dropoffLocation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}