"use client";
import { useEffect, useState } from "react";
import { IoBedOutline } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  subCategory: string;
}

export default function Furniture() {
  const [livingRoom, setLivingRoom] = useState<Product[]>([]);
  const [kitchen, setKitchen] = useState<Product[]>( [] );
  const [work, setWork] = useState<Product[]>( [] );
  const [bedroom, setBedroom] = useState<Product[]>( [] );

  useEffect(() => {
    const fetchLivingRoom = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Furniture")
        .eq("subcategory", "Livingroom");

      if (error) {
        console.error("Error fetching furniture products:", error);
      } else {
        setLivingRoom(data || []);
      }
    };

    fetchLivingRoom();
  }, []);

  useEffect(() => {
   const fetchKitchen = async () => {
     const { data, error } = await supabase
       .from("products")
       .select("*")
       .eq("category", "Furniture")
       .eq("subcategory", "Kitchen");

     if (error) {
       console.error("Error fetching furniture products:", error);
     } else {
       setKitchen(data || []);
     }
   };

   fetchKitchen();
 }, []);

 useEffect(() => {
   const fetchWork = async () => {
     const { data, error } = await supabase
       .from("products")
       .select("*")
       .eq("category", "Furniture")
       .eq("subcategory", "Work");

     if (error) {
       console.error("Error fetching furniture products:", error);
     } else {
       setWork(data || []);
     }
   };

   fetchWork();
 }, []);

 useEffect(() => {
   const fetchBedroom = async () => {
     const { data, error } = await supabase
       .from("products")
       .select("*")
       .eq("category", "Furniture")
       .eq("subcategory", "Bedroom");

     if (error) {
       console.error("Error fetching furniture products:", error);
     } else {
       setBedroom(data || []);
     }
   };

   fetchBedroom();
 }, []);

  return (
    <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
          <IoBedOutline className="text-highlight text-3xl" />
        </div>

        <div className="flex flex-col">
          <span className="text-foreground text-lg font-semibold">
            Furniture on Rent
          </span>
          <p className="text-sm text-muted">
            Style your space effortlessly—rent premium furniture today!
          </p>
        </div>
      </div>

      <Tabs defaultValue="livingroom" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-4 bg-highlight">
          <TabsTrigger value="livingroom" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">
            Living&nbsp;Room
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">
            Kitchen&nbsp;&amp;&nbsp;Dining
          </TabsTrigger>
          <TabsTrigger value="bedroom" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">
            Bedroom
          </TabsTrigger>
          <TabsTrigger value="work" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">
            Work
          </TabsTrigger>
        </TabsList>

        <TabsContent value="livingroom" className="max-h-[500px] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-3 gap-4 mt-4">
            {livingRoom.map((product) => (
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

        {/* Other tabs stay empty for now */}
        <TabsContent value="kitchen" className="max-h-[500px] overflow-y-auto scrollbar-hide">
         <div className="grid grid-cols-3 gap-4 mt-4">
               {kitchen.map((product) => (
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

        <TabsContent value="bedroom" className="max-h-[500px] overflow-y-auto scrollbar-hide">
         <div className="grid grid-cols-3 gap-4 mt-4">
               {bedroom.map((product) => (
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

        <TabsContent value="work" className="max-h-[500px] overflow-y-auto scrollbar-hide"> 
          <div className="grid grid-cols-3 gap-4 mt-4">
               {work.map((product) => (
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
