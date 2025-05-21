"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { format } from "date-fns";
import { FaDotCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface AgentLog {
  id: string;
  agent_email: string;
  action: string;
  created_at: string;
}

type StatusType = "pending" | "assigned" | "approved" | "rejected";
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
  status: StatusType;
  image_urls: string[];
  bill_url: string;
  rejection_reason: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [selectedLog, setSelectedLog] = useState<AgentLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("service_agent_logs")
      .select("id, agent_email, action, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch logs:", error.message);
    } else {
      setLogs(data || []);
    }

    setLoading(false);
  };

  const extractContributionId = (action: string): string | null => {
    const match = action.match(/#([a-zA-Z0-9\-]+)/);
    return match ? match[1] : null;
  };

  const handleRowClick = async (log: AgentLog) => {
    const contributionId = extractContributionId(log.action);
    if (!contributionId) return;

    const { data: contribution, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("id", contributionId)
      .single();

    if (error) {
      console.error("Failed to fetch contribution:", error.message);
      return;
    }

    setSelectedLog(log);
    setSelectedContribution(contribution);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-highlight">Service Agent Activity Logs</h1>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-muted">No logs available.</p>
      ) : (
        <div className="overflow-auto rounded-md">
          <Table className='bg-transparent text-foreground rounded-md'>
            <TableHeader className="sticky top-0 z-10 bg-muted/30 backdrop-blur text-highlight">
              <TableRow className='rounded-md'>
                <TableHead className="whitespace-nowrap text-highlight">Agent</TableHead>
                <TableHead className="whitespace-nowrap text-highlight">Action</TableHead>
                <TableHead className="whitespace-nowrap text-highlight">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted transition"
                  onClick={() => handleRowClick(log)}
                >
                  <TableCell className="text-red-500">{log.agent_email}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {format(new Date(log.created_at), "dd MMM yyyy, hh:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedContribution && selectedLog && (
        <Dialog open={true} onOpenChange={() => setSelectedContribution(null)}>
          <DialogContent className="max-w-xl text-foreground bg-background">
            <DialogHeader>
              <DialogTitle className="text-highlight">Product Details (#{selectedContribution.id})</DialogTitle>
            </DialogHeader>

            <div className="text-sm space-y-2 mt-2">
              <p><strong className="text-accent">Action:</strong> {selectedLog.action}</p>
              <p><strong className="text-accent">Performed by:</strong> {selectedLog.agent_email}</p>
              <p><strong className="text-accent">Date:</strong> {format(new Date(selectedLog.created_at), "dd MMM yyyy, hh:mm a")}</p>
              <hr />
              <div className="flex flex-col lg:flex-row gap-6 text-sm text-foreground">
                {/* Left side: Contributor Details */}
                <div className="w-full lg:w-1/2 space-y-3 border-r pr-4 border-border">
                  <p><strong className="text-accent">Contributor:</strong> {selectedContribution.full_name}</p>
                  <p><strong className="text-accent">Product:</strong> {selectedContribution.product_name}</p>
                  <p className="flex items-center gap-2">
                    <strong className="text-accent">Description:</strong>
                    {selectedContribution.description ? (
                      "+" + selectedContribution.description
                    ) : (
                      <span className="text-red-500 font-bold">✘</span>
                    )}
                  </p>
                  <p><strong className="text-accent">Phone:</strong> {"+" + selectedContribution.phone_number}</p>
                  <p className="flex items-center gap-2">
                    <strong className="text-accent">Additional Phone:</strong>
                    {selectedContribution.additional_phone ? (
                      "+" + selectedContribution.additional_phone
                    ) : (
                      <span className="text-red-500 font-bold">✘</span>
                    )}
                  </p>
                  <p><strong className="text-accent">Address:</strong> {selectedContribution.address}</p>
                  <p className="flex items-center gap-2">
                    <strong className="text-accent">Landmark:</strong>
                    {selectedContribution.landmark ? (
                      "+" + selectedContribution.landmark
                    ) : (
                      <span className="text-red-500 font-bold">✘</span>
                    )}
                  </p>
                  <p className="text-sm text-muted mb-1"><strong className="text-accent">Location:</strong> <a href={selectedContribution.location_link} target="_blank" className="text-red-500 underline">View</a></p>
                  <p><strong className="text-accent">Pincode:</strong> {selectedContribution.pincode}</p>

                  <p className="text-sm text-muted mb-2 flex items-center gap-2">
                    <strong className="text-accent text-sm">Status:</strong>
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
                  <p><strong className="text-accent">Warranty Covered:</strong> {selectedContribution.warranty_covered ? "Yes" : "No"}</p>

                  {selectedContribution.warranty_covered && (
                    <>
                      <p><strong className="text-accent">Start:</strong> {selectedContribution.warranty_start} </p>
                      <p><strong className="text-accent">End:</strong> {selectedContribution.warranty_end} </p>
                    </>
                  )}

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
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}