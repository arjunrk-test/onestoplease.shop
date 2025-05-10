"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

interface Product {
   id: string;
   name: string;
   description: string;
   price: number;
   stock: number;
   image_url?: string;
   subcategory: string;
   category: string;
}

export default function EditFurniture() {

   const subcategories = ["All", "Livingroom", "Bedroom", "Kitchen", "Work", "Baby"];
   const [selectedSubcategory, setSelectedSubcategory] = useState("All");
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [isEditing, setIsEditing] = useState(false);
   const [editingProductId, setEditingProductId] = useState<string | null>(null);
   const [previousProductData, setPreviousProductData] = useState<Product | null>(null);



   //Products fetching and display
   useEffect(() => {
      const fetchProducts = async () => {
         setLoading(true);
         let query = supabase
            .from("products")
            .select("*")
            .eq("category", "Furniture");

         if (selectedSubcategory !== "All") {
            query = query.eq("subcategory", selectedSubcategory);
         }
         const { data, error } = await query;
         if (error) {
            console.error("Error fetching products:", error.message);
         } else {
            setProducts(data);
         }
         setLoading(false);
      };
      fetchProducts();
   }, [selectedSubcategory]);

   const [formData, setFormData] = useState({
      name: "",
      description: "",
      category: "Furniture",
      subcategory: "",
      price: "",
      stock: "",
   });

   const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const addFurniture = () => setIsDialogOpen(true);
   const editButtons = [
      {
         name: "add",
         bgColour: "bg-green-500",
         tooltipValue: "Add Furniture",
         icon: <IoMdAdd />,
         executeFunction: () => {
            resetForm();
            setIsEditing(false);
            setIsDialogOpen(true);
         },
      },
   ];


   const handleChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
   };

   const validateForm = () => {
      const newErrors: { [key: string]: string } = {};
      Object.entries(formData).forEach(([key, value]) => {
         if (!value.trim()) newErrors[key] = `This ${key} field is required`;
      });

      if (!selectedFile) newErrors.image = "Image is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const resetForm = () => {
      setFormData({
         name: "",
         description: "",
         category: "Furniture",
         subcategory: "",
         price: "",
         stock: "",
      });
      setSelectedFile(null);
      setErrors({});
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
         const { name, description, category, subcategory, price, stock } = formData;
         let imageUrl = "";

         // Determine if a new image is uploaded
         if (selectedFile) {
            // If editing, try to delete the old image before uploading the new one
            if (isEditing && editingProductId && previousProductData) {
               const oldCleanName = previousProductData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
               const oldExtension = previousProductData.image_url?.split('.').pop()?.split('?')[0];
               const oldImagePath = `${previousProductData.category}/${previousProductData.subcategory}/${oldCleanName}.${oldExtension}`;

               const { error: deleteError } = await supabase.storage.from("products").remove([oldImagePath]);
               if (deleteError) console.warn("Failed to delete old image:", deleteError.message);
            }

            const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const extension = selectedFile.name.split(".").pop()?.toLowerCase();
            const fileName = `${cleanName}.${extension}`;
            const storagePath = `${category}/${subcategory}/${fileName}`;

            const { error: uploadError } = await supabase.storage
               .from("products")
               .upload(storagePath, selectedFile, {
                  cacheControl: "3600",
                  upsert: true,
               });

            if (uploadError) {
               console.error("Image upload failed:", uploadError.message);
               setErrors((prev) => ({ ...prev, image: "Failed to upload image." }));
               return;
            }

            imageUrl = supabase.storage.from("products").getPublicUrl(storagePath).data.publicUrl;
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

            const { error: updateError } = await supabase
               .from("products")
               .update(updateData)
               .eq("id", editingProductId);

            if (updateError) {
               console.error("Update failed:", updateError.message);
               setErrors((prev) => ({ ...prev, submit: "Failed to update product." }));
               return;
            }
         } else {
            const { error: insertError } = await supabase
               .from("products")
               .insert([
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

            if (insertError) {
               console.error("Insert failed:", insertError.message);
               setErrors((prev) => ({ ...prev, submit: "Failed to add product." }));
               return;
            }
         }

         setIsDialogOpen(false);
         resetForm();
         setIsEditing(false);
         setEditingProductId(null);

         const { data } = await supabase
            .from("products")
            .select("*")
            .eq("category", "Furniture");

         setProducts(data || []);
      } catch (err) {
         console.error("Unexpected error:", err);
         setErrors((prev) => ({ ...prev, submit: "An unexpected error occurred." }));
      }
   };


   return (
      <main className="h-[calc(100vh-64px)] flex flex-col overflow-hidden p-6">
         <div className="flex justify-between items-center mb-4 px-0 sticky top-0">
            <h1 className="text-2xl font-bold text-highlight">Edit Furniture</h1>

            <div className="flex gap-4">
               <TooltipProvider>
                  {editButtons.map((button) => (
                     <Tooltip key={button.name}>
                        <TooltipTrigger asChild>
                           <div
                              onClick={button.executeFunction}
                              className={`${button.bgColour} text-background cursor-pointer p-3 rounded-lg flex items-center justify-center`}
                           >
                              <span className="text-md">{button.icon}</span>
                           </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-foreground text-background">
                           <p>{button.tooltipValue}</p>
                        </TooltipContent>
                     </Tooltip>
                  ))}
               </TooltipProvider>
            </div>
         </div>

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
                     <div key={product.id} className="border border-gray rounded-lg p-4 bg-background shadow-md relative group">
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
                              onClick={() => {
                                 setFormData({
                                    name: product.name,
                                    description: product.description,
                                    category: "Furniture",
                                    subcategory: product.subcategory || "",
                                    price: product.price.toString(),
                                    stock: product.stock.toString(),
                                 });
                                 setSelectedFile(null);
                                 setIsEditing(true);
                                 setEditingProductId(product.id);
                                 setPreviousProductData(product); // ✅ Save for comparing old image
                                 setIsDialogOpen(true);
                              }}


                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                           >
                              <CiEdit className="text-lg" />
                           </button>
                           <button
                              onClick={async () => {
                                 try {
                                    // 1. Delete image from storage
                                    const imagePath = product.image_url
                                       ?.split("/storage/v1/object/public/products/")[1]; // Extract path after bucket
                                    if (imagePath) {
                                       const { error: storageError } = await supabase.storage
                                          .from("products")
                                          .remove([imagePath]);

                                       if (storageError) {
                                          console.error("Image deletion failed:", storageError.message);
                                          return;
                                       }
                                    }

                                    // 2. Delete product from table
                                    const { error: deleteError } = await supabase
                                       .from("products")
                                       .delete()
                                       .eq("id", product.id);

                                    if (deleteError) {
                                       console.error("Product deletion failed:", deleteError.message);
                                       return;
                                    }

                                    // 3. Remove from local state
                                    setProducts((prev) => prev.filter((p) => p.id !== product.id));
                                 } catch (err) {
                                    console.error("Unexpected deletion error:", err);
                                 }
                              }}

                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                           >
                              <MdDeleteOutline className="text-lg" />
                           </button>
                        </div>
                     </div>
                  ))}

               </div>
            )}
         </div>

         <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
               setIsDialogOpen(open);
               if (!open) resetForm();
            }}
         >
            <DialogContent className="max-w-lg bg-foreground text-background">
               <DialogHeader>
                  <DialogTitle>Add Furniture</DialogTitle>
               </DialogHeader>

               <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                  <Input
                     placeholder="Name"
                     value={formData.name}
                     onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

                  <Textarea
                     placeholder="Description"
                     value={formData.description}
                     onChange={(e) => handleChange("description", e.target.value)}
                     className="h-48"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}

                  <Input
                     placeholder="Category"
                     value={formData.category}
                     readOnly
                     className="cursor-not-allowed opacity-60"
                  />
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}

                  <select
                     value={formData.subcategory}
                     onChange={(e) => handleChange("subcategory", e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-foreground text-background"
                  >
                     <option value="" disabled>Select Subcategory</option>
                     <option value="Livingroom">Livingroom</option>
                     <option value="Bedroom">Bedroom</option>
                     <option value="Kitchen">Kitchen</option>
                     <option value="Work">Work</option>
                     <option value="Baby">Baby</option>
                  </select>
                  {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>}

                  <Input
                     placeholder="Price"
                     type="number"
                     value={formData.price}
                     onChange={(e) => handleChange("price", e.target.value)}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}

                  <Input
                     placeholder="Stock"
                     type="number"
                     value={formData.stock}
                     onChange={(e) => handleChange("stock", e.target.value)}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}

                  {/* File Upload */}
                  <div>
                     <div className="flex items-center gap-2">
                        <TooltipProvider>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <label className="relative cursor-pointer bg-highlight text-white px-4 py-0 rounded-md hover:bg-highlight/80 transition">
                                    Choose File
                                    <input
                                       ref={fileInputRef}
                                       type="file"
                                       accept=".png,.svg"
                                       onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                             const isValidType = ["image/png", "image/svg+xml"].includes(file.type);
                                             const isValidSize = file.size <= 512000;

                                             if (!isValidType) {
                                                setSelectedFile(null);
                                                setErrors((prev) => ({
                                                   ...prev,
                                                   image: "Only PNG or SVG files are allowed.",
                                                }));
                                                return;
                                             }

                                             if (!isValidSize) {
                                                setSelectedFile(null);
                                                setErrors((prev) => ({
                                                   ...prev,
                                                   image: "File size must be 500KB or less.",
                                                }));
                                                return;
                                             }

                                             setSelectedFile(file);
                                             setErrors((prev) => ({ ...prev, image: "" }));
                                          }
                                       }}
                                       className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                 </label>
                              </TooltipTrigger>
                              <TooltipContent className="bg-foreground text-background text-xs">
                                 Only PNG or SVG files under 500KB
                              </TooltipContent>
                           </Tooltip>
                        </TooltipProvider>

                        {selectedFile && (
                           <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md">
                              <span className="text-sm max-w-[150px] truncate">{selectedFile.name}</span>
                              <button
                                 type="button"
                                 className="text-red-600 font-bold text-xl pl-6"
                                 onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current) {
                                       fileInputRef.current.value = ""; // clear the input
                                    }
                                 }}
                              >
                                 ×
                              </button>
                           </div>
                        )}
                     </div>
                     {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                  </div>

                  <Button type="submit" className="bg-highlight text-white hover:bg-highlight/80">
                     Submit
                  </Button>
               </form>
            </DialogContent>
         </Dialog>
      </main>
   );
}
