"use client";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category: string;
  subcategory: string;
}

interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
}

export default function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  const handleDelete = async () => {
    try {
      // Step 1: Remove image from storage
      const imagePath = product.image_url?.split("/storage/v1/object/public/products/")[1];
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([imagePath]);

        if (storageError) {
          console.error("Image deletion failed:", storageError.message);
          return;
        }
      }

      // Step 2: Remove product from DB
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (deleteError) {
        console.error("Product deletion failed:", deleteError.message);
        return;
      }

      // Step 3: Notify parent to update state
      onDelete(product.id);
    } catch (err) {
      console.error("Unexpected error during deletion:", err);
    }
  };

  return (
    <div className="border border-gray rounded-lg p-4 bg-background shadow-md relative group">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-40 object-cover mb-4 rounded-md"
        />
      )}

      <h3 className="text-lg font-bold text-highlight">{product.name}</h3>
      <p className="text-sm text-foreground mt-1">{product.description}</p>
      <div className="mt-2 text-sm text-muted">
        ₹{product.price} • Stock: {product.stock}
      </div>

      {/* Edit & Delete buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
        >
          <CiEdit className="text-lg" />
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          <MdDeleteOutline className="text-lg" />
        </button>
      </div>
    </div>
  );
}
