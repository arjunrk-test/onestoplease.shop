"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaDotCircle } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

type StatusType = "all" | "pending" | "assigned" | "approved" | "rejected";

interface Contribution {
   id: string;
   product_name: string;
   full_name: string;
   phone_number: string;
   address: string;
   description: string;
   status: StatusType;
   created_at: string;
}

type StatusCounts = Record<StatusType, number>;

const ITEMS_PER_PAGE = 30;

export default function AllContributionsPage() {
   const [contributions, setContributions] = useState<Contribution[]>([]);
   const [loading, setLoading] = useState(true);
   const [statusFilter, setStatusFilter] = useState<StatusType>("all");
   const [counts, setCounts] = useState<StatusCounts>({
      all: 0,
      pending: 0,
      assigned: 0,
      approved: 0,
      rejected: 0,
   });
   const [page, setPage] = useState(1);

   const fetchContributions = async (status: StatusType, pageNum: number) => {
      setLoading(true);

      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
         .from("contributions")
         .select(
            "id, product_name, full_name, phone_number, address, description, status, created_at"
         )
         .order("created_at", { ascending: false })
         .range(from, to);

      if (status !== "all") {
         query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
         console.error("Error fetching contributions:", error.message);
      } else {
         setContributions(data || []);
      }

      setLoading(false);
   };

   const fetchCounts = async () => {
      const newCounts: StatusCounts = {
         all: 0,
         pending: 0,
         assigned: 0,
         approved: 0,
         rejected: 0,
      };

      const { data: allData } = await supabase.from("contributions").select("id");
      newCounts.all = allData?.length || 0;

      const statuses: StatusType[] = ["pending", "assigned", "approved", "rejected"];
      for (const status of statuses) {
         const { data } = await supabase
            .from("contributions")
            .select("id")
            .eq("status", status);
         newCounts[status] = data?.length || 0;
      }

      setCounts(newCounts);
   };

   useEffect(() => {
      setPage(1); // reset to first page on filter change
   }, [statusFilter]);

   useEffect(() => {
      fetchCounts();
      fetchContributions(statusFilter, page);
   }, [statusFilter, page]);

   const totalItems = counts[statusFilter];
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   return (
      <div>
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-highlight">All Contributions</h1>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as StatusType)}>
               <SelectTrigger className="w-[220px] bg-gray text-foreground text-sm border-none">
                  <SelectValue placeholder="Filter by status" />
               </SelectTrigger>
               <SelectContent className="bg-gray text-sm text-foreground border-none">
                  <SelectItem className="focus:bg-highlight text-sm border-none" value="all">All
                     <Badge variant="default" className="ml-2 bg-[#FF2DF1]  h-5 w-8 text-foreground">{counts.all}</Badge>
                  </SelectItem>
                  <SelectItem className="focus:bg-highlight text-sm border-none" value="pending">Pending
                     <Badge variant="default" className="ml-2 bg-yellow-500  h-5 w-8 text-foreground">{counts.pending}</Badge>
                  </SelectItem>
                  <SelectItem className="focus:bg-highlight text-sm border-none" value="assigned">Assigned
                     <Badge variant="default" className="ml-2 bg-blue-500  h-5 w-8 text-foreground">{counts.assigned}</Badge>
                  </SelectItem>
                  <SelectItem className="focus:bg-highlight text-sm border-none" value="approved">Approved
                     <Badge variant="default" className="ml-2 bg-green-500  h-5 w-8 text-foreground">{counts.approved}</Badge>
                  </SelectItem>
                  <SelectItem className="focus:bg-highlight text-sm border-none" value="rejected">Rejected
                     <Badge variant="default" className="ml-2 bg-red-500  h-5 w-8 text-foreground">{counts.rejected}</Badge>
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>

         {loading ? (
            <div className="text-center text-foreground">Loading contributions...</div>
         ) : contributions.length === 0 ? (
            <div className="text-center text-foreground">No contributions found.</div>
         ) : (
            <>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {contributions.map((contribution) => (
                     <div
                        key={contribution.id}
                        className="bg-gray text-foreground rounded-lg shadow-grayInverted shadow-sm p-4 flex flex-col justify-between "
                     >
                        <div>
                           <h2 className="text-lg text-highlight capitalize font-semibold mb-2">{contribution.product_name}</h2>
                           <p className="text-sm text-muted mb-1">
                              <strong className="dark:text-blue-500 text-[#4F16F0] text-sm">By:</strong> {contribution.full_name}
                           </p>
                           <p className="text-sm text-muted mb-1">
                              <strong className="dark:text-blue-500 text-[#4F16F0] text-sm">Phone:</strong> {"+" + contribution.phone_number}
                           </p>
                           <p className="text-sm text-muted mb-1">
                              <strong className="dark:text-blue-500 text-[#4F16F0] text-sm">Address:</strong> {contribution.address}
                           </p>
                           <p className="text-sm text-muted mb-2 flex items-center gap-2">
                              <strong className="dark:text-blue-500 text-[#4F16F0] text-sm">Status:</strong>
                              <FaDotCircle
                                 className={
                                    contribution.status === "approved"
                                       ? "text-green-500"
                                       : contribution.status === "rejected"
                                          ? "text-red-500"
                                          : contribution.status === "assigned" ? "text-blue-500" : "text-yellow-500"
                                 }
                              />
                              <span className="capitalize">{contribution.status}</span>
                           </p>

                           <p className="text-sm text-muted line-clamp-3">{contribution.description}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {totalPages > 1 && (
                  <div className="flex justify-center gap-4">
                     <Button
                        variant="outline"
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                     >
                        Previous
                     </Button>
                     <span className="text-sm text-muted-foreground self-center">
                        Page {page} of {totalPages}
                     </span>
                     <Button
                        variant="outline"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === totalPages}
                     >
                        Next
                     </Button>
                  </div>
               )}
            </>
         )}
      </div>
   );
}
