"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { CategoriesPath } from "@/app/constants";

export default function MobilePagesNav() {
  const pathname = usePathname();
  const currentItem =
    CategoriesPath.find((category) => pathname === category.pathName)?.name ||
    "Home";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CategoriesPath.find(c => c.name === e.target.value);
    if (selected) {
      window.location.href = selected.pathName;
    }
  };

  return (
    <div className="bg-background sticky top-[108px] z-10 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <nav className="text-sm text-highlight truncate">
          <span
            className="cursor-pointer"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Home&nbsp;
          </span>
          <span className="text-foreground">&gt;&nbsp;</span>
          <span className="text-foreground">{currentItem}</span>
        </nav>

        {/* Dropdown aligned right */}
        <select
          value={currentItem}
          onChange={handleChange}
          className="border border-highlight bg-white rounded-md text-sm h-8 px-2"
        >
          {CategoriesPath.map((category) => (
            <option key={category.category} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
