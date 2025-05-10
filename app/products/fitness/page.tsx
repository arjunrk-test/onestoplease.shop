"use client"
import { CiDumbbell } from "react-icons/ci";
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

export default function Fitness() {

   const [treadmills, setTreadmills] = useState<Product[]>([]);
   const [crossTrainers, setCrossTrainers] = useState<Product[]>([]);
   const [exerciseBikes, setExerciseBikes] = useState<Product[]>([]);
   const [massagers, setMassagers] = useState<Product[]>([]);

   useEffect(() => {
      const fetchTreadmills = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Fitness")
            .eq("subcategory", "Treadmills");

         if (error) {
            console.error("Error fetching fitness products:", error);
         } else {
            setTreadmills(data || []);
         }
      };

      fetchTreadmills();
   }, []);

   useEffect(() => {
      const fetchCrosstrainers = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Fitness")
            .eq("subcategory", "Crosstrainers");

         if (error) {
            console.error("Error fetching fitness products:", error);
         } else {
            setCrossTrainers(data || []);
         }
      };

      fetchCrosstrainers();
   }, []);

   useEffect(() => {
      const fetchExercisebikes = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Fitness")
            .eq("subcategory", "Exercisebikes");

         if (error) {
            console.error("Error fetching fitness products:", error);
         } else {
            setExerciseBikes(data || []);
         }
      };

      fetchExercisebikes();
   }, []);

   useEffect(() => {
      const fetchMassagers = async () => {
         const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Fitness")
            .eq("subcategory", "Massagers");

         if (error) {
            console.error("Error fetching fitness products:", error);
         } else {
            setMassagers(data || []);
         }
      };

      fetchMassagers();
   }, []);

   return (
      <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
               <CiDumbbell className="text-highlight text-3xl" />
            </div>

            <div className="flex flex-col">
               <span className="text-foreground text-lg font-semibold">
                  Fitness equipments on Rent
               </span>
               <p className="text-sm text-muted">
                  Level up your workouts—rent premium fitness gear today!
               </p>
            </div>
         </div>

         <Tabs defaultValue="treadmills" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-4 bg-highlight">

               <TabsTrigger value="treadmills" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Treadmills</TabsTrigger>

               <TabsTrigger value="crosstrainers" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Cross&nbsp;Trainers</TabsTrigger>

               <TabsTrigger value="exercisebikes" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Exercise&nbsp;Bikes</TabsTrigger>

               <TabsTrigger value="massagers" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Massagers</TabsTrigger>

            </TabsList>

            <TabsContent value="treadmills" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {treadmills.map((product) => (
                     <div key={product.id} className="bg-white text-black/80 rounded-lg shadow p-4">
                        <img
                           src={product.image_url}
                           alt={product.name}
                           className="w-full h-40 object-cover rounded"
                        />
                        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">₹{product.price} / month</p>
                     </div>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="crosstrainers" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {crossTrainers.map((product) => (
                     <div key={product.id} className="bg-white text-black/80 rounded-lg shadow p-4">
                        <img
                           src={product.image_url}
                           alt={product.name}
                           className="w-full h-40 object-cover rounded"
                        />
                        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">₹{product.price} / month</p>
                     </div>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="exercisebikes" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {exerciseBikes.map((product) => (
                     <div key={product.id} className="bg-white text-black/80 rounded-lg shadow p-4">
                        <img
                           src={product.image_url}
                           alt={product.name}
                           className="w-full h-40 object-cover rounded"
                        />
                        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">₹{product.price} / month</p>
                     </div>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="massagers" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  {massagers.map((product) => (
                     <div key={product.id} className="bg-white text-black/80 rounded-lg shadow p-4">
                        <img
                           src={product.image_url}
                           alt={product.name}
                           className="w-full h-40 object-cover rounded"
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