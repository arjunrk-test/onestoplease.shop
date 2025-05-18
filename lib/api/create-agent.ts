import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface AgentPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function createServiceAgent({ name, email, phone, password }: AgentPayload) {
  if (!name || !email || !phone || !password) {
    return { error: "Missing required fields" };
  }

  const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return { error: `Auth Error: ${authError.message}` };

  const { error: insertError } = await supabaseAdmin.from("service_agents").insert([
    {
      id: userData.user?.id,
      name,
      email,
      phone,
    },
  ]);

  if (insertError) return { error: `Database Error: ${insertError.message}` };

  return { success: true };
}
