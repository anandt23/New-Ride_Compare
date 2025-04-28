import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import SideMenu from "@/components/side-menu";
import FooterNav from "@/components/footer-nav";
import { useToast } from "@/hooks/use-toast";
import { SavedPlace } from "@/lib/api-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Home, Briefcase, MapPin, Plus, Loader2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const placeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
});

type PlaceFormData = z.infer<typeof placeSchema>;

export default function PlacesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState<number | null>(null);
  
  const { data: places, isLoading } = useQuery<SavedPlace[]>({
    queryKey: ['/api/places'],
    enabled: !!user,
  });
  
  const form = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
    },
  });
  
  const addPlaceMutation = useMutation({
    mutationFn: async (data: PlaceFormData) => {
      const res = await apiRequest("POST", "/api/places", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/places'] });
      setIsAddPlaceOpen(false);
      form.reset();
      toast({
        title: "Place saved",
        description: "Your location has been saved successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save place",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const deletePlaceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/places/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/places'] });
      setPlaceToDelete(null);
      toast({
        title: "Place deleted",
        description: "Your saved location has been deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete place",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: PlaceFormData) => {
    addPlaceMutation.mutate(data);
  };
  
  const handleDeletePlace = (id: number) => {
    setPlaceToDelete(id);
  };
  
  const confirmDelete = () => {
    if (placeToDelete) {
      deletePlaceMutation.mutate(placeToDelete);
    }
  };
  
  const getPlaceIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('home')) return <Home className="h-4 w-4" />;
    if (lowerName.includes('work') || lowerName.includes('office')) return <Briefcase className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };
  
  return (
    <div className="app min-h-screen flex flex-col bg-light">
      <Header onMenuClick={() => setIsSideMenuOpen(true)} title="Saved Places" />
      
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
      
      <main className="flex-1 p-4 pb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Your saved locations</h2>
          
          <Dialog open={isAddPlaceOpen} onOpenChange={setIsAddPlaceOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Place</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Home, Work, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Full address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input placeholder="Latitude" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input placeholder="Longitude" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={addPlaceMutation.isPending}
                      className="w-full"
                    >
                      {addPlaceMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Save Place
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : !places?.length ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-muted rounded-full p-3 mb-3">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No saved places</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save your frequent locations for faster booking
            </p>
            <Button onClick={() => setIsAddPlaceOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Add Your First Place
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              {places.map((place, index) => (
                <div key={place.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        {getPlaceIcon(place.name)}
                      </div>
                      <div>
                        <h3 className="font-medium">{place.name}</h3>
                        <p className="text-sm text-muted-foreground">{place.address}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeletePlace(place.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  
                  {index < places.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
      
      <AlertDialog open={!!placeToDelete} onOpenChange={(open) => !open && setPlaceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this saved place.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deletePlaceMutation.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {deletePlaceMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <FooterNav />
    </div>
  );
}
