"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface Contribution {
   id: string;
   product_name: string;
   full_name: string;
   phone_number: string;
   additional_phone: string;
   address: string;
   description: string;
   status: string;
   assigned_to: string | null;
   created_at: string;
   warranty_covered: string;
   landmark: string;
   location_link: string;
   pincode: string;
   contribution_type: string;
}

export default function UnassignedContributionsPage() {
   const [contributions, setContributions] = useState<Contribution[]>([]);
   const [loading, setLoading] = useState(true);
   const fetchUnassignedContributions = async () => {
      setLoading(true);
      const { data, error } = await supabase
         .from("contributions")
         .select("*")
         .eq("status", "pending")
         .is("assigned_to", null)
         .order("created_at", { ascending: false });

      if (error) {
         console.error("Error fetching contributions:", error.message);
      } else {
         setContributions(data || []);
      }
      setLoading(false);
   };

   const handleAssignToMe = async (contributionId: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return;
  }

  const { data: agent, error: agentError } = await supabase
    .from("service_agents")
    .select("name")
    .eq("email", user.email)
    .single();

  if (agentError || !agent) {
    console.error("Agent not found");
    return;
  }

  const { error } = await supabase
  .from("contributions")
  .update({
    assigned_to: agent.name,
    status: "assigned",
  })
  .eq("id", contributionId);


  if (error) {
    console.error("Failed to assign contribution:", error.message);
  } else {
    fetchUnassignedContributions();
  }
};

   useEffect(() => {
      fetchUnassignedContributions();
   }, []);

   return (
      <div>
         <h1 className="text-2xl font-bold mb-6">Unassigned Contributions</h1>
         {loading ? (
            <div className="text-center text-muted">Loading...</div>
         ) : contributions.length === 0 ? (
            <div className="text-center text-muted">No unassigned contributions found.</div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {contributions.map((contribution) => (
                  <div key={contribution.id} className="bg-background text-foreground rounded-lg shadow-md p-4">
                     <h2 className="text-lg font-semibold mb-2 text-highlight capitalize">{contribution.product_name}</h2>

                     <p className="text-sm text-muted mb-1"><strong className="text-accent">By:</strong> {contribution.full_name}</p>
                     <p className="text-sm text-muted mb-1"><strong className="text-accent">Phone:</strong> {"+" + contribution.phone_number}</p>
                     {contribution.additional_phone && (
                        <p className="text-sm text-muted mb-1"><strong className="text-accent">Alt Phone:</strong> {contribution.additional_phone}</p>
                     )}
                     <p className="text-sm text-muted mb-1"><strong className="text-accent">Address:</strong> {contribution.address}</p>
                     <p className="text-sm text-muted mb-1"><strong className="text-accent">Landmark:</strong> {contribution.landmark}</p>
                     <p className="text-sm text-muted mb-1"><strong className="text-accent">Location:</strong> <a href={contribution.location_link} target="_blank" className="text-red-500 underline">View</a></p>
                     <p className="text-sm text-muted mb-1"><strong className="text-accent">Pincode:</strong> {contribution.pincode}</p>
                     <p className="text-sm text-muted mb-1"><strong className="text-accent">Contribution Type:</strong> {contribution.contribution_type}</p>
                     <p className="text-sm text-muted mb-1"><strong className="text-accent">Warranty Covered:</strong> {contribution.warranty_covered ? "Yes" : "No"}</p>
                     <p className="text-sm text-muted mb-3"><strong className="text-accent"   >Description:</strong> {contribution.description}</p>

                     <Button variant="default" className="bg-highlight h-6 text-sm" onClick={() => handleAssignToMe(contribution.id)}>Assign to Me</Button>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
