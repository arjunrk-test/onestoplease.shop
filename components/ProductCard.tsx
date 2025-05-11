"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: string; // UUID
  name: string;
  price: number;
  image_url: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const user = useSupabaseUser();
  const openLogin = useLoginDialog((state) => state.open);

  const handleWishlist = async () => {
    if (!user) {
      openLogin("Please log in to add items to your wishlist.");
      return;
    }

    // Pre-check for existing wishlist entry
    const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (existing) {
      toast.warning("Already in your wishlist.");
      return;
    }

    const { error } = await supabase.from("wishlist").insert([
      {
        user_id: user.id,
        product_id: product.id,
      },
    ]);

    if (error) {
      console.error("Supabase wishlist error:", error);
      toast.error("Failed to add to wishlist.");
    } else {
      toast.success("Added to wishlist.");
    }
  };

  return (
    <div className="group relative bg-white text-black/80 rounded-lg shadow p-4 w-full aspect-square flex flex-col items-center justify-between">
      <img
        src={product.image_url}
        alt={product.name}
        className="max-w-full max-h-[70%] object-contain rounded"
      />
      <div className="w-full text-center">
        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm">₹{product.price} / month</p>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-opacity duration-300 z-10">
        <TooltipProvider>
          {/* Add to Cart */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  const cartItems = useCartStore.getState().items;
                  const alreadyInCart = cartItems.some((item) => item.id === product.id);

                  if (alreadyInCart) {
                    toast.warning("Item already in cart", {
                      description: "To increase quantity, update it in the cart page.",
                    });
                    return;
                  }

                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: 1,
                  });

                  toast.custom((t) => (
                    <div className="bg-white dark:bg-background border border-border rounded-md shadow-md p-4 flex items-center justify-between gap-4 w-full max-w-sm">
                      <div>
                        <p className="text-sm font-medium text-foreground">Added to cart</p>
                        <p className="text-xs text-foreground">{product.name}</p>
                      </div>
                      <button
                        onClick={() => {
                          router.push("/cart");
                          toast.dismiss(t);
                        }}
                        className="bg-highlight hover:bg-highlight/80 text-white text-xs px-3 py-1 rounded-md"
                      >
                        Go to Cart
                      </button>
                    </div>
                  ));
                }}
                className="bg-black/80 hover:bg-muted p-3 rounded-full shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13l-1.5-7M9 21h6" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/80 text-white">
              <p>Add to Cart</p>
            </TooltipContent>
          </Tooltip>

          {/* Wishlist */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleWishlist}
                className="bg-black/80 hover:bg-muted p-3 rounded-full shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/80 text-white">
              <p>Wishlist</p>
            </TooltipContent>
          </Tooltip>

          {/* View Details */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="bg-black/80 hover:bg-muted p-3 rounded-full shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19 21l-4-4m0 0a7 7 0 10-10 0 7 7 0 0010 0z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/80 text-white">
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
