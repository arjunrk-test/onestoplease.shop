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
  rejection_reason?: string;
}

export default function RejectedContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRejectedContributions = async () => {
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
    .eq("status", "rejected")
    .eq("assigned_to", agent.name)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rejected contributions:", error.message);
  } else {
    setContributions(data || []);
  }

  setLoading(false);
};

useEffect(() => {
  fetchRejectedContributions();
}, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rejected Contributions</h1>

      {loading ? (
        <p className="text-muted text-center">Loading...</p>
      ) : contributions.length === 0 ? (
        <p className="text-muted text-center">No rejected contributions yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((c) => (
            <div key={c.id} className="bg-background text-foreground rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-highlight mb-2 capitalize">{c.product_name}</h2>
              <p className="text-sm"><strong className="text-accent text-sm">By:</strong> {c.full_name}</p>
              <p className="text-sm"><strong className="text-accent text-sm">Phone:</strong> {c.phone_number}</p>
              <p className="text-sm"><strong className="text-accent text-sm">Address:</strong> {c.address}</p>
              <p className="text-sm"><strong className="text-accent text-sm">Type:</strong> {c.contribution_type}</p>
              <p className="text-sm"><strong className="text-accent text-sm">Description:</strong> {c.description}</p>
              <p className="text-sm text-red-500 mt-2">
                <strong>Rejection Reason:</strong> {c.rejection_reason || "Not provided"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
