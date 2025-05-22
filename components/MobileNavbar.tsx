"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosCart } from "react-icons/io";
import { FaDoorClosed } from "react-icons/fa";
import { useCartStore } from "@/lib/cartStore";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import { useUserRole } from "@/hooks/useUserRole";
import { Locations } from "@/app/constants";
import { Input } from "./ui/input";
import ThemeToggle from "./ThemeToogle";
import OtpLoginDialog from "./OtpLoginDialog";
import MobileOtpLoginDialog from "./MobileOtpLoginDialog";
import ProfileDropdown from "./ProfileDropdown";
import useIsMobile from "@/hooks/useIsMobile";

export default function MobileNavbar() {
  const [location, setLocation] = useState("Chennai");
  const isMobile = useIsMobile();


  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const { user } = useSupabaseUser();
  const openLogin = useLoginDialog((state) => state.open);
  const { role, loading } = useUserRole();

  return (
    <nav className="w-full sticky top-0 z-50 bg-gray shadow-sm px-2 py-2 space-y-2">
      {/* Top Row: Logo + Location | Icons */}
      <div className="flex items-center justify-between">
        {/* Left: Logo + Location */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="OneStopLease Logo"
              width={48}
              height={48}
              className="rounded"
            />
          </Link>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border bg-white border-highlight px-3 py-1 rounded-md text-sm h-9"
          >
            {Locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Theme, Cart, Profile/Login */}
        <div className="flex items-center gap-4">
          <div className="scale-90">
            <ThemeToggle />
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <IoIosCart className="text-2xl text-highlight" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth / Profile */}
          {user && role === "user" && !loading ? (
            <ProfileDropdown type="mobile" />
          ) : (
            <FaDoorClosed
              className="flex items-center ml-2 mr-2 focus:ring-0 focus:outline-none focus-visible:ring-0 text-2xl text-highlight cursor-pointer"
              onClick={() => openLogin()}
            />
          )}

        </div>
      </div>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search for furniture, appliances..."
        className="border border-highlight bg-white h-9 px-3 py-1 text-sm rounded-md w-full"
      />

      {/* Login Dialogs */}
      <>
        {isMobile ? <MobileOtpLoginDialog /> : <OtpLoginDialog />}
      </>
    </nav>
  );
}
