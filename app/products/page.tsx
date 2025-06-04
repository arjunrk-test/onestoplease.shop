"use client";

import Link from "next/link";
import { CategoriesPath } from "@/app/constants";

function getDescriptionForCategory(name: string) {
   switch (name.toLowerCase()) {
      case "furniture":
         return "Beds, sofas, tables & more";
      case "appliances":
         return "Fridge, oven, washing machine";
      case "electronics":
         return "Mobiles, laptops & gadgets";
      case "vehicles":
         return "Scooters, bikes, cars";
      case "fitness":
         return "Treadmills, bikes & more";
      case "baby":
         return "Cribs, toys & essentials";
      default:
         return "";
   }
}

export default function ProductsPage() {
   return (
      <main className="min-h-screen bg-background text-foreground px-6 py-10">
         <h1 className="text-3xl font-bold mb-8 text-center">Explore Our Categories</h1>

         <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
            {CategoriesPath.map(({ name, icon, pathName }) => {
               const Icon = icon; // convert IconType to actual renderable component

               return (
                  <Link key={pathName} href={pathName}>
                     <div className="bg-foreground text-background dark:bg-muted rounded-xl p-5 cursor-pointer transition-all group flex flex-col items-center text-center shadow hover:shadow-xl hover:shadow-highlight">
                        <div className="text-4xl mb-3 text-highlight group-hover:scale-110 group-hover:text-accent transition-transform">
                           <Icon />
                        </div>
                        <p className="text-base font-semibold text-background">{name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                           {getDescriptionForCategory(name)}
                        </p>
                     </div>
                  </Link>
               )
            })}
         </div>
      </main>
   );
}
