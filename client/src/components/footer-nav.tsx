import { useLocation } from "wouter";
import { Home, Clock, MapPin, User } from "lucide-react";

export default function FooterNav() {
  const [location, navigate] = useLocation();
  
  const getTabStyles = (path: string) => {
    const isActive = location === path;
    return {
      tabClass: `py-3 px-5 flex flex-col items-center ${isActive ? 'text-primary' : 'text-gray-500'}`,
      iconClass: "h-5 w-5"
    };
  };
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-20">
      <div className="flex justify-around">
        <button 
          onClick={() => navigate("/")}
          className={getTabStyles("/").tabClass}
        >
          <Home className={getTabStyles("/").iconClass} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          onClick={() => navigate("/history")}
          className={getTabStyles("/history").tabClass}
        >
          <Clock className={getTabStyles("/history").iconClass} />
          <span className="text-xs mt-1">History</span>
        </button>
        
        <button 
          onClick={() => navigate("/places")}
          className={getTabStyles("/places").tabClass}
        >
          <MapPin className={getTabStyles("/places").iconClass} />
          <span className="text-xs mt-1">Places</span>
        </button>
        
        <button 
          onClick={() => navigate("/profile")}
          className={getTabStyles("/profile").tabClass}
        >
          <User className={getTabStyles("/profile").iconClass} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </footer>
  );
}
