"use client"
import { PiBabyCarriageLight } from "react-icons/pi";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Product {
   id: number;
   name: string;
   price: number;
   image_url: string;
   category: string;
   subCategory: string;
}

export default function BabyProducts(){

   const [babyFurniture, setBabyFurniture] = useState<Product[]>( [] );
   const [kidsBikes, setKidsBikes] = useState<Product[]>( [] );

   useEffect(() => {
      const fetchBabyFurniture = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Baby")
            .eq("subcategory", "Babyfurniture");

         if (error) {
            console.error("Error fetching baby products:", error);
         } else {
            setBabyFurniture(data || []);
         }
      };

      fetchBabyFurniture();
   }, []);

   useEffect(() => {
      const fetchKidsBikes = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Baby")
            .eq("subcategory", "Kidsbikes");

         if (error) {
            console.error("Error fetching baby products:", error);
         } else {
            setKidsBikes(data || []);
         }
      };

      fetchKidsBikes();
   }, []);

   return (
            <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
                     <PiBabyCarriageLight className="text-highlight text-3xl" />
                  </div>
      
                  <div className="flex flex-col">
                     <span className="text-foreground text-lg font-semibold">
                        Baby & Kids products on Rent
                     </span>
                     <p className="text-sm text-muted">
                        Make parenting easier—rent top-quality baby & kids essentials hassle-free!
                     </p>
                  </div>
               </div>
      
               <Tabs defaultValue="babyFurniture" className="w-full mt-8">
                  <TabsList className="grid w-full grid-cols-2 bg-highlight">
      
                     <TabsTrigger value="babyFurniture" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Baby&nbsp;Furniture</TabsTrigger>
      
                     <TabsTrigger value="kidsBikes" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Kids&nbsp;Bikes</TabsTrigger>
      
                  </TabsList>
      
                  <TabsContent value="babyFurniture" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {babyFurniture.map((product) => (
                     <div key={product.id} className="bg-white text-black/80 rounded-lg shadow p-4 w-full aspect-square">
                        <img
                           src={product.image_url}
                           alt={product.name}
                           className="max-w-full max-h-full object-contain rounded"
                        />
                        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">₹{product.price} / month</p>
                     </div>
                  ))}
               </div>
            </TabsContent>
      
                  <TabsContent value="kidsBikes" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {kidsBikes.map((product) => (
                     <div key={product.id} className="bg-white text-black/80 rounded-lg shadow p-4 w-full aspect-square">
                        <img
                           src={product.image_url}
                           alt={product.name}
                           className="max-w-full max-h-full object-contain rounded"
                        />
                        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">₹{product.price} / month</p>
                     </div>
                  ))}
               </div>
            </TabsContent>
      
               </Tabs>
            </main>
         );
}