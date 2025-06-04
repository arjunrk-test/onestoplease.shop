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

export default function ProductDetail() {
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
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  const allImages = [product.image_url, ...(product.secondary_image_urls || [])].filter((img): img is string => Boolean(img));

  return (
    <div className="max-w-full min-h-screen bg-gray text-foreground p-4">
      <div className="grid grid-cols-12 gap-8">
        {/* Thumbnails Column */}
        {allImages.length > 1 && (
          <div className="col-span-1 space-y-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`w-full aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === image ? "border-highlight" : "border-transparent"
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

        {/* Main Image Column */}
        <div className={`${allImages.length > 1 ? 'col-span-5' : 'col-span-6'}`}>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain bg-white"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleWishlist}
              className="flex-1 bg-red-100 text-red-600 hover:bg-red-200"
            >
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-highlight text-white hover:bg-highlightHover"
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Details Column */}
        <div className={`${allImages.length > 1 ? 'col-span-6' : 'col-span-6'}`}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-highlight">{product.name}</h1>
              <p className="text-2xl font-semibold text-highlight mt-2">
                ₹{product.price} / month
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-foreground">{product.description}</p>

              {product.brand && (
                <div className="text-sm">
                  <span className="font-semibold">Brand:</span> {product.brand}
                </div>
              )}

              {product.model && (
                <div className="text-sm">
                  <span className="font-semibold">Model:</span> {product.model}
                </div>
              )}

              {product.key_features && product.key_features.length > 0 && (
                <div className="text-sm">
                  <h3 className="font-semibold mb-2 text-sm">Key Features:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {product.key_features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.entries(product.specifications).length > 0 && (
                <div className="text-sm">
                  <h3 className="font-semibold mb-2">Specifications:</h3>
                  <div className="space-y-1">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-medium text-sm capitalize">{key}:</span>
                        <span className="text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 