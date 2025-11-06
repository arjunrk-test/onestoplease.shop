"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

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

interface PageParams {
  category: string;
  productId: string;
}

export default function ProductDetailPage() {
  const params = useParams() as PageParams | null;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.productId) return;

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.productId)
          .single();

        if (error) throw error;
        if (data) {
          setProduct(data);
          setSelectedImage(data.image_url || "");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.productId]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!product) {
    return <div className="p-8">Product not found</div>;
  }

  // Combine primary and secondary images
  const allImages = [
    product.image_url,
    ...(product.secondary_image_urls || []),
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Panel - Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-white rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === image ? "border-blue-500" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-contain bg-white pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Product Details */}
          <div className="space-y-6 text-foreground">
            <div>
              <h1 className="text-2xl font-bold text-highlight">{product.name}</h1>
              <p className="text-lg font-semibold mt-2">₹{product.price}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-foreground text-sm">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted">Category</p>
                <p className="font-medium text-sm">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Subcategory</p>
                <p className="font-medium text-sm">{product.subcategory}</p>
              </div>
              {product.brand && (
                <div>
                  <p className="text-sm text-muted">Brand</p>
                  <p className="font-medium text-sm">{product.brand}</p>
                </div>
              )}
              {product.model && (
                <div>
                  <p className="text-sm text-muted">Model</p>
                  <p className="font-medium text-sm">{product.model}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted">Stock</p>
                <p className="font-medium text-sm">{product.stock} units</p>
              </div>
            </div>

            {product.key_features && product.key_features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Key Features</h2>
                <ul className="list-disc list-inside space-y-1">
                  {product.key_features.map((feature, index) => (
                    <li key={index} className="text-foreground text-sm">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-muted">{key}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 