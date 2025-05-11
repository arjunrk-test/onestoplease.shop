"use client";
import { IoBedOutline } from "react-icons/io5";
import ProductGrid from "@/components/ProductGrid";

const subcategories = [
  { key: "livingroom", label: "Living Room" },
  { key: "kitchen", label: "Kitchen & Dining" },
  { key: "bedroom", label: "Bedroom" },
  { key: "work", label: "Work" },
];

export default function Furniture() {
  return (
    <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
          <IoBedOutline className="text-highlight text-3xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-lg font-semibold">Furniture on Rent</span>
          <p className="text-sm text-muted">Style your space effortlessly—rent premium furniture today!</p>
        </div>
      </div>

      <ProductGrid category="Furniture" subcategories={subcategories} />
    </main>
  );
}
