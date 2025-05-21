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
import { useLoginDialog } from "@/hooks/useLoginDialog";
import { useUserRole } from "@/hooks/useUserRole";
import Image from "next/image";

export default function Navbar() {
  const [location, setLocation] = useState("Chennai");
  const { user } = useSupabaseUser();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const openLogin = useLoginDialog((state) => state.open);
  const { role, loading } = useUserRole();

  return (
    <nav className="w-full sticky top-0 px-24 py-1 bg-gray shadow-sm flex items-center justify-between gap-6">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-0 text-highlight"
      >
        <Image
          src="/logo.png"
          alt="OneStopLease Logo"
          width={56}
          height={56}
          className="rounded"
        />
        <span className=" text-2xl font-bold">OneStopLease</span>
      </Link>

      {/* Location Dropdown */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border lg:w-36 bg-white border-highlight px-3 py-1 focus:ring-0 focus:outline-none focus-visible:ring-0 rounded-md text-sm h-8 w-48"
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
        <IoIosCart className="text-2xl text-highlight" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
                        {totalItems}
                      </span>
                    )}
      </Link>

      {/* Auth Button / Profile */}
      {user && role === "user" && !loading ? (
        <ProfileDropdown />
      ) : (
        <Button
          onClick={() => openLogin()}
          className="px-6 py-3 h-8 text-md text-white bg-highlight hover:bg-highlightHover"
          variant="default"
        >
          Login
        </Button>
      )}

      {/* Only one shared dialog instance at the bottom */}
      <OtpLoginDialog />
    </nav>
  );
}
