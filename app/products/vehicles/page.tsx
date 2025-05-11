"use client";
import { IoBedOutline } from "react-icons/io5";
import ProductGrid from "@/components/ProductGrid";

const subcategories = [
  { key: "scooters", label: "Scooters" },
  { key: "bikes", label: "Bikes" },
  { key: "cars", label: "Cars" },
];

export default function Vehicles() {
  return (
    <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
          <IoBedOutline className="text-highlight text-3xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-lg font-semibold">Vehicles on Rent</span>
          <p className="text-sm text-muted">Hit the road with ease—rent the perfect ride for any journey!</p>
        </div>
      </div>

      <ProductGrid category="Vehicles" subcategories={subcategories} />
    </main>
  );
}
