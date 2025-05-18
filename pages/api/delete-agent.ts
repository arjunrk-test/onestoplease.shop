import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing agent ID" });
  }

  // Step 1: Delete from Auth
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (authError) return res.status(400).json({ error: `Auth Error: ${authError.message}` });

  // Step 2: Delete from table
  const { error: dbError } = await supabaseAdmin.from("service_agents").delete().eq("id", id);
  if (dbError) return res.status(500).json({ error: `DB Error: ${dbError.message}` });

  return res.status(200).json({ message: "Agent deleted successfully" });
}
