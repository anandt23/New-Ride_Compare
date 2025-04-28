import { useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Clock, 
  MapPin, 
  Wallet2, 
  Settings, 
  HelpCircle, 
  LogOut
} from "lucide-react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle transition animation
  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        menuRef.current.style.transform = "translateX(0)";
      } else {
        menuRef.current.style.transform = "translateX(-100%)";
      }
    }
  }, [isOpen]);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const isActive = (path: string) => {
    return location === path ? "text-primary font-medium" : "text-gray-700";
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-50">
      <div 
        ref={menuRef} 
        className="w-[80%] max-w-[300px] h-full bg-white shadow-lg transform transition-transform duration-300 -translate-x-full flex flex-col"
      >
        <div className="p-5 border-b border-gray">
          <div className="flex items-center">
            <Avatar className="w-12 h-12 mr-3">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.fullName || user?.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.fullName || user?.username}</h3>
              <p className="text-sm text-gray-500">{user?.email || user?.phone || user?.username}</p>
            </div>
          </div>
        </div>
        
        <nav className="py-4 flex-1">
          <button 
            onClick={() => handleNavigation("/")}
            className={`flex items-center w-full text-left px-5 py-3 ${isActive("/")}`}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </button>
          
          <button 
            onClick={() => handleNavigation("/history")}
            className={`flex items-center w-full text-left px-5 py-3 ${isActive("/history")}`}
          >
            <Clock className="mr-3 h-5 w-5" />
            Ride History
          </button>
          
          <button 
            onClick={() => handleNavigation("/places")}
            className={`flex items-center w-full text-left px-5 py-3 ${isActive("/places")}`}
          >
            <MapPin className="mr-3 h-5 w-5" />
            Saved Places
          </button>
          
          <button 
            className="flex items-center w-full text-left px-5 py-3 text-gray-700"
          >
            <Wallet2 className="mr-3 h-5 w-5" />
            Payment Methods
          </button>
          
          <button 
            onClick={() => handleNavigation("/profile")}
            className={`flex items-center w-full text-left px-5 py-3 ${isActive("/profile")}`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
          
          <button 
            className="flex items-center w-full text-left px-5 py-3 text-gray-700"
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Help & Support
          </button>
        </nav>
        
        <div className="border-t border-gray mt-auto p-5">
          <button 
            className="flex items-center text-red-500"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
