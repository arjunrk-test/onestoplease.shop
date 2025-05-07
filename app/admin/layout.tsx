"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session and not on login page, redirect to login
        if (!session && pathname !== "/admin/login") {
          router.push("/admin/login");
          return;
        }

        // If we have a session, check if user is admin
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

          // If we're on the login page and user is authenticated, redirect to admin dashboard
          if (pathname === "/admin/login") {
            router.push("/admin");
            return;
          }

          // User is authorized
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-highlight"></div>
      </div>
    );
  }

  // Don't render the layout on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Only render admin content if authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
