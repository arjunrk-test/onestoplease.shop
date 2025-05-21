import { supabase } from "@/lib/supabaseClient";

export async function logSessionStartIfNeeded(agentEmail: string) {
  const { data: agent, error: agentError } = await supabase
    .from("service_agents")
    .select("id")
    .eq("email", agentEmail)
    .single();

  if (agentError || !agent) return;

  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const { data: openSession } = await supabase
    .from("agent_login_sessions")
    .select("id")
    .eq("agent_id", agent.id)
    .eq("date", today)
    .is("logout_time", null)
    .maybeSingle();

  if (!openSession) {
    await supabase.from("agent_login_sessions").insert([
      {
        agent_id: agent.id,
        login_time: new Date().toISOString(),
        date: today, // 👈 important fix
      },
    ]);
  }
}
