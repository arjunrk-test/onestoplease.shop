import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface AdminPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function createAdmin({ name, email, phone, password }: AdminPayload) {
  if (!name || !email || !phone || !password) {
    return { error: "Missing required fields" };
  }

  const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return { error: `Auth Error: ${authError.message}` };

  const { error: insertError } = await supabaseAdmin.from("admins").insert([
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
