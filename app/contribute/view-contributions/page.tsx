"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import OtpLoginDialog from "@/components/OtpLoginDialog";
import Spinner from "@/components/Spinner";
import { FaDotCircle } from "react-icons/fa";

type Contribution = {
   id: string;
   full_name: string;
   additional_phone: string;
   product_name: string;
   description: string;
   image_urls: string[];
   bill_url: string;
   status: string;
   address: string;
   pincode: string;
   location_link: string;
   warranty_covered: boolean;
   warranty_start: string;
   warranty_end: string;
   contribution_type: string;
   landmark: string;
   phone_number: string;
};

export default function ViewContributions() {
   const { user, isAuthReady } = useSupabaseUser();
   const openLogin = useLoginDialog((state) => state.open);
   const [hydrated, setHydrated] = useState(false);
   const [contributions, setContributions] = useState<Contribution[]>([]);
   const [expandedId, setExpandedId] = useState<string | null>(null);
   const [formMap, setFormMap] = useState<Record<string, Partial<Contribution>>>({});
   const [deleteTarget, setDeleteTarget] = useState<Contribution | null>(null);

   useEffect(() => {
      const timeout = setTimeout(() => setHydrated(true), 200);
      return () => clearTimeout(timeout);
   }, []);

   useEffect(() => {
      if (!hydrated || !isAuthReady) return;
      if (!user) openLogin("Please login to contribute your products.");
   }, [hydrated, isAuthReady, user, openLogin]);

   useEffect(() => {
      const fetchContributions = async () => {
         if (!user) return;

         const { data, error } = await supabase
            .from("contributions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

         if (error) {
            toast.error("Failed to load contributions.");
            return;
         }

         const formState: Record<string, Partial<Contribution>> = {};
         data?.forEach((item) => {
            formState[item.id] = { ...item };
         });

         setContributions(data || []);
         setFormMap(formState);
      };

      fetchContributions();
   }, [user]);

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      id: string
   ) => {
      const { name, value } = e.target;
      setFormMap((prev) => ({
         ...prev,
         [id]: { ...prev[id], [name]: value },
      }));
   };
   const router = useRouter();
   const getContributionLabel = (value: string) => {
      switch (value) {
         case "sell":
            return "Sell to OneStopLease";
         case "rent":
            return "Rent out through OneStopLease";
         default:
            return value;
      }
   };

   return (
      <>
         <Navbar />
         <main className="min-h-[calc(100vh-66px)] bg-background text-foreground p-6">
            <OtpLoginDialog />
            {!hydrated ? (
               <div className="flex items-center justify-center h-48">
                  <Spinner />
               </div>
            ) : !user ? (
               <div className="text-center mt-10 text-muted">
                  Please login to continue.
               </div>
            ) : (
               <>

                  <div className="flex items-center justify-between mb-4">
                     <div>
                        <h2 className="text-xl font-semibold mb-1 text-highlight">Your Contributions</h2>
                        <p className="text-sm">Click on the product to view complete details</p>
                     </div>

                     <Button
                        variant="default"
                        className="text-sm text-black bg-highlight"
                        onClick={() => router.push("/contribute")}
                     >
                        Go back
                     </Button>
                  </div>


                  <div className="space-y-4">
                     {contributions.map((item) => {
                        const isExpanded = expandedId === item.id;

                        const form = formMap[item.id] || item;

                        const leftPanel = [
                           { labelValue: "Full Name", inputName: "full_name", inputValue: form.full_name },
                           { labelValue: "Phone Number", inputName: "phone_number", inputValue: form.phone_number },
                           { labelValue: "Additional Phone Number", inputName: "additional_phone", inputValue: form.additional_phone },
                           { labelValue: "Address", inputName: "address", inputValue: form.address },
                           { labelValue: "Nearby Landmark", inputName: "landmark", inputValue: form.landmark },
                           { labelValue: "Location Link", inputName: "location_link", inputValue: form.location_link },
                           { labelValue: "Pincode", inputName: "pincode", inputValue: form.pincode },

                        ];

                        return (
                           <div
                              key={item.id}
                              className="border rounded-md p-4 shadow-sm bg-foreground text-background"
                           >
                              {/* Header */}
                              <div
                                 className="flex justify-between cursor-pointer"
                                 onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              >
                                 <div>
                                    <h3 className="font-semibold text-xl text-highlight capitalize">{item.product_name}</h3>
                                    <p className="text-sm flex items-center gap-2">
                                       <FaDotCircle
                                          className={
                                             item.status === "approved"
                                                ? "text-green-500"
                                                : item.status === "rejected"
                                                   ? "text-red-500"
                                                   : "text-yellow-500"
                                          }
                                       />
                                       <span className="capitalize">{item.status}</span>
                                    </p>

                                 </div>
                                 <div className="flex gap-2">
                                    <Button
                                       variant="default"
                                       className="bg-red-500"
                                       onClick={(e) => {
                                          e.stopPropagation(); // prevent expanding
                                          setDeleteTarget(item);
                                       }}
                                    >
                                       <Trash2 className="w-5 h-5 text-white cursor-pointer" />
                                    </Button>


                                 </div>
                              </div>

                              {/* Expanded Body */}
                              {isExpanded && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="flex flex-col gap-2">
                                       {leftPanel.map((left) => (
                                          <div key={left.inputName}>
                                             <Label className="text-highlight mb-1">{left.labelValue}</Label>
                                             <Input
                                                readOnly
                                                name={left.inputName}
                                                value={left.inputValue}
                                                onChange={(e) => handleInputChange(e, item.id)}
                                                className="bg-grayInverted"
                                             />
                                          </div>
                                       ))}
                                    </div>

                                    <div className="flex flex-col gap-2">

                                       <Label className="text-highlight">Product Name</Label>
                                       <Input
                                          readOnly
                                          name="product_name"
                                          value={form.product_name}
                                          onChange={(e) => handleInputChange(e, item.id)}
                                          className="bg-grayInverted"
                                       />

                                       <Label className="text-highlight">Description</Label>
                                       <Textarea
                                          name="description"
                                          readOnly
                                          value={form.description || ""}
                                          onChange={(e) => handleInputChange(e, item.id)}
                                          className="bg-grayInverted"
                                       />

                                       <Label className="text-highlight">Contribution Type</Label>
                                       <Input
                                          name="contribution_type"
                                          readOnly
                                          value={getContributionLabel(form.contribution_type || "")}
                                          onChange={(e) => handleInputChange(e, item.id)}
                                          className="bg-grayInverted"
                                       />

                                       <Label className="text-highlight">Warranty Covered</Label>
                                       <Input
                                          name="warranty_covered"
                                          readOnly
                                          value={form.warranty_covered ? "Yes" : "No"}
                                          className="bg-grayInverted"
                                       />

                                       {form.warranty_covered && (
                                          <>
                                             <Label className="text-highlight">Warranty Start</Label>
                                             <Input
                                                name="warranty_start"
                                                readOnly
                                                value={form.warranty_start}
                                                onChange={(e) => handleInputChange(e, item.id)}
                                                className="bg-grayInverted"
                                             />

                                             <Label className="text-highlight">Warranty End</Label>
                                             <Input
                                                name="warranty_end"
                                                readOnly
                                                value={form.warranty_end}
                                                onChange={(e) => handleInputChange(e, item.id)}
                                                className="bg-grayInverted"
                                             />
                                          </>
                                       )}

                                       {/* TODO: Replace below with secure preview components */}
                                       {/* Product Images */}
                                       <Label className="mt-4 text-highlight">Product Images</Label>
                                       <div className="flex gap-2 flex-wrap">
                                          {item.image_urls.map((url, idx) => (
                                             <img
                                                key={idx}
                                                src={url}
                                                alt={`Product image ${idx + 1}`}
                                                className="w-24 h-24 object-cover rounded border"
                                                loading="lazy"
                                                onContextMenu={(e) => e.preventDefault()} // disables right-click save
                                             />
                                          ))}
                                       </div>


                                       <Label className="mt-4 text-highlight">Product Bill</Label>
                                       {item.bill_url.endsWith(".pdf") ? (
                                          <embed
                                             src={item.bill_url}
                                             type="application/pdf"
                                             className="w-full h-64 rounded border"
                                             onContextMenu={(e) => e.preventDefault()}
                                          />
                                       ) : (
                                          <img
                                             src={item.bill_url}
                                             alt="Bill"
                                             className="w-40 h-40 object-contain rounded border"
                                             loading="lazy"
                                             onContextMenu={(e) => e.preventDefault()}
                                          />
                                       )}

                                    </div>
                                 </div>
                              )}
                           </div>

                        );
                     })}
                  </div>
               </>
            )}
         </main>
         {deleteTarget && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
               <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4 text-highlight">
                     Are you sure you want to delete "{deleteTarget.product_name}"?
                  </h3>
                  <div className="flex justify-end gap-3">
                     <Button
                        variant="default"
                        className="bg-foreground text-background"
                        onClick={() => setDeleteTarget(null)}
                     >
                        Cancel
                     </Button>
                     <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={async () => {
                           const { error } = await supabase
                              .from("contributions")
                              .delete()
                              .eq("id", deleteTarget.id);

                           if (error) {
                              toast.error("Failed to delete.");
                           } else {
                              toast.success("Contribution deleted.");
                              setContributions((prev) => prev.filter((c) => c.id !== deleteTarget.id));
                              setExpandedId(null);
                           }

                           setDeleteTarget(null);
                        }}
                     >
                        Yes, Delete
                     </Button>
                  </div>
               </div>
            </div>
         )}

      </>
   );
}


