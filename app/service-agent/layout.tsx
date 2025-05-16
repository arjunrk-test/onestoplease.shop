"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/app/service-agent/components/Sidebar";

export default function AgentLayout({
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

      if (!session && pathname !== "/service-agent/login") {
        router.push("/service-agent/login");
        return;
      }

      if (session) {
        const { data: agentData, error: agentError } = await supabase
          .from("service_agents")
          .select("email")
          .eq("email", session.user.email)
          .single();

        if (agentError || !agentData) {
          await supabase.auth.signOut();
          router.push("/service-agent/login");
          return;
        }

        if (pathname === "/service-agent/login") {
          router.push("/service-agent");
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

  if (pathname === "/service-agent/login") {
    return <>{children}</>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 m-2 p-6 bg-black/80 text-white rounded-xl shadow-lg overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
