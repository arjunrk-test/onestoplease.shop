"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip";
import { RefObject, useState } from "react";
import { useEffect } from "react";
import { FormData } from "@/app/admin/hooks/useProductManager";

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

  const handleSpecChange = (key: string, value: string) => {
    // Only update if both key and value are non-empty
    if (key.trim() && value.trim()) {
      const newSpecs = { ...(formData.specifications || {}) };
      // Remove any partial matches of the current key
      Object.keys(newSpecs).forEach(existingKey => {
        if (existingKey.startsWith(key.trim()) || key.trim().startsWith(existingKey)) {
          delete newSpecs[existingKey];
        }
      });
      // Add the new specification
      newSpecs[key.trim()] = value.trim();
      
      setFormData(prev => ({
        ...prev,
        specifications: newSpecs
      }));
    }
  };

  const handleKeyFeaturesChange = (value: string) => {
    const features = value.split("\n").filter((line) => line.trim() !== "");
    setFormData((prev) => ({ ...prev, key_features: features }));
  };

  const [specInputs, setSpecInputs] = useState<{ key: string; value: string }[]>([]);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);


  const handleAddSpecField = () => {
    setSpecInputs([...specInputs, { key: "", value: "" }]);
  };

  useEffect(() => {
    if (open) {
      setSpecInputs([]);
      setSecondaryImages([]);
      if (!isEditing) {
        setFormData((prev) => ({ ...prev, specifications: {} }));
      }
    }
  }, [open]);


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-background text-foreground overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-highlight">{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            Add or Edit product details here.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          {/* All original fields preserved */}
          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Name of the product</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <Input
              placeholder="Name"
              value={formData.name}
              className="bg-gray"
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Description of the product</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="h-48 bg-gray"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Category of the product</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <Input
              placeholder="Category"
              value={formData.category}
              readOnly
              className="cursor-not-allowed opacity-60 bg-gray"
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Subcategory of the product (Do not select all)</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <select
              value={formData.subcategory}
              onChange={(e) => handleChange("subcategory", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray text-foreground"
            >
              <option value="" disabled>Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>}
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Price of the product</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <Input
              placeholder="Price"
              type="number"
              value={formData.price}
              className="bg-gray"
              onChange={(e) => handleChange("price", e.target.value)}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Stock of the product</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <Input
              placeholder="Stock"
              type="number"
              value={formData.stock}
              className="bg-gray"
              onChange={(e) => handleChange("stock", e.target.value)}
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>

          {/* Brand and Model Fields */}
          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Brand of the product (Optional)</label>
            </div>
            <Input
              placeholder="Brand"
              value={formData.brand || ""}
              className="bg-gray"
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium">Model of the product (Optional)</label>
            </div>
            <Input
              placeholder="Model"
              value={formData.model || ""}
              className="bg-gray"
              onChange={(e) => handleChange("model", e.target.value)}
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="text-sm font-medium mb-1 block">Key Features (Optional)</label>

            {formData.key_features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const updated = [...formData.key_features!];
                    updated[index] = e.target.value;
                    setFormData((prev) => ({ ...prev, key_features: updated }));
                  }}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1 border p-2 rounded text-sm bg-gray"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.key_features!];
                    updated.splice(index, 1);
                    setFormData((prev) => ({ ...prev, key_features: updated }));
                  }}
                  className="text-red-500 hover:text-red-700 text-xl"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  key_features: [...(prev.key_features || []), ""],
                }))
              }
              className="mt-1 text-blue-500 hover:underline text-sm"
            >
              + Add Key Feature
            </button>
          </div>

          {/* Specifications */}
          <div>
            <label className="text-sm font-medium mb-1 block">Specifications (Optional)</label>
            {specInputs.length > 0 && specInputs.map((spec, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Specification name"
                  value={spec.key}
                  className="bg-gray"
                  onChange={(e) => {
                    const newSpecs = [...specInputs];
                    newSpecs[index].key = e.target.value;
                    setSpecInputs(newSpecs);
                    handleSpecChange(e.target.value, spec.value);
                  }}
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  className="bg-gray"
                  onChange={(e) => {
                    const newSpecs = [...specInputs];
                    newSpecs[index].value = e.target.value;
                    setSpecInputs(newSpecs);
                    handleSpecChange(spec.key, e.target.value);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSpecs = specInputs.filter((_, i) => i !== index);
                    setSpecInputs(newSpecs);
                    const newSpecsObj = { ...formData.specifications };
                    delete newSpecsObj[spec.key];
                    setFormData(prev => ({ ...prev, specifications: newSpecsObj }));
                  }}
                  className="text-red-500 px-2 text-xl hover:text-red-700 "
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSpecField}
              className="mt-1 text-blue-500 hover:underline text-sm"
            >
              + Add Specification
            </button>
          </div>

          {/* File Upload (Main Image) */}
          <div>
          <div className="flex items-center space-x-1">
              <label className="text-sm font-medium mb-1 block">Primary Image (only 1)</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label className="relative cursor-pointer bg-highlight text-foreground font-medium px-4 py-0 rounded-md hover:bg-highlightHover transition">
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

                            if (!isValidType || !isValidSize) {
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
                    Only PNG or SVG files under 500KB, This will be the primary image displayed.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {selectedFile && (
                <div className="flex items-center gap-2 bg-gray h-8 text-grayInverted px-3 py-2 rounded-md">
                  <span className="text-sm max-w-[150px] truncate">{selectedFile.name}</span>
                  <button
                    type="button"
                    className="text-red-600 font-bold text-xl pl-6"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Secondary Images Upload */}
          <div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-medium mb-1 block">Secondary Images (max 4)</label>
              <p className="text-red-500 text-xl">*</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label className="relative cursor-pointer bg-highlight text-foreground font-medium px-4 py-0 rounded-md hover:bg-highlightHover transition">
                      Choose Files
                      <input
                        type="file"
                        accept=".png,.svg"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const validFiles = files.filter(
                            (file) =>
                              ["image/png", "image/svg+xml"].includes(file.type) &&
                              file.size <= 512000
                          );

                          if (validFiles.length + (formData.secondary_image_files?.length || 0) > 4) {
                            alert("You can only upload a total of 4 secondary images.");
                            return;
                          }

                          const fileNames = validFiles.map((file) => file.name);
                          const updatedNames = [...(formData.secondary_image_urls || []), ...fileNames];
                          const updatedFiles = [...(formData.secondary_image_files || []), ...validFiles];

                          setSecondaryImages(updatedNames);
                          setFormData((prev) => ({
                            ...prev,
                            secondary_image_urls: updatedNames,
                            secondary_image_files: updatedFiles,
                          }));
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  </TooltipTrigger>
                  <TooltipContent className="bg-foreground text-background text-xs">
                    Upload up to 4 PNG or SVG images under 500KB each
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Display selected secondary images */}
              {secondaryImages.length > 0 && (
                <div className="flex flex-col w-full mt-2 gap-2">
                  {secondaryImages.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray h-8 text-grayInverted px-3 py-2 rounded-md"
                    >
                      <span className="text-sm truncate">{name}</span>
                      <button
                        type="button"
                        className="text-red-600 font-bold text-xl pl-6"
                        onClick={() => {
                          const updatedNames = [...secondaryImages];
                          updatedNames.splice(index, 1);

                          const updatedFiles = [...(formData.secondary_image_files || [])];
                          updatedFiles.splice(index, 1);

                          setSecondaryImages(updatedNames);
                          setFormData((prev) => ({
                            ...prev,
                            secondary_image_urls: updatedNames,
                            secondary_image_files: updatedFiles,
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.secondary_images && <p className="text-red-500 text-xs mt-1">{errors.secondary_images}</p>}
          </div>

          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
            {isEditing ? "Update" : "Submit"}
          </Button>

          {errors.submit && <p className="text-red-500 text-xs mt-1">{errors.submit}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
