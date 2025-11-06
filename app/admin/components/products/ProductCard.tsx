"use client";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { supabase } from "@/lib/supabaseClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation";

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

interface ProductCardProps {
  product: Product;
  onDelete: (productId: string, imageUrl?: string) => void;
  onEdit: (product: Product) => void;
}

export default function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  const router = useRouter();

  const handleDelete = () => {
    onDelete(product.id, product.image_url);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open new tab if clicking on edit or delete buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    window.open(`/admin/products/${product.category}/${product.id}`, '_blank');
  };

  return (
    <div 
      className="border border-gray rounded-lg p-4 bg-gray shadow-md relative group w-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
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
      {/* <p className="text-sm text-foreground mt-1">{product.description}</p> */}
      <div className="mt-2 text-sm text-muted text-foreground">
        ₹{product.price} • Stock: {product.stock}
        <div>Subcategory: {product.subcategory}</div>
        {/* {product.brand && <div>Brand: {product.brand}</div>} */}
        {/* {product.model && <div>Model: {product.model}</div>} */}
        {/* {product.key_features && product.key_features.length > 0 && (
          <div className="mt-1">
            <span className="font-semibold">Key Features:</span>
            <ul className="list-disc list-inside">
              {product.key_features.map((feature, index) => (
                <li key={index} className="text-xs">{feature}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>

      {/* Edit & Delete buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-foreground p-2 rounded"
              >
                <CiEdit className="text-lg" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-grayInverted text-background">
              <p>Edit product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="bg-red-500 hover:bg-red-600 text-foreground p-2 rounded"
              >
                <MdDeleteOutline className="text-lg" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-grayInverted text-background">
              <p>Delete product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
