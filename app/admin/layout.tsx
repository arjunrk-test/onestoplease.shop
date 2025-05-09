"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/app/admin/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
        return;
      }

      if (session) {
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("email")
          .eq("email", session.user.email)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          router.push("/admin/login");
          return;
        }

        if (pathname === "/admin/login") {
          router.push("/admin");
          return;
        }

        setIsAuthorized(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-highlight"></div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 m-2 p-6 bg-black/80 text-white rounded-xl shadow-lg overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
