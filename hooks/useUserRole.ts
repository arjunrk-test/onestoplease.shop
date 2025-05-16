// hooks/useUserRole.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "admin" | "agent" | "user";

export function useUserRole() {
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      if (!email) {
        setRole("user");
        setLoading(false);
        return;
      }

      // Check if the user is an admin
      const { data: admin } = await supabase
        .from("admins")
        .select("id")
        .eq("email", email)
        .single();

      if (admin) {
        setRole("admin");
        setLoading(false);
        return;
      }

      // Check if the user is a service agent
      const { data: agent } = await supabase
        .from("service_agents")
        .select("id")
        .eq("email", email)
        .single();

      if (agent) {
        setRole("agent");
        setLoading(false);
        return;
      }

      setRole("user");
      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
}
