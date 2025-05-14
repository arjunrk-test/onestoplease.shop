"use client";

import { useRef, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  productName: string;
}

export default function SingleFileUpload({
  label,
  file,
  setFile,
  accept = ".jpg,.jpeg,.png,.pdf",
  required,
  productName,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };

    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop();
    const safeName = productName.replace(/\s+/g, "").toLowerCase();
    const renamedFile = new File([selected], `${safeName}_bill.${ext}`, {
      type: selected.type,
    });

    setFile(renamedFile);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <Label className="mb-1 text-highlight">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="flex items-center gap-2 flex-wrap">
        <label className="relative cursor-pointer bg-highlight text-white px-4 py-1 rounded-md hover:bg-highlight/80 transition">
          Choose File
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        {file && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md mt-2 cursor-pointer">
                  <span className="text-sm max-w-[150px] truncate">{file.name}</span>
                  <button
                    type="button"
                    className="text-red-600 font-bold text-xl pl-4"
                    onClick={handleRemove}
                  >
                    ×
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white p-2 rounded shadow-lg border max-w-[240px] max-h-[300px] overflow-auto">
                {file.type === "application/pdf" ? (
                  <embed
                    src={preview || ""}
                    type="application/pdf"
                    className="w-[200px] h-[250px]"
                  />
                ) : (
                  <img
                    src={preview || ""}
                    alt="preview"
                    className="max-w-[200px] max-h-[150px] object-contain"
                  />
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
