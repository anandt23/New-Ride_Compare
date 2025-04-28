import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface RideTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function RideTypeSelector({ selectedType, onTypeChange }: RideTypeSelectorProps) {
  const rideTypes = [
    { id: "all", label: "All Rides" },
    { id: "economy", label: "Economy" },
    { id: "premium", label: "Premium" },
    { id: "xl", label: "XL" },
    { id: "bike", label: "Bike" }
  ];
  
  return (
    <div className="px-4 pt-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-6">
          {rideTypes.map((type) => (
            <button
              key={type.id}
              className={`pb-2 font-medium whitespace-nowrap ${
                selectedType === type.id 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-gray-500"
              }`}
              onClick={() => onTypeChange(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
