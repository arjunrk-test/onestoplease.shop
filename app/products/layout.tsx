// app/products/layout.tsx
import Navbar from "@/components/Navbar";  
import PagesNav from "@/components/PagesNav"; 
import React from "react";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* <div className="h-4" /> */}
      <PagesNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
