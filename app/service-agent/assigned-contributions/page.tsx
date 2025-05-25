"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logAgentAction } from "@/lib/logServiceAgents";

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

export default function AssignedContributionsPage() {
   const [contributions, setContributions] = useState<Contribution[]>([]);
   const [loading, setLoading] = useState(true);
   const [approveTarget, setApproveTarget] = useState<Contribution | null>(null);
   const [rejectTarget, setRejectTarget] = useState<Contribution | null>(null);
   const [rejectionReason, setRejectionReason] = useState("");


   const fetchAssignedContributions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         setLoading(false);
         return;
      }

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
         .eq("assigned_to", agent.name)
         .eq("status", "assigned")
         .order("created_at", { ascending: false });

      if (error) {
         console.error("Error fetching assigned contributions:", error.message);
      } else {
         setContributions(data || []);
      }

      setLoading(false);
   };

   const handleUnassign = async (contributionId: string) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
         console.error("Not authenticated");
         return;
      }

      const { data: agent, error: agentError } = await supabase
         .from("service_agents")
         .select("name, id")
         .eq("email", user.email)
         .single();

      if (agentError || !agent) {
         console.error("Agent not found");
         return;
      }

      const { error } = await supabase
         .from("contributions")
         .update({
            assigned_to: null,
            status: "pending",
         })
         .eq("id", contributionId)
         .eq("assigned_to", agent.name);


      if (error) {
         console.error("Failed to unassign:", error.message);
      } else {
         if (!user.email) {
            console.error("Email is missing from user object");
            return;
         }

         await logAgentAction({
            agentId: agent.id,
            agentEmail: user.email,
            action: `Unassigned contribution #${contributionId}`,
            metadata: { contributionId },
         });

         fetchAssignedContributions();
      }
   };

   useEffect(() => {
      fetchAssignedContributions();
   }, []);


   return (
      <div>
         <h1 className="text-2xl text-highlight font-bold mb-6">Assigned to Me</h1>

         {loading ? (
            <div className="text-center text-foreground">Loading...</div>
         ) : contributions.length === 0 ? (
            <div className="text-center text-foreground">No assigned contributions yet.</div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {contributions.map((contribution) => (
                  <div key={contribution.id} className="bg-gray shadow-grayInverted text-foreground rounded-lg shadow-sm p-4">
                     <h2 className="text-lg font-semibold mb-2 text-highlight capitalize">{contribution.product_name}</h2>

                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">By:</strong> {contribution.full_name}</p>
                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Phone:</strong> {"+" + contribution.phone_number}</p>
                     {contribution.additional_phone && (
                        <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Alt Phone:</strong> {contribution.additional_phone}</p>
                     )}
                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Address:</strong> {contribution.address}</p>
                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Landmark:</strong> {contribution.landmark}</p>
                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Location:</strong> <a href={contribution.location_link} target="_blank" className="text-red-500 underline">View</a></p>
                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Pincode:</strong> {contribution.pincode}</p>
                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Contribution Type:</strong> {contribution.contribution_type}</p>
                     <p className="text-sm text-muted mb-1"><strong className="dark:text-blue-500 text-[#4F16F0]">Warranty Covered:</strong> {contribution.warranty_covered ? "Yes" : "No"}</p>
                     <p className="text-sm text-muted mb-3"><strong className="dark:text-blue-500 text-[#4F16F0]">Description:</strong> {contribution.description}</p>

                     <div className="flex flex-wrap gap-2 mt-3 justify-between">
                        <Button
                           variant="default"
                           className="bg-yellow-500 hover:bg-yellow-600  text-foreground h-8 text-sm"
                           onClick={() => handleUnassign(contribution.id)}
                        >
                           Unassign
                        </Button>
                        {/* Approve Button */}
                        <Button
                           variant="default"
                           className="text-sm bg-green-500 h-8 text-foreground hover:bg-green-600"
                           onClick={() => setApproveTarget(contribution)}
                        >
                           Approve
                        </Button>

                        {/* Reject Button */}
                        <Button
                           variant="default"
                           className="h-8 text-sm bg-red-500 text-foreground hover:bg-red-600"
                           onClick={() => {
                              setRejectTarget(contribution);
                              setRejectionReason("");
                           }}
                        >
                           Reject
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         )}
         {approveTarget && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
               <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4 text-highlight">
                     Approve "{approveTarget.product_name}"?
                  </h3>
                  <p className="text-sm text-muted mb-4">
                     Are you sure you want to mark this contribution as <strong>approved</strong>?
                  </p>
                  <div className="flex justify-end gap-3">
                     <Button variant="default" onClick={() => setApproveTarget(null)}>
                        Cancel
                     </Button>
                     <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={async () => {
                           if (!approveTarget) return;

                           const {
                              data: { user },
                              error: userError,
                           } = await supabase.auth.getUser();

                           if (userError || !user) {
                              toast.error("User not authenticated");
                              return;
                           }

                           const { data: agent, error: agentError } = await supabase
                              .from("service_agents")
                              .select("id, name")
                              .eq("email", user.email)
                              .single();

                           if (agentError || !agent) {
                              toast.error("Agent not found");
                              return;
                           }

                           const { error } = await supabase
                              .from("contributions")
                              .update({ status: "approved" })
                              .eq("id", approveTarget.id);

                           if (error) {
                              toast.error("Failed to approve.");
                           } else {
                              await logAgentAction({
                                 agentId: agent.id,
                                 agentEmail: user.email!,
                                 action: `Approved contribution #${approveTarget.id}`,
                                 metadata: { contributionId: approveTarget.id },
                              });

                              toast.success("Contribution approved.");
                              fetchAssignedContributions();
                           }

                           setApproveTarget(null);
                        }}
                     >
                        Yes, Approve
                     </Button>

                  </div>
               </div>
            </div>
         )}

         {rejectTarget && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
               <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4 text-highlight">
                     Reject "{rejectTarget.product_name}"?
                  </h3>
                  <p className="text-sm text-muted mb-2">
                     Select a reason for rejection:
                  </p>
                  <select
                     className="w-full border rounded p-2 mb-4 text-sm bg-background text-foreground"
                     value={rejectionReason}
                     onChange={(e) => setRejectionReason(e.target.value)}
                  >
                     <option value="">-- Select reason --</option>
                     <option value="Product quality is not good">Product quality is not good</option>
                     <option value="Product is damaged">Product is damaged</option>
                     <option value="Product already rented elsewhere">Already rented elsewhere</option>
                     <option value="Incomplete product set">Incomplete product set</option>
                     <option value="Owner unavailable">Owner unavailable</option>
                     <option value="Incorrect product category">Incorrect category</option>
                  </select>

                  <div className="flex justify-end gap-3">
                     <Button variant="default" onClick={() => setRejectTarget(null)}>
                        Cancel
                     </Button>
                     <Button
                        disabled={!rejectionReason}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={async () => {
                           if (!rejectTarget) return;

                           const {
                              data: { user },
                              error: userError,
                           } = await supabase.auth.getUser();

                           if (userError || !user) {
                              toast.error("User not authenticated");
                              return;
                           }

                           const { data: agent, error: agentError } = await supabase
                              .from("service_agents")
                              .select("id, name")
                              .eq("email", user.email)
                              .single();

                           if (agentError || !agent) {
                              toast.error("Agent not found");
                              return;
                           }

                           const { error } = await supabase
                              .from("contributions")
                              .update({
                                 status: "rejected",
                                 rejection_reason: rejectionReason,
                              })
                              .eq("id", rejectTarget.id);

                           if (error) {
                              toast.error("Failed to reject.");
                           } else {
                              await logAgentAction({
                                 agentId: agent.id,
                                 agentEmail: user.email!,
                                 action: `Rejected contribution #${rejectTarget.id} with reason: "${rejectionReason}"`,
                                 metadata: {
                                    contributionId: rejectTarget.id,
                                    rejectionReason,
                                 },
                              });

                              toast.success("Contribution rejected.");
                              fetchAssignedContributions();
                           }

                           setRejectTarget(null);
                           setRejectionReason("");
                        }}
                     >
                        Confirm Reject
                     </Button>

                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
