"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaTrash } from "react-icons/fa";

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddAdmin() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    getUser();
    fetchAdmins();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm)
  );

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchAdmins = async () => {
    const { data, error } = await supabase.from("admins").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch admins");
    } else {
      setAdmins(data as Admin[]);
    }
  };

  const handleSubmit = async () => {
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast.error("Please fill out all fields.");
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

    setLoading(true);
    try {
      const res = await fetch("/api/create-admin", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create admin");
      } else {
        toast.success("Admin created successfully");
        setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
        fetchAdmins();
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      <h2 className="text-2xl text-highlight font-semibold text-start">Add Admin</h2>

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
          className="bg-green-500 hover:bg-green-600"
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

      <hr className="border border-muted/30 my-6" />

      {/* Admins Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg text-highlight font-semibold">Existing Admins</h3>
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
              className="h-6 bg-yellow-500 hover:bg-yellow-600 text-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
            <span>Page {currentPage} of {Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE)}</span>
            <Button
              variant="default"
              className="h-6 bg-yellow-500 hover:bg-yellow-600 text-sm"
              disabled={currentPage === Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE)}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {admins.length === 0 ? (
          <p className="text-muted">No admins found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAdmins.map((admin, index) => (
                <TableRow key={admin.id}>
                  <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell>{new Date(admin.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      className="text-red-500 hover:text-red-600 text-sm"
                      onClick={() => setDeleteTarget(admin)}
                      disabled={userId === admin.id}
                      title={userId === admin.id ? "You cannot delete your own account" : ""}
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

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-highlight">
              Delete "{deleteTarget.name}"?
            </h3>
            <p className="text-sm text-muted mb-4">
              This will permanently delete the admin.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="default" className="bg-green-500 hover:bg-green-600" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={async () => {
                  setLoading(true);
                  const res = await fetch("/api/delete-admin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: deleteTarget.id }),
                  });

                  const result = await res.json();

                  if (!res.ok) {
                    toast.error(result.error || "Failed to delete admin.");
                  } else {
                    toast.success("Admin deleted.");
                    fetchAdmins();
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

      {/* Submit Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-highlight">
              Confirm Submission?
            </h3>
            <p className="text-sm text-muted mb-4">
              Are you sure you want to create this admin?
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
