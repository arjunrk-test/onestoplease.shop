"use client";
import ProductCard from "./ProductCard";

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

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  subcategories: string[];
  selectedSubcategory: string;
  setSelectedSubcategory: (value: string) => void;
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
}

export default function ProductGrid({
  products,
  loading,
  subcategories,
  selectedSubcategory,
  setSelectedSubcategory,
  onDelete,
  onEdit,
}: ProductGridProps) {
  return (
    <>
      <div className="mb-6 mt-8">
        <label className="mr-2 text-sm font-medium">Filter by Subcategory:</label>
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md bg-background text-foreground text-sm"
        >
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-y-auto mt-4 pr-1 scrollbar-hide">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
