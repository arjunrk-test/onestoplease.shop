"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Contribution {
  id: string;
  product_name: string;
  full_name: string;
  phone_number: string;
  address: string;
  description: string;
  created_at: string;
  contribution_type: string;
}

export default function ApprovedContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedContributions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: agent, error: agentError } = await supabase
    .from("service_agents")
    .select("name")
    .eq("email", user.email)
    .single();

  if (agentError || !agent) {
    console.error("Agent not found");
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("status", "approved")
    .eq("assigned_to", agent.name)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching approved contributions:", error.message);
  } else {
    setContributions(data || []);
  }

  setLoading(false);
};

useEffect(() => {
  fetchApprovedContributions();
}, []);

  return (
    <div>
      <h1 className="text-2xl text-highlight font-bold mb-6">Approved Contributions</h1>

      {loading ? (
        <p className="text-foreground text-center">Loading...</p>
      ) : contributions.length === 0 ? (
        <p className="text-foreground text-center">No approved contributions yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((c) => (
            <div key={c.id} className="bg-gray text-foreground rounded-lg shadow-grayInverted shadow-sm p-4">
              <h2 className="text-lg font-semibold text-highlight mb-2 capitalize">{c.product_name}</h2>
              <p className="text-sm"><strong className="dark:text-blue-500 text-[#4F16F0] text-sm">By:</strong> {c.full_name}</p>
              <p className="text-sm"><strong className="dark:text-blue-500 text-[#4F16F0] text-sm">Phone:</strong> {c.phone_number}</p>
              <p className="text-sm"><strong className="dark:text-blue-500 text-[#4F16F0] text-sm">Address:</strong> {c.address}</p>
              <p className="text-sm"><strong className="dark:text-blue-500 text-[#4F16F0] text-sm">Type:</strong> {c.contribution_type}</p>
              <p className="text-sm"><strong className="dark:text-blue-500 text-[#4F16F0] text-sm">Description:</strong> {c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
