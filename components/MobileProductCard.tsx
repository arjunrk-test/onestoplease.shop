"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";

interface Product {
   id: string;
   name: string;
   price: number;
   image_url: string;
}

export default function MobileProductCard({ product }: { product: Product }) {
   const addToCart = useCartStore((state) => state.addToCart);
   const { user } = useSupabaseUser();
   const openLogin = useLoginDialog((state) => state.open);
   const [isWishlisted, setIsWishlisted] = useState(false);

   useEffect(() => {
      const fetchWishlistStatus = async () => {
         if (!user) return;
         const { data } = await supabase
            .from("wishlist")
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", product.id)
            .maybeSingle();
         if (data) setIsWishlisted(true);
      };

      fetchWishlistStatus();
   }, [user, product.id]);

   const handleWishlist = async () => {
      if (!user) return openLogin("Please log in to manage your wishlist.");

      if (isWishlisted) {
         const { error } = await supabase
            .from("wishlist")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product.id);
         if (!error) {
            toast.success("Removed from wishlist.");
            setIsWishlisted(false);
         }
      } else {
         const { error } = await supabase.from("wishlist").insert([
            { user_id: user.id, product_id: product.id },
         ]);
         if (!error) {
            toast.success("Added to wishlist.");
            setIsWishlisted(true);
         }
      }
   };

   const handleAddToCart = () => {
      const cartItems = useCartStore.getState().items;
      const alreadyInCart = cartItems.some((item) => item.id === product.id);

      if (alreadyInCart) {
         toast.warning("Item already in cart");
         return;
      }

      addToCart({
         id: product.id,
         name: product.name,
         price: product.price,
         image_url: product.image_url,
         quantity: 1,
      });

      toast.success("Added to cart");
   };

   return (
      <div className="bg-white rounded-lg shadow p-3 w-full flex flex-col gap-3 ">
         <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-36 object-contain rounded"
         />

         <div className="text-sm text-center">
            <h3 className="font-medium text-foreground">{product.name}</h3>
            <p className="text-muted-foreground">₹{product.price} / month</p>
         </div>

         <div className="flex justify-between items-center gap-2">
            <Button
               onClick={handleWishlist}
               className="flex-1 bg-red-100 text-red-600 text-sm py-1 rounded-full"
            >
               {isWishlisted ? (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                    4.42 3 7.5 3c1.74 0 3.41 0.81 
                    4.5 2.09C13.09 3.81 14.76 3 16.5 3 
                    19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                    6.86-8.55 11.54L12 21.35z" />
                     </svg>
                     <span>Saved</span>
                  </>
               ) : (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 010 
                      6.364L12 20.364l7.682-7.682a4.5 
                      4.5 0 00-6.364-6.364L12 
                      7.636l-1.318-1.318a4.5 4.5 0 
                      00-6.364 0z" />
                     </svg>
                     <span>Wishlist</span>
                  </>
               )}
            </Button>
            <Button
               onClick={handleAddToCart}
               className="flex-1 bg-highlight text-white text-sm py-1 rounded-full"
            >
               Add to Cart
            </Button>
         </div>
      </div>
   );
}
