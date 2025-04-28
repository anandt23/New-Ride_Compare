import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Header({ onMenuClick, title = "RideCompare" }: HeaderProps) {
  const [, navigate] = useLocation();
  
  return (
    <header className="bg-white px-4 h-[60px] flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-3"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-primary">{title}</h1>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
