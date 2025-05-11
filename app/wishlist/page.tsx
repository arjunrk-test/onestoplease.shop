"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Product {
   id: string; // ✅ UUID
   name: string;
   price: number;
   image_url: string;
}

export default function WishlistPage() {
   const user = useSupabaseUser();
   const router = useRouter();
   const [wishlist, setWishlist] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // 1. Delay until hydration is complete
      if (typeof window === "undefined") return;

      const checkAuthAndFetch = async () => {
         const { data: { session } } = await supabase.auth.getSession();

         if (!session?.user) {
            toast.warning("Please log in to access your wishlist.");
            router.replace("/");
            return;
         }

         const userId = session.user.id;

         const { data, error } = await supabase
            .from("wishlist")
            .select("product_id, products ( id, name, price, image_url )")
            .eq("user_id", userId)
            .returns<{ product_id: string; products: Product }[]>();

         if (error) {
            toast.error("Failed to load wishlist");
            console.error("Wishlist fetch error:", error);
         } else {
            const products = data.map((entry) => entry.products);
            setWishlist(products);
         }

         setLoading(false);
      };

      checkAuthAndFetch();
   }, []);


   const handleRemove = async (productId: string) => {
      const { error } = await supabase
         .from("wishlist")
         .delete()
         .eq("user_id", user?.id)
         .eq("product_id", productId);

      if (error) {
         toast.error("Failed to remove item");
      } else {
         setWishlist((prev) => prev.filter((p) => p.id !== productId));
         toast.success("Removed from wishlist");
      }
   };

   return (
      <main className="min-h-screen flex flex-col bg-background">
         <Navbar />
         <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Your Wishlist</h1>

            {loading ? (
               <p className="text-muted">Loading...</p>
            ) : wishlist.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-foreground text-xl mb-4">Wishlist is empty.</p>
                  <Button
                     onClick={() => router.push("/products")}
                     className="bg-highlight hover:bg-highlight/80"
                  >
                     Continue Shopping
                  </Button>
               </div>

            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                     <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                     >
                        <img
                           src={product.image_url}
                           alt={product.name}
                           className="w-full h-40 object-contain mb-4"
                        />
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-sm text-muted">₹{product.price}</p>
                        <Button
                           variant="default"
                           className="mt-4 bg-highlight"
                           onClick={() => handleRemove(product.id)}
                        >
                           Remove
                        </Button>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </main>
   );
}
