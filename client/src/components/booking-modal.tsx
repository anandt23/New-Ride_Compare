import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, User, Bike, MapPin, CreditCard, ChevronDown } from "lucide-react";
import { Location } from "@/lib/api-types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: any;
  pickup: Location | null;
  dropoff: Location | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  ride, 
  pickup, 
  dropoff,
  onConfirm,
  isLoading
}: BookingModalProps) {
  // Mock payment methods
  const [paymentMethod, setPaymentMethod] = useState({
    id: 1,
    type: 'card',
    label: 'Credit Card',
    lastFour: '4589'
  });
  
  // Early return if ride is not selected
  if (!ride) return null;
  
  const getServiceLogo = (service: string) => {
    switch (service.toLowerCase()) {
      case 'uber':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <path d="M32 64C14.3 64 0 49.7 0 32S14.3 0 32 0s32 14.3 32 32-14.3 32-32 32z" fill="#000"/>
            <path d="M19.4 36.8v6c0 .4.3.7.7.7h2.7c.4 0 .7-.3.7-.7v-6c0-.4-.3-.7-.7-.7h-2.7c-.4 0-.7.3-.7.7zm11.9-17.6v23.6c0 .4.3.7.7.7h2.7c.4 0 .7-.3.7-.7V19.2c0-.4-.3-.7-.7-.7h-2.7c-.4 0-.7.3-.7.7zM43 27.6v15.2c0 .4.3.7.7.7h2.7c.4 0 .7-.3.7-.7V27.6c0-.4-.3-.7-.7-.7h-2.7c-.4 0-.7.3-.7.7z" fill="#fff"/>
          </svg>
        );
      case 'ola':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="32" r="32" fill="#4B9E5F"/>
            <path d="M32 14c-9.4 0-17 7.6-17 17s7.6 17 17 17 17-7.6 17-17-7.6-17-17-17zm0 28c-6.1 0-11-4.9-11-11s4.9-11 11-11 11 4.9 11 11-4.9 11-11 11z" fill="#fff"/>
          </svg>
        );
      case 'rapido':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="32" r="32" fill="#F0483E"/>
            <path d="M20 24v16h24V24H20zm12 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" fill="#fff"/>
          </svg>
        );
      default:
        return <div className="h-8 w-8 bg-gray-200 rounded-full" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center mb-4">
          <div className="mr-3">
            {getServiceLogo(ride.service)}
          </div>
          <div>
            <h3 className="font-medium">{ride.rideType}</h3>
            <div className="text-sm text-muted-foreground">
              {ride.rideType.toLowerCase().includes('bike') ? (
                <span className="flex items-center">
                  <Bike className="h-3.5 w-3.5 mr-1" />
                  {ride.capacity} seat
                </span>
              ) : (
                <span className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  {ride.capacity} seats
                </span>
              )} • {ride.estimatedPickupTime} min away
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg mb-4">
          <div className="flex items-start mb-3">
            <div className="flex flex-col items-center mr-3">
              <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
              <div className="w-0.5 h-full bg-muted-foreground/20 my-1 flex-grow"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-accent"></div>
            </div>
            
            <div className="flex-1">
              <div className="mb-2">
                <div className="font-medium text-sm">Pickup</div>
                <div className="text-sm text-muted-foreground">{pickup?.address || "Current Location"}</div>
              </div>
              
              <div>
                <div className="font-medium text-sm">Destination</div>
                <div className="text-sm text-muted-foreground">{dropoff?.address || "Destination Location"}</div>
              </div>
            </div>
          </div>
          
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance:</span>
              <span>{ride.distance} km</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. time:</span>
              <span>{ride.estimatedDuration} min</span>
            </div>
            
            <div className="flex justify-between font-medium">
              <span>Total fare:</span>
              <span>{ride.currency}{ride.fare}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-sm">Payment Method</h4>
          <div className="border border-input rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>••••••• {paymentMethod.lastFour}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:flex-1" onClick={onClose}>
            Cancel
          </Button>
          
          <Button 
            className="sm:flex-1" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
