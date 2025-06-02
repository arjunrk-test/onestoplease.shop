"use client";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { IoMdAdd } from "react-icons/io";

import ProductForm from "@/app/admin/components/products/ProductForm";
import ProductGrid from "@/app/admin/components/products/ProductGrid";
import useProductManager from "@/app/admin/hooks/useProductManager";

export default function VehiclesPage() {
  const subcategories = ["All", "Scooters", "Bikes", "Cars"];

  const {
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
    fileInputRef,
    editingProductId,
    setEditingProductId,
    selectedSubcategory,
    setSelectedSubcategory,
  } = useProductManager("Vehicles", subcategories);

  const editButtons = [
    {
      name: "add",
      bgColour: "bg-green-500",
      tooltipValue: "Add Vehicles",
      icon: <IoMdAdd />,
      executeFunction: () => {
        setFormData({
          name: "",
          description: "",
          category: "Furniture",
          subcategory: "",
          price: "",
          stock: "",
          brand: "",
          model: "",
          specifications: {},
          key_features: [],
        });
        setSelectedFile(null);
        setIsEditing(false);
        setEditingProductId(null);
        setIsDialogOpen(true);
      },
    },
  ];

  return (
    <main className="h-[calc(100vh-64px)] flex flex-col overflow-hidden p-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4 px-0 sticky top-0">
        <h1 className="text-2xl font-bold text-highlight">Edit Vehicles</h1>
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

      {/* Grid of Products */}
      <ProductGrid
        products={products}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />

      {/* Add/Edit Dialog Form */}
      <ProductForm
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        category="Vehicles"
        subcategories={subcategories}
        formData={formData}
        setFormData={setFormData}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        isEditing={isEditing}
        fileInputRef={fileInputRef}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    </main>
  );
}
