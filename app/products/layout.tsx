'use client';
import Navbar from "@/components/Navbar";
import PagesNav from "@/components/PagesNav";
import React from "react";
import { usePathname } from "next/navigation";
import MobileNavbar from "@/components/MobileNavbar";
import useIsMobile from "@/hooks/useIsMobile";
import MobilePagesNav from "@/components/MobilePagesNav";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePagesNav = pathname === "/products";
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      {!hidePagesNav && (isMobile ? <MobilePagesNav /> : <PagesNav />)}
      <main className="flex-1">{children}</main>
    </div>
  );
}
