"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaDotCircle } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Contribution {
   id: string;
   full_name: string;
   phone_number: string;
   additional_phone: string;
   address: string;
   landmark: string;
   location_link: string;
   pincode: string;
   product_name: string;
   description: string;
   contribution_type: string;
   warranty_covered: string;
   warranty_start: string;
   warranty_end: string;
   status: string;
   image_urls: string[];
   bill_url: string;
   rejection_reason: string;
   assigned_to: string;
}

const ITEMS_PER_PAGE = 30;

export default function PendingContributionsPage() {
   const [contributions, setContributions] = useState<Contribution[]>([]);
   const [loading, setLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
   const [agents, setAgents] = useState<{ name: string }[]>([]);
   const [editingRowId, setEditingRowId] = useState<string | null>(null);


   const fetchContributions = async (pageNum: number) => {
      setLoading(true);

      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
         .from("contributions")
         .select(
            "id, full_name, phone_number, additional_phone, address, landmark, location_link, pincode, product_name, description, contribution_type, warranty_covered, warranty_start, warranty_end, status, image_urls, bill_url, rejection_reason, assigned_to",
            { count: "exact" }
         )
         .eq("status", "pending")
         .order("created_at", { ascending: false })
         .range(from, to);

      if (error) {
         console.error("Error fetching contributions:", error.message);
      } else {
         setContributions(data || []);
      }

      setLoading(false);
   };

   const handleRowClick = async (contribution: Contribution) => {
      setSelectedContribution(contribution);
   };

   const fetchTotalCount = async () => {
      const { count, error } = await supabase
         .from("contributions")
         .select("id", { count: "exact", head: true });

      if (!error && count !== null) {
         setTotalItems(count);
      }
   };

   const fetchAgents = async () => {
      const { data, error } = await supabase
         .from("service_agents")
         .select("name");

      if (!error) setAgents(data || []);
   };

   const assignAgent = async (contributionId: string, agentName: string) => {
  const { error } = await supabase
    .from("contributions")
    .update({
      assigned_to: agentName,
      status: "assigned",
    })
    .eq("id", contributionId);

  if (!error) {
    setContributions((prev) =>
      prev.map((c) =>
        c.id === contributionId
          ? { ...c, assigned_to: agentName, status: "assigned" } 
          : c
      )
    );
  } else {
    console.error("Error assigning agent:", error.message);
  }
};


   useEffect(() => {
      fetchTotalCount();
      fetchAgents();
   }, []);

   useEffect(() => {
      fetchContributions(page);
   }, [page]);

   return (
      <div className="p-4">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-highlight">Pending Contributions</h1>

            {totalPages > 1 && (
               <div className="flex items-center gap-4">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => p - 1)}
                     disabled={page === 1}
                  >
                     Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                     Page {page} of {totalPages}
                  </span>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => p + 1)}
                     disabled={page === totalPages}
                  >
                     Next
                  </Button>
               </div>
            )}
         </div>

         {/* Table */}
         {loading ? (
            <p className="text-center text-muted">Loading contributions...</p>
         ) : contributions.length === 0 ? (
            <p className="text-center text-muted">No contributions found.</p>
         ) : (
            <div className="w-full overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-[80px]">S.No</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Assigned To</TableHead>

                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {contributions.map((item, index) => (
                        <TableRow key={item.id} className="cursor-pointer" onClick={() => handleRowClick(item)}>
                           <TableCell>{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                           <TableCell className="capitalize">{item.product_name}</TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <FaDotCircle
                                    className={
                                       item.status === "approved"
                                          ? "text-green-500"
                                          : item.status === "rejected"
                                             ? "text-red-500"
                                             : item.status === "assigned" ? "text-blue-500" : "text-yellow-500"
                                    }
                                 />
                                 <span className="capitalize">{item.status}</span>
                              </div>
                           </TableCell>
                           <TableCell>{"+" + item.phone_number}</TableCell>
                           <TableCell>
                              {editingRowId === item.id ? (
                                 <Select
                                    onValueChange={(val) => {
                                       assignAgent(item.id, val);
                                       setEditingRowId(null); // close dropdown
                                    }}
                                    defaultValue={item.assigned_to}
                                 >
                                    <SelectTrigger className="w-[160px] h-8 bg-background text-foreground">
                                       <SelectValue placeholder="Select Agent" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background text-foreground">
                                       {agents.map((agent) => (
                                          <SelectItem className="focus:bg-highlight" key={agent.name} value={agent.name}>
                                             {agent.name}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              ) : (
                                 <div className="flex items-center gap-2">
                                    <span className="text-green-600">
                                       {item.assigned_to || "Unassigned"}
                                    </span>
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingRowId(item.id);
                                       }}
                                       className="text-sm text-blue-500 underline hover:text-blue-600"
                                    >
                                       Edit
                                    </button>
                                 </div>
                              )}
                           </TableCell>

                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         )}

         {/* Dialog for full contribution details */}
         <Dialog open={!!selectedContribution} onOpenChange={() => setSelectedContribution(null)}>
            <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] bg-foreground">
               <DialogHeader>
                  <DialogTitle className="text-lg text-highlight">
                     {selectedContribution?.product_name}
                  </DialogTitle>
               </DialogHeader>

               {selectedContribution && (
                  <div className="flex flex-col lg:flex-row gap-6 text-sm text-background">
                     {/* Left side: Contributor Details */}
                     <div className="w-full lg:w-1/2 space-y-3 border-r pr-4 border-border">
                        <p><strong>Contributor:</strong> {selectedContribution.full_name}</p>
                        <p><strong>Phone:</strong> {"+" + selectedContribution.phone_number}</p>
                        <p className="flex items-center gap-2">
                           <strong>Additional Phone:</strong>
                           {selectedContribution.additional_phone ? (
                              "+" + selectedContribution.additional_phone
                           ) : (
                              <span className="text-red-500 font-bold">✘</span>
                           )}
                        </p>
                        <p><strong>Address:</strong> {selectedContribution.address}</p>
                        <p className="flex items-center gap-2">
                           <strong>Landmark:</strong>
                           {selectedContribution.landmark ? (
                              "+" + selectedContribution.landmark
                           ) : (
                              <span className="text-red-500 font-bold">✘</span>
                           )}
                        </p>
                        <p className="text-sm text-muted mb-1"><strong>Location:</strong> <a href={selectedContribution.location_link} target="_blank" className="text-red-500 underline">View</a></p>
                        <p><strong>Pincode:</strong> {selectedContribution.pincode}</p>
                        <p><strong>Product:</strong> {selectedContribution.product_name}</p>
                        <p className="text-sm text-muted mb-2 flex items-center gap-2">
                           <strong className=" text-sm">Status:</strong>
                           <FaDotCircle
                              className={
                                 selectedContribution.status === "approved"
                                    ? "text-green-500"
                                    : selectedContribution.status === "rejected"
                                       ? "text-red-500"
                                       : selectedContribution.status === "assigned" ? "text-blue-500" : "text-yellow-500"
                              }
                           />
                           <span className="capitalize">{selectedContribution.status}</span>
                        </p>
                        <p><strong>Warranty Covered:</strong> {selectedContribution.warranty_covered ? "Yes" : "No"}</p>

                        {selectedContribution.warranty_covered && (
                           <>
                              <p><strong>Start:</strong> {selectedContribution.warranty_start} </p>
                              <p><strong>End:</strong> {selectedContribution.warranty_end} </p>
                           </>
                        )}
                        <p className="flex items-center gap-2">
                           <strong>Description:</strong>
                           {selectedContribution.description ? (
                              "+" + selectedContribution.description
                           ) : (
                              <span className="text-red-500 font-bold">✘</span>
                           )}
                        </p>
                        {selectedContribution.status === "rejected" && (
                           <>
                              <p><strong className="text-red-500">Reason:</strong> {selectedContribution.rejection_reason}</p>
                           </>
                        )}
                     </div>

                     {/* Right side: Product Details */}
                     <div className="w-full lg:w-1/2 space-y-3 pl-4">

                        <strong>Product Images and Bill:</strong>
                        <div className="flex gap-2 flex-wrap">
                           {selectedContribution.image_urls.map((url, idx) => (
                              <img
                                 key={idx}
                                 src={url}
                                 alt={`Product image ${idx + 1}`}
                                 className="w-24 h-24 object-cover rounded border pointer-events-none"
                                 loading="lazy"
                                 onContextMenu={(e) => e.preventDefault()}
                              />
                           ))}
                        </div>
                        {selectedContribution.bill_url.endsWith(".pdf") ? (
                           <embed
                              src={selectedContribution.bill_url}
                              type="application/pdf"
                              className="w-full h-64 rounded border"
                              onContextMenu={(e) => e.preventDefault()}
                           />
                        ) : (
                           <img
                              src={selectedContribution.bill_url}
                              alt="Bill"
                              className="w-40 h-40 object-contain rounded border"
                              loading="lazy"
                              onContextMenu={(e) => e.preventDefault()}
                           />
                        )}

                        {(selectedContribution?.image_urls?.length || selectedContribution?.bill_url) && (
                           <div className="flex justify-end mt-4">
                              <Button
                                 size="sm"
                                 variant="default"
                                 className="bg-highlight h-6"
                                 onClick={async () => {
                                    // Download images using their original DB file names
                                    if (Array.isArray(selectedContribution.image_urls)) {
                                       for (const path of selectedContribution.image_urls) {
                                          const response = await fetch(path);
                                          const blob = await response.blob();
                                          const objectUrl = URL.createObjectURL(blob);

                                          const a = document.createElement("a");
                                          a.href = objectUrl;
                                          a.download = path.split("/").pop() || "image.jpg";
                                          a.click();
                                          URL.revokeObjectURL(objectUrl);
                                       }
                                    }

                                    // Download bill using original file name
                                    if (selectedContribution.bill_url) {
                                       const response = await fetch(selectedContribution.bill_url);
                                       const blob = await response.blob();
                                       const objectUrl = URL.createObjectURL(blob);

                                       const a = document.createElement("a");
                                       a.href = objectUrl;
                                       a.download = selectedContribution.bill_url.split("/").pop() || "bill.pdf";
                                       a.click();
                                       URL.revokeObjectURL(objectUrl);
                                    }
                                 }}
                              >
                                 Download All Files
                              </Button>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
}
