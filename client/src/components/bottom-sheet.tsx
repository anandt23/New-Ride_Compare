import { ReactNode } from "react";

interface BottomSheetProps {
  children: ReactNode;
}

export default function BottomSheet({ children }: BottomSheetProps) {
  return (
    <div className="bg-white flex-1 relative z-20 rounded-t-[20px] shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      {children}
    </div>
  );
}
