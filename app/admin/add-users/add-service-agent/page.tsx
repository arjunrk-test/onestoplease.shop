"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { FaTrash } from "react-icons/fa";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function AddServiceAgent() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", });
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm)
  );


  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchAgents = async () => {
    const { data, error } = await supabase.from("service_agents").select("*").order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch agents");
    } else {
      setAgents(data as Agent[]);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSubmit = async () => {



    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast.error("Please fill out all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-agent", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create service agent");
      } else {
        toast.success("Service agent created successfully");
        setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
        fetchAgents();
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      <h2 className="text-2xl text-highlight font-semibold text-start">Add Service Agent</h2>

      {/* Form */}
      <div className="flex flex-row gap-2">
        <Input className="bg-gray text-foreground" required name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
        <Input className="bg-gray text-foreground" required name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
        <Input
          className="bg-gray text-foreground"
          required
          name="phone"
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              setForm({ ...form, phone: value });
            }
          }}
          placeholder="Phone Number"
          type="tel"
          inputMode="numeric"
        />

        <Input className="bg-gray text-foreground" required name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" />
        <Input className="bg-gray text-foreground" required name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" type="password" />
      </div>

      <div className="flex justify-center">
        <Button
          className="bg-green-500 hover:bg-green-600 text-foreground"
          onClick={() => {
            if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
              toast.error("Please fill out all fields.");
              return;
            }

            if (!emailRegex.test(form.email)) {
              toast.error("Please enter a valid email address.");
              return;
            }

            if (form.phone.length !== 10) {
              toast.error("Phone number must be exactly 10 digits.");
              return;
            }

            if (form.password !== form.confirmPassword) {
              toast.error("Passwords do not match.");
              return;
            }

            setShowConfirm(true);
          }}

          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </Button>
      </div>

      {/* Separator */}
      <hr className="border border-muted/30 my-6" />

      {/* Agent List Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg text-highlight font-semibold">Existing Service Agents</h3>
          <Input
            type="text"
            placeholder="Search by name, email, or phone"
            className="w-80 bg-gray text-foreground"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex gap-2 text-sm items-center">
            <Button
              variant="default"
              className="h-6 bg-yellow-500 hover:bg-yellow-600 text-sm text-foreground"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
            <span className="text-foreground">Page {currentPage} of {Math.ceil(filteredAgents.length / ITEMS_PER_PAGE)}</span>
            <Button
              variant="default"
              className="h-6 bg-yellow-500 hover:bg-yellow-600 text-sm text-foreground"
              disabled={currentPage === Math.ceil(agents.length / ITEMS_PER_PAGE)}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {agents.length === 0 ? (
          <p className="text-muted">No agents found.</p>
        ) : (
          <Table>
            <TableHeader className="text-foreground">
              <TableRow>
                <TableHead>S.No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-foreground">
              {paginatedAgents.map((agent, index) => (
                <TableRow key={agent.id}>
                  <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.phone}</TableCell>
                  <TableCell>{new Date(agent.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      className="text-red-500  hover:text-red-600 text-sm"
                      onClick={() => setDeleteTarget(agent)}
                    >
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        )}
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-highlight">
              Delete "{deleteTarget.name}"?
            </h3>
            <p className="text-sm text-muted mb-4">
              This will permanently delete the service agent.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="default" className="bg-green-500 hover:bg-green-600" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={async () => {
                  setLoading(true);
                  const res = await fetch("/api/delete-agent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: deleteTarget.id }),
                  });

                  const result = await res.json();

                  if (!res.ok) {
                    toast.error(result.error || "Failed to delete agent.");
                  } else {
                    toast.success("Service agent deleted.");
                    fetchAgents();
                  }
                  setLoading(false);
                  setDeleteTarget(null);
                }}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-highlight">
              Confirm Submission?
            </h3>
            <p className="text-sm text-muted mb-4">
              Are you sure you want to create this service agent?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="default"
                className="bg-muted text-foreground"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={async () => {
                  setShowConfirm(false);
                  await handleSubmit();
                }}
              >
                Yes, Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
