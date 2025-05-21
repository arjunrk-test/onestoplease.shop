'use client';
import Navbar from "@/components/Navbar";
import PagesNav from "@/components/PagesNav";
import React from "react";
import { usePathname } from "next/navigation";
import MobileNavbar from "@/components/MobileNavbar";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePagesNav = pathname === "/products";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="md:hidden">
        <MobileNavbar />
      </div>      {!hidePagesNav && <PagesNav />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
