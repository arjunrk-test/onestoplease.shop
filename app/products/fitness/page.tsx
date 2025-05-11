"use client";
import { IoBedOutline } from "react-icons/io5";
import ProductGrid from "@/components/ProductGrid";

const subcategories = [
  { key: "treadmills", label: "Treadmills" },
  { key: "crosstrainers", label: "Cross Trainers" },
  { key: "exercisebikes", label: "Exercise Bikes" },
  { key: "massagers", label: "Massagers" },
];

export default function Fitness() {
  return (
    <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
          <IoBedOutline className="text-highlight text-3xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-lg font-semibold">Fitness equipments on Rent</span>
          <p className="text-sm text-muted">Level up your workouts—rent premium fitness gear today!</p>
        </div>
      </div>

      <ProductGrid category="Fitness" subcategories={subcategories} />
    </main>
  );
}
