"use client";
import { useState } from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { IoMdAdd } from "react-icons/io";
import Papa from "papaparse";
import ProductForm from "@/app/admin/components/products/ProductForm";
import ProductGrid from "@/app/admin/components/products/ProductGrid";
import useProductManager from "@/app/admin/hooks/useProductManager";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadViaDriveApi } from "@/app/admin/lib/uploadViaApi";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function FurniturePage() {
  const subcategories = ["All", "Livingroom", "Bedroom", "Kitchen", "Work"];

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
  } = useProductManager("Furniture", subcategories);

  const [sheetUrl, setSheetUrl] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleFetchProducts = async () => {
    try {
      setFetching(true);
      const products = await fetchProductsFromSheet(sheetUrl);
      const filtered = products.filter((p) => p.category === "Furniture");

      let addedCount = 0;
      for (const product of filtered) {
        const { name, category, subcategory } = product;
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/gi, "");

        // Check if already in DB
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("name", name)
          .eq("category", category)
          .eq("subcategory", subcategory);

        if (existing && existing.length > 0) continue;

        // Upload primary image
        const primaryUrl = await uploadViaDriveApi(
          product.image_url,
          "products",
          `${category}/${subcategory}/${cleanName}.png`
        );

        // Upload secondary images
        const secondaryUrls: string[] = [];
        if (product.secondary_image_urls) {
          try {
            const urls = JSON.parse(product.secondary_image_urls);
            for (let i = 0; i < urls.length; i++) {
              const uploaded = await uploadViaDriveApi(
                urls[i],
                "products-secondary",
                `${category}/${subcategory}/${cleanName}/${cleanName}${i + 1}.png`
              );
              if (uploaded) secondaryUrls.push(uploaded);
            }
          } catch (err) {
            console.warn("Secondary image parse failed", err);
          }
        }

        await supabase.from("products").insert([
          {
            id: uuidv4(),
            name,
            description: product.description,
            category,
            subcategory,
            price: parseFloat(product.price),
            stock: parseInt(product.stock),
            image_url: primaryUrl,
            brand: product.brand,
            model: product.model,
            specifications: product.specifications ? JSON.parse(product.specifications) : {},
            key_features: product.key_features ? JSON.parse(product.key_features) : [],
            secondary_image_urls: secondaryUrls,
          },
        ]);
        addedCount++;
      }

      toast.success(`Added ${addedCount} new furniture products.`);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch products from sheet.");
    } finally {
      setFetching(false);
    }
  };

  const fetchProductsFromSheet = async (sheetUrl: string) => {
    const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    const sheetId = match?.[1];
    if (!sheetId) throw new Error("Invalid Google Sheet URL.");

    const sheetCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    const response = await fetch(sheetCsvUrl);
    if (!response.ok) throw new Error("Failed to fetch sheet data");

    const csvText = await response.text();
    return new Promise<any[]>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as any[]),
        error: (error: any) => reject(error),
      });
    });
  };

  const editButtons = [
    {
      name: "add",
      bgColour: "bg-green-500",
      tooltipValue: "Add Furniture",
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
      <div className="flex justify-between items-center mb-4 px-0 sticky top-0">
        <h1 className="text-2xl font-bold text-highlight">Edit Furniture</h1>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Enter Google Sheet URL"
            className="bg-gray text-grayInverted rounded-md px-3 py-2 w-[300px] text-sm"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <Button
            variant="default"
            className="bg-grayInverted text-gray px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
            onClick={handleFetchProducts}
            disabled={fetching}
          >
            {fetching ? "Fetching..." : "Fetch & Add Products"}
          </Button>
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

      <ProductGrid
        products={products}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />

      <ProductForm
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        category="Furniture"
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
