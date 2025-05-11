"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  image_url?: string;
}

export interface FormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  stock: string;
}

export default function useProductManager(category: string, subcategoryList: string[]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category,
    subcategory: "",
    price: "",
    stock: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [selectedSubcategory, setSelectedSubcategory] = useState("All");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*").eq("category", category);

      if (selectedSubcategory !== "All") {
        query = query.eq("subcategory", selectedSubcategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [selectedSubcategory, category]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = `This ${key} field is required`;
    });
    if (!selectedFile && !isEditing) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category,
      subcategory: "",
      price: "",
      stock: "",
    });
    setSelectedFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, description, subcategory, price, stock } = formData;

    let imageUrl = "";
    let newFileName = "";

    try {
      if (selectedFile) {
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const extension = selectedFile.name.split(".").pop()?.toLowerCase();
        newFileName = `${cleanName}.${extension}`;
        const newPath = `${category}/${subcategory}/${newFileName}`;

        // Delete old image if editing and name/category/subcategory changed
        if (isEditing) {
          const oldProduct = products.find((p) => p.id === editingProductId);
          if (oldProduct?.image_url) {
            const oldPath = oldProduct.image_url.split("/storage/v1/object/public/products/")[1];
            if (oldPath && oldPath !== newPath) {
              await supabase.storage.from("products").remove([oldPath]);
            }
          }
        }

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(newPath, selectedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Image upload failed:", uploadError.message);
          setErrors((prev) => ({ ...prev, image: "Failed to upload image." }));
          return;
        }

        imageUrl = supabase.storage.from("products").getPublicUrl(newPath).data.publicUrl;
      }

      if (isEditing && editingProductId) {
        const updateData: any = {
          name,
          description,
          category,
          subcategory,
          price: Number(price),
          stock: Number(stock),
        };
        if (imageUrl) updateData.image_url = imageUrl;

        const { error } = await supabase
          .from("products")
          .update(updateData)
          .eq("id", editingProductId);

        if (error) {
          console.error("Update failed:", error.message);
          setErrors((prev) => ({ ...prev, submit: "Failed to update product." }));
          return;
        }
      } else {
        const { error } = await supabase.from("products").insert([
          {
            name,
            description,
            category,
            subcategory,
            price: Number(price),
            stock: Number(stock),
            image_url: imageUrl,
          },
        ]);

        if (error) {
          console.error("Insert failed:", error.message);
          setErrors((prev) => ({ ...prev, submit: "Failed to add product." }));
          return;
        }
      }

      // Reset and refresh
      setIsDialogOpen(false);
      setIsEditing(false);
      setEditingProductId(null);
      resetForm();

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", category);
      setProducts(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrors((prev) => ({ ...prev, submit: "An unexpected error occurred." }));
    }
  };

  const handleDelete = async (productId: string, imageUrl?: string) => {
    try {
      if (imageUrl) {
        const path = imageUrl.split("/storage/v1/object/public/products/")[1];
        if (path) {
          const { error: removeError } = await supabase.storage.from("products").remove([path]);
          if (removeError) console.error("Failed to delete image:", removeError.message);
        }
      }

      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) {
        console.error("Failed to delete product:", error.message);
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setSelectedFile(null);
    setIsEditing(true);
    setEditingProductId(product.id);
    setIsDialogOpen(true);
  };

  return {
  products,
  loading,
  handleSubmit,
  handleDelete,
  handleEditClick,
  formData,
  setFormData,
  errors,
  selectedFile,
  setSelectedFile,
  isDialogOpen,
  setIsDialogOpen,
  isEditing,
  setIsEditing,
  editingProductId,
  setEditingProductId,
  fileInputRef,
  selectedSubcategory,
  setSelectedSubcategory,
};

}
