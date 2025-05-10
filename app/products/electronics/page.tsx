"use client";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/ui/tabs"
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

export default function Electronics() {

   const [smartphones, setSmartphones] = useState<Product[]>([]);
   const [laptop, setLaptop] = useState<Product[]>([]);

   useEffect(() => {
      const fetchSmartphones = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Electronics")
            .eq("subcategory", "Smartphones");

         if (error) {
            console.error("Error fetching electronics products:", error);
         } else {
            setSmartphones(data || []);
         }
      };

      fetchSmartphones();
   }, []);

   useEffect(() => {
      const fetchLaptops = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Electronics")
            .eq("subcategory", "Laptops");

         if (error) {
            console.error("Error fetching electronics products:", error);
         } else {
            setLaptop(data || []);
         }
      };

      fetchLaptops();
   }, []);

   return (
      <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
               <HiOutlineDevicePhoneMobile className="text-highlight text-3xl" />
            </div>

            <div className="flex flex-col">
               <span className="text-foreground text-lg font-semibold">
                  Electronics on Rent
               </span>
               <p className="text-sm text-muted">
                  Power up your life with gadgets you need, when you need them.
               </p>
            </div>
         </div>

         <Tabs defaultValue="smartphones" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-2 bg-highlight">
               <TabsTrigger value="smartphones" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Smartphones</TabsTrigger>
               <TabsTrigger value="laptops" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Laptops</TabsTrigger>
            </TabsList>

            <TabsContent value="smartphones" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {smartphones.map((product) => (
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

            <TabsContent value="laptops" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {laptop.map((product) => (
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