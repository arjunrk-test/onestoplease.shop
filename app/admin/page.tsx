"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/admin/components/Sidebar";

export default function AdminDashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 m-4 p-6 bg-black text-white rounded-xl shadow-lg">
      </main>
    </div>
  );
}
