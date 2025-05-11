"use client";
import { IoBedOutline } from "react-icons/io5";
import ProductGrid from "@/components/ProductGrid";

const subcategories = [
  { key: "babyfurniture", label: "Baby Furniture" },
  { key: "kidsbikes", label: "Kids Bikes" },
];

export default function BabyProducts() {
  return (
    <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
          <IoBedOutline className="text-highlight text-3xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-lg font-semibold">Baby & Kids products on Rent</span>
          <p className="text-sm text-muted">Make parenting easier—rent top-quality baby & kids essentials hassle-free!</p>
        </div>
      </div>

      <ProductGrid category="Baby" subcategories={subcategories} />
    </main>
  );
}
