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

      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (deleteError) {
        console.error("Product deletion failed:", deleteError.message);
        return;
      }

      onDelete(product.id);
    } catch (err) {
      console.error("Unexpected error during deletion:", err);
    }
  };

  return (
    <div className="border border-gray rounded-lg p-4 bg-background shadow-md relative group w-full">
      {product.image_url && (
        <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-md mb-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-w-full bg-white max-h-full object-contain"
          />
        </div>
      )}

      <h3 className="text-lg font-bold text-highlight">{product.name}</h3>
      <p className="text-sm text-foreground mt-1">{product.description}</p>
      <div className="mt-2 text-sm text-muted">
        ₹{product.price} • Stock: {product.stock}
        <div>Subcategory: {product.subcategory}</div>
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
