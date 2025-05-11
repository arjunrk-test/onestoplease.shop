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
  subcategory: string;
}

const subcategories = [
  { key: "babyfurniture", label: "Baby Furniture" },
  { key: "kidsbikes", label: "Kids Bikes" },
];

export default function BabyProducts() {
  const [products, setProducts] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    const fetchAllProducts = async () => {
      const promises = subcategories.map(async ({ key, label }) => {
         const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", "Baby")
          .eq("subcategory", capitalizedKey);

        if (error) {
          console.error(`Error fetching ${label} products:`, error);
          return [key, []];
        }
        return [key, data || []];
      });

      const results = await Promise.all(promises);
      setProducts(Object.fromEntries(results));
    };

    fetchAllProducts();
  }, []);

  return (
    <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
          <IoBedOutline className="text-highlight text-3xl" />
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

      <Tabs defaultValue="babyfurniture" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-2 bg-highlight">
          {subcategories.map(({ key, label }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {subcategories.map(({ key }) => (
          <TabsContent
            key={key}
            value={key}
            className="max-h-[500px] overflow-y-auto scrollbar-hide"
          >
            <div className="grid grid-cols-3 gap-4 mt-4">
              {(products[key] || []).map((product) => (
                <div
                  key={product.id}
                  className="bg-white text-black/80 rounded-lg shadow p-4 w-full aspect-square"
                >
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
        ))}
      </Tabs>
    </main>
  );
}
