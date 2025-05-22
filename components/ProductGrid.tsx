"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  subcategory: string;
}

interface Props {
  category: string;
  subcategories: { key: string; label: string }[];
}

export default function ProductGrid({ category, subcategories }: Props) {
  const [products, setProducts] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const results = await Promise.all(
        subcategories.map(async ({ key }) => {
          const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category", category)
            .eq("subcategory", capitalized);
          if (error) {
            console.error(`Error fetching ${capitalized}:`, error);
            return [key, []];
          }
          return [key, data || []];
        })
      );
      setProducts(Object.fromEntries(results));
    };

    fetchProducts();
  }, [category, subcategories]);

  return (
    <Tabs defaultValue={subcategories[0].key} className="w-full mt-8 sticky top-[224px] z-10">

      <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-highlight  rounded-md">
        {subcategories.map(({ key, label }) => (
          <TabsTrigger
            key={key}
            value={key}
            className="px-4 py-1.5 text-sm rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80"
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
