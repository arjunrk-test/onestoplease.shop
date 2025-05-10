"use client"
import { RiEBikeLine } from "react-icons/ri";
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

export default function Vehicles(){

   const [scooters, setScooters] = useState<Product[]>( [] );
   const [bikes, setBikes] = useState<Product[]>( [] );
   const [cars, setCars] = useState<Product[]>( [] );

   useEffect(() => {
      const fetchScooters = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Vehicles")
            .eq("subcategory", "Scooters");

         if (error) {
            console.error("Error fetching vehicles products:", error);
         } else {
            setScooters(data || []);
         }
      };

      fetchScooters();
   }, []);

   useEffect(() => {
      const fetchBikes = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Vehicles")
            .eq("subcategory", "Bikes");

         if (error) {
            console.error("Error fetching vehicles products:", error);
         } else {
            setBikes(data || []);
         }
      };

      fetchBikes();
   }, []);
   
   useEffect(() => {
      const fetchCars = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Vehicles")
            .eq("subcategory", "Cars");

         if (error) {
            console.error("Error fetching vehicles products:", error);
         } else {
            setCars(data || []);
         }
      };

      fetchCars();
   }, []);


   return (
            <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
                     <RiEBikeLine className="text-highlight text-3xl" />
                  </div>
      
                  <div className="flex flex-col">
                     <span className="text-foreground text-lg font-semibold">
                        Vehicles on Rent
                     </span>
                     <p className="text-sm text-muted">
                        Hit the road with ease—rent the perfect ride for any journey!
                     </p>
                  </div>
               </div>
      
               <Tabs defaultValue="scooters" className="w-full mt-8">
                  <TabsList className="grid w-full grid-cols-3 bg-highlight">
      
                     <TabsTrigger value="scooters" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Scooters</TabsTrigger>
      
                     <TabsTrigger value="bikes" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Bikes</TabsTrigger>

                     <TabsTrigger value="cars" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Cars</TabsTrigger>
      
                  </TabsList>
      
                  <TabsContent value="scooters" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {scooters.map((product) => (
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
      
                  <TabsContent value="bikes" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {bikes.map((product) => (
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

                  <TabsContent value="cars" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {cars.map((product) => (
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