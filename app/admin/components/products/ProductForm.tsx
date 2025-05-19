"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefObject } from "react";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  category: string;
  subcategories: string[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [key: string]: string };
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  stock: string;
}

export default function ProductForm({
  open,
  onClose,
  category,
  subcategories,
  formData,
  setFormData,
  errors,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  handleSubmit,
  isEditing,
}: ProductFormProps) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-foreground text-background">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
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
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
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
                    <label className="relative cursor-pointer bg-highlight text-white px-4 py-0 rounded-md hover:bg-highlightHover transition">
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
                              return;
                            }

                            if (!isValidSize) {
                              setSelectedFile(null);
                              return;
                            }

                            setSelectedFile(file);
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
                        fileInputRef.current.value = ""; // Clear input
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

          <Button type="submit" className="bg-highlight text-white hover:bg-highlightHover">
            {isEditing ? "Update" : "Submit"}
          </Button>
          {errors.submit && <p className="text-red-500 text-xs mt-1">{errors.submit}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
