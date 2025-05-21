"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AutoLogoutTracker() {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        autoLogout();
      }, 20 * 60 * 1000); // 20 minutes
    };

    const autoLogout = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: agent } = await supabase
        .from("service_agents")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!agent) return;

      await supabase
        .from("agent_login_sessions")
        .update({ logout_time: new Date().toISOString() })
        .eq("agent_id", agent.id)
        .is("logout_time", null);

      await supabase.auth.signOut();
      window.location.reload();
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      clearTimeout(timer);
    };
  }, []);

  return null;
}
