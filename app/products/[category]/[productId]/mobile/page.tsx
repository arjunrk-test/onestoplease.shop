"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/lib/cartStore";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category: string;
  subcategory: string;
  secondary_image_urls?: string[];
  brand?: string;
  model?: string;
  specifications: Record<string, any>;
  key_features?: string[];
}

export default function MobileProductDetail() {
  const params = useParams() as { productId: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useSupabaseUser();
  const openLogin = useLoginDialog((state) => state.open);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        return;
      }

      setProduct(data);
      setSelectedImage(data.image_url || "");
    };

    fetchProduct();
  }, [params.productId]);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user || !product) return;
      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      if (data) setIsWishlisted(true);
    };

    fetchWishlistStatus();
  }, [user, product]);

  const handleWishlist = async () => {
    if (!user) {
      openLogin("Please log in to manage your wishlist.");
      return;
    }

    if (!product) return;

    if (isWishlisted) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      if (error) {
        toast.error("Failed to remove from wishlist.");
        console.error(error);
      } else {
        toast.success("Removed from wishlist.");
        setIsWishlisted(false);
      }
    } else {
      const { error } = await supabase.from("wishlist").insert([
        { user_id: user.id, product_id: product.id },
      ]);

      if (error) {
        toast.error("Failed to add to wishlist.");
        console.error(error);
      } else {
        toast.success("Added to wishlist.");
        setIsWishlisted(true);
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

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
      image_url: product.image_url || "",
      quantity: 1,
    });

    toast.success("Added to cart");
  };

  if (!product) {
    return <div className="p-4">Loading...</div>;
  }

  const allImages = [product.image_url, ...(product.secondary_image_urls || [])].filter((img): img is string => Boolean(img));

  return (
    <div className="flex flex-col min-h-screen bg-gray text-foreground">
      {/* Image Gallery */}
      <div className="flex p-2 flex-row w-full mb-4 mt-8 z-0" style={{ minHeight: '300px' }}>
        {allImages.length > 1 && (
          <div className="flex flex-col gap-2 w-16 justify-center items-center">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${selectedImage === image ? "border-highlight" : "border-transparent"
                  }`}
              >
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover bg-white"
                />
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
          {/* Top-right icon buttons */}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={handleWishlist}
              className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 shadow"
            >
              {isWishlisted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                  4.42 3 7.5 3c1.74 0 3.41 0.81 
                  4.5 2.09C13.09 3.81 14.76 3 16.5 3 
                  19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                  6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 010 
                    6.364L12 20.364l7.682-7.682a4.5 
                    4.5 0 00-6.364-6.364L12 
                    7.636l-1.318-1.318a4.5 4.5 0 
                    00-6.364 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-highlight hover:bg-highlightHover text-white rounded-full p-2 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13l-1.5-7M9 21h6" />
              </svg>
            </button>
          </div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-contain bg-white"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-6 flex-1 text-sm">
        <div>
          <h1 className="text-2xl font-bold text-highlight">{product.name}</h1>
          <p className="text-xl font-semibold text-highlight mt-2">
            ₹{product.price} / month
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-foreground">{product.description}</p>

          {product.brand && (
            <div>
              <span className="font-semibold text-highlight">Brand:</span> {product.brand}
            </div>
          )}

          {product.model && (
            <div>
              <span className="font-semibold text-highlight">Model:</span> {product.model}
            </div>
          )}


          {product.key_features && product.key_features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-highlight">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.key_features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {Object.entries(product.specifications).length > 0 && (
            <div className="text-sm">
              <h3 className="font-semibold mb-2 text-highlight">Specifications:</h3>
              <div className="space-y-1">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-medium text-sm text-highlight capitalize">{key}:</span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray">
        <div className="flex gap-4">
          <Button
            onClick={handleWishlist}
            className="flex-1 border border-grayInverted bg-red-100 text-red-600 hover:bg-red-200"
          >
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 border border-grayInverted bg-highlight text-foreground hover:bg-highlightHover"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
} 