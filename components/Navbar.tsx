"use client";
import Link from "next/link";
import { useState } from "react";
import { Locations } from "@/app/constants";
import { Input } from "./ui/input";
import ThemeToggle from "./ThemeToogle";
import OtpLoginDialog from "./OtpLoginDialog";
import { useSupabaseUser } from "@/hooks/useSupabaseUser"; // We'll create this hook
import ProfileDropdown from "./ProfileDropdown"; // Visible only if user is logged in

export default function Navbar() {
  const [location, setLocation] = useState("Chennai");
  const user = useSupabaseUser(); // Custom hook to get Supabase user

  return (
    <nav className="w-full sticky top-0 px-48 py-4 bg-gray shadow-sm flex items-center justify-between">
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

      <ThemeToggle />

      {/* Auth Button / Profile */}
      <div>
        {user ? <ProfileDropdown /> : <OtpLoginDialog />}
      </div>
    </nav>
  );
}
