import { supabase } from "@/lib/supabaseClient";

export async function logAgentAction({
  agentId,
  agentEmail,
  action,
  metadata = {},
}: {
  agentId: string;
  agentEmail: string;
  action: string;
  metadata?: Record<string, any>;
}) {
  // Log the action
  const { error: insertError } = await supabase.from("service_agent_logs").insert([
    {
      agent_id: agentId,
      agent_email: agentEmail,
      action,
      metadata,
    },
  ]);

  if (insertError) {
    console.error("❌ Insert log failed:", insertError.message);
  }

  // Update last_active timestamp
  const { error: updateError } = await supabase
    .from("service_agents")
    .update({ last_active: new Date().toISOString() })
    .eq("id", agentId);

  if (updateError) {
    console.error("❌ Failed to update last_active:", updateError.message);
  }
}
