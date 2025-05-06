"use client";
import Link from "next/link";
import { useState } from "react";
import { Locations } from "@/app/constants";
import { Input } from "./ui/input";
import ThemeToggle from "./ThemeToogle";

export default function Navbar() {
  const [location, setLocation] = useState("Chennai"); // Static for now

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

      {/* Placeholder for future login/profile */}
      <div>
        {/* Authentication removed */}
        <button className="text-sm text-highlight border border-highlight px-3 py-1 rounded">
          Login
        </button>
      </div>
    </nav>
  );
}
