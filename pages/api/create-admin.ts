import type { NextApiRequest, NextApiResponse } from "next";
import { createAdmin } from "@/lib/api/create-admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, phone, password } = req.body;
  const result = await createAdmin({ name, email, phone, password });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(200).json({ message: "Admin created successfully" });
}
