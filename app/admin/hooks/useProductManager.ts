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
  secondary_image_files?: File[];
  secondary_image_urls?: string[];
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
      if (typeof value === 'string' && !value.trim()) {
        newErrors[key] = `This ${key} field is required`;
      } else if (typeof value === 'number' && value === 0) {
        newErrors[key] = `This ${key} field is required`;
      }
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
    let secondaryImageUrls: string[] = [];

    try {
      // Handle primary image upload
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

      // Handle secondary images upload
      if (formData.secondary_image_files && formData.secondary_image_files.length > 0) {
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const uploadPromises = formData.secondary_image_files.map(async (file: File, index: number) => {
          const extension = file.name.split(".").pop()?.toLowerCase();
          const secondaryFileName = `${cleanName}${index + 1}.${extension}`;
          const secondaryPath = `${category}/${subcategory}/${cleanName}/${secondaryFileName}`;

          const { error: uploadError } = await supabase.storage
            .from("products-secondary")
            .upload(secondaryPath, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) {
            throw new Error(`Failed to upload secondary image ${index + 1}: ${uploadError.message}`);
          }

          return supabase.storage.from("products-secondary").getPublicUrl(secondaryPath).data.publicUrl;
        });

        try {
          secondaryImageUrls = await Promise.all(uploadPromises);
        } catch (error) {
          console.error("Failed to upload secondary images:", error);
          setErrors((prev) => ({ ...prev, submit: "Failed to upload secondary images." }));
          return;
        }
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
        if (secondaryImageUrls.length > 0) updateData.secondary_image_urls = secondaryImageUrls;

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
            secondary_image_urls: secondaryImageUrls,
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
      // Delete primary image
      if (imageUrl) {
        const imagePath = imageUrl.split("/storage/v1/object/public/products/")[1];
        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from("products")
            .remove([imagePath]);

          if (storageError) {
            console.error("Image deletion failed:", storageError.message);
            return;
          }
        }
      }

      // Get product details for secondary images
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (fetchError) {
        console.error("Failed to fetch product:", fetchError.message);
        return;
      }

      // Delete secondary images
      if (product?.secondary_image_urls?.length) {
        const sampleImagePath = product.secondary_image_urls[0].split("/storage/v1/object/public/products-secondary/")[1];
        const folderPath = sampleImagePath.split("/").slice(0, -1).join("/");

        // List all files in the folder
        const { data, error } = await supabase.storage.from("products-secondary").list(folderPath);
        if (error) {
          console.error("Failed to list secondary images:", error.message);
        } else {
          const filesToDelete = data.map(file => `${folderPath}/${file.name}`);
          await supabase.storage.from("products-secondary").remove(filesToDelete);
        }
      }

      // Delete the product record
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) {
        console.error("Product deletion failed:", deleteError.message);
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Unexpected error during deletion:", err);
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
