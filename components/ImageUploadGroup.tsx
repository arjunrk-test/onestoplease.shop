"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  productName: string;
  images: File[];
  setImages: (files: File[]) => void;
}

export default function ImageUploadGroup({
  productName,
  images,
  setImages,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]); // base64 previews

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSize = 2 * 1024 * 1024;

    const renamedFiles = files
      .filter((file) => allowedTypes.includes(file.type) && file.size <= maxSize)
      .map((file, index) => {
        const ext = file.name.split(".").pop();
        const cleanName = productName.replace(/\s+/g, "").toLowerCase();
        return new File([file], `${cleanName}${index + 1}.${ext}`, {
          type: file.type,
        });
      });

    setImages(renamedFiles);

    // Generate preview for tooltips
    renamedFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => {
          const updated = [...prev];
          updated[i] = reader.result as string;
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <Label className="mb-1 text-highlight">
        Upload Product Images (Max 3)
        <span className="text-red-500"> *</span>
      </Label>
      <div className="flex items-center gap-2 flex-wrap">
        <label className="relative cursor-pointer bg-highlight text-white px-4 py-1 rounded-md hover:bg-highlight/80 transition">
          Choose Files
          <Input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        <TooltipProvider>
          {images.map((file, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md mt-2 cursor-pointer">
                  <span className="text-sm max-w-[150px] truncate">{file.name}</span>
                  <button
                    type="button"
                    className="text-red-600 font-bold text-xl pl-4"
                    onClick={() => handleRemove(idx)}
                  >
                    ×
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white p-2 rounded shadow-lg border max-w-[200px]">
                {previews[idx] ? (
                  <img
                    src={previews[idx]}
                    alt="preview"
                    className="max-w-[180px] max-h-[150px] object-contain"
                  />
                ) : (
                  <span>Loading...</span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
