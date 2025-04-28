import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";
import SideMenu from "@/components/side-menu";
import FooterNav from "@/components/footer-nav";
import { RideHistoryItem } from "@/lib/api-types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, Check, X, Loader2 } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: rides, isLoading } = useQuery<RideHistoryItem[]>({
    queryKey: ['/api/rides'],
    enabled: !!user,
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'booked':
        return 'bg-primary';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      case 'booked':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const filteredRides = rides 
    ? activeTab === 'all' 
      ? rides
      : rides.filter(ride => ride.status === activeTab)
    : [];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className="app min-h-screen flex flex-col bg-light">
      <Header onMenuClick={() => setIsSideMenuOpen(true)} title="Ride History" />
      
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
      
      <main className="flex-1 p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="booked">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex mb-3">
                      <Skeleton className="h-10 w-10 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredRides.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-muted rounded-full p-3 mb-3">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No ride history</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'all' 
                    ? "You haven't taken any rides yet." 
                    : activeTab === 'completed'
                      ? "You don't have any completed rides."
                      : "You don't have any upcoming rides."}
                </p>
              </div>
            ) : (
              filteredRides.map((ride) => (
                <Card key={ride.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Badge className={`${getStatusColor(ride.status)} mr-2`}>
                          <span className="flex items-center">
                            {getStatusIcon(ride.status)}
                            <span className="ml-1 capitalize">{ride.status}</span>
                          </span>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(ride.timestamp)}
                        </span>
                      </div>
                      <div className="font-semibold">₹{ride.fare}</div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 mb-3">
                      <div className="flex items-start">
                        <div className="min-w-8 flex flex-col items-center mr-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <div className="w-0.5 h-8 bg-muted my-1"></div>
                          <div className="h-2 w-2 rounded-full bg-accent"></div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">From</div>
                          <div className="text-sm text-muted-foreground mb-2">{ride.pickupLocation}</div>
                          
                          <div className="text-sm font-medium mb-1">To</div>
                          <div className="text-sm text-muted-foreground">{ride.dropoffLocation}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <div>
                        {ride.service.charAt(0).toUpperCase() + ride.service.slice(1)} • {ride.rideType}
                      </div>
                      <div>{ride.distance} km • {ride.duration} min</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <FooterNav />
    </div>
  );
}
