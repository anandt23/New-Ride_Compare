import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";
import SideMenu from "@/components/side-menu";
import FooterNav from "@/components/footer-nav";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, MapPin, LogOut, Settings, HelpCircle, History } from "lucide-react";
import { useLocation } from "wouter";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="app min-h-screen flex flex-col bg-light">
      <Header onMenuClick={() => setIsSideMenuOpen(true)} title="Profile" />
      
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
      
      <main className="flex-1 p-4 pb-20">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {getInitials(user?.fullName || user?.username || '')}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-semibold">
              {user?.fullName || user?.username}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email || user?.phone || user?.username}
            </p>
          </div>
        </div>
        
        {/* Account Settings */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Account Settings</h3>
            <Separator className="mb-4" />
            
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-start px-2">
                <Settings className="mr-3 h-5 w-5 text-gray-500" />
                <span>Edit Profile</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start px-2" onClick={() => navigate("/places")}>
                <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                <span>Saved Places</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start px-2">
                <CreditCard className="mr-3 h-5 w-5 text-gray-500" />
                <span>Payment Methods</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start px-2" onClick={() => navigate("/history")}>
                <History className="mr-3 h-5 w-5 text-gray-500" />
                <span>Ride History</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Support */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Support</h3>
            <Separator className="mb-4" />
            
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-start px-2">
                <HelpCircle className="mr-3 h-5 w-5 text-gray-500" />
                <span>Help & Support</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start px-2">
                <svg className="mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About App</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
              Logging Out...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </>
          )}
        </Button>
      </main>
      
      <FooterNav />
    </div>
  );
}
