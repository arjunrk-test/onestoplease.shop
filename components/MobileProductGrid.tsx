"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MobileProductCard from "@/components/MobileProductCard";

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
   selected: string;
}

export default function MobileProductGrid({ category, selected }: Props) {
   const [products, setProducts] = useState<Product[]>([]);

   useEffect(() => {
      const fetchProducts = async () => {
         const sub = selected.charAt(0).toUpperCase() + selected.slice(1);
         const { data } = await supabase
            .from("products")
            .select("*")
            .eq("category", category)
            .eq("subcategory", sub);

         if (!data) return;
         setProducts(data);
      };

      fetchProducts();
   }, [category, selected]);

   return (
      <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12 ">
         {products.map((product) => (
            <MobileProductCard key={product.id} product={product} />
         ))}
      </div>
   );
}
