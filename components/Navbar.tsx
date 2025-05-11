"use client";
import Link from "next/link";
import { useState } from "react";
import { Locations } from "@/app/constants";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToogle";
import OtpLoginDialog from "./OtpLoginDialog";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import ProfileDropdown from "./ProfileDropdown";
import { IoIosCart } from "react-icons/io";
import { useCartStore } from "@/lib/cartStore";

export default function Navbar() {
  const [location, setLocation] = useState("Chennai");
  const user = useSupabaseUser();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="w-full sticky top-0 px-48 py-4 bg-gray shadow-sm flex items-center justify-between gap-6">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-highlight">
        OneStopLease
      </Link>

      {/* Location Dropdown */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border border-highlight px-3 py-1 focus:ring-0 focus:outline-none focus-visible:ring-0 rounded-md text-sm h-8 w-48"
      >
        {Locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search for furniture, appliances..."
        className="border bg-white border-highlight px-4 focus:ring-0 focus:outline-none focus-visible:ring-0 py-2 rounded-md w-1/3 h-8 placeholder:text-sm text-sm"
      />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Cart Button */}
      <Link href="/cart" className="relative">
        <Button variant="default" size="icon" className="relative bg-white h-8">
          <IoIosCart className="text-2xl text-highlight" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </Button>
      </Link>

      {/* Auth Button / Profile */}
      <div>
        {user ? <ProfileDropdown /> : <OtpLoginDialog />}
      </div>
    </nav>
  );
}
