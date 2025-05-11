"use client";
import { IoBedOutline } from "react-icons/io5";
import ProductGrid from "@/components/ProductGrid";

const subcategories = [
  { key: "smartphones", label: "Smart Phones" },
  { key: "laptops", label: "Laptops" },
];

export default function Electronics() {
  return (
    <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
          <IoBedOutline className="text-highlight text-3xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-lg font-semibold">Electronics on Rent</span>
          <p className="text-sm text-muted">Power up your life with gadgets you need, when you need them.</p>
        </div>
      </div>

      <ProductGrid category="Electronics" subcategories={subcategories} />
    </main>
  );
}
