"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import {
   TooltipProvider,
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditFurniture() {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const fileInputRef = useRef<HTMLInputElement | null>(null);

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
         executeFunction: addFurniture,
      },
      {
         name: "delete",
         bgColour: "bg-red-500",
         tooltipValue: "Delete Furniture",
         icon: <MdDeleteOutline />,
         executeFunction: () => console.log("Delete clicked"),
      },
      {
         name: "edit",
         bgColour: "bg-yellow-500",
         tooltipValue: "Edit details",
         icon: <CiEdit />,
         executeFunction: () => console.log("Edit clicked"),
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

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      console.log("Form submitted!", { ...formData, image: selectedFile });
      resetForm();
   };

   return (
      <main>
         <h1 className="text-2xl font-bold text-highlight mb-4">Edit Furniture</h1>

         <div className="flex justify-end gap-4 pr-8">
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
