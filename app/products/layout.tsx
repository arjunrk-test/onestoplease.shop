'use client';
import Navbar from "@/components/Navbar";
import PagesNav from "@/components/PagesNav";
import React from "react";
import { usePathname } from "next/navigation";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePagesNav = pathname === "/products"; 

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {!hidePagesNav && <PagesNav />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
