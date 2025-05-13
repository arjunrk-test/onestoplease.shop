"use client";

import { useEffect, useRef, useState } from "react";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import OtpLoginDialog from "@/components/OtpLoginDialog";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploadGroup from "@/components/ImageUploadGroup";
import SingleFileUpload from "@/components/SingleFileUpload";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextArea";
import FormSelect from "./FormSelect";

type ContributeForm = {
  fullName: string;
  phone: string;
  additionalPhone: string;
  address: string;
  landmark: string;
  pincode: string;
  productName: string;
  description: string;
  isWarrantyCovered: boolean;
  warrantyStart: string;
  warrantyEnd: string;
  ownershipType: string;
  images: File[];
  bill: File | null;
};

export default function Contribute() {
const { user, isAuthReady } = useSupabaseUser();
  const openLogin = useLoginDialog((state) => state.open);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pincodeWarning, setPincodeWarning] = useState("");

  const [form, setForm] = useState<ContributeForm>({
    fullName: "",
    phone: "",
    additionalPhone: "",
    address: "",
    landmark: "",
    pincode: "",
    productName: "",
    description: "",
    isWarrantyCovered: false,
    warrantyStart: "",
    warrantyEnd: "",
    ownershipType: "",
    images: [],
    bill: null,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setHydrated(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
  if (!hydrated || !isAuthReady) return; 

  if (!user) {
    openLogin("Please login to contribute your products.");
  } else {
    setForm((prev) => ({ ...prev, phone: user.phone || "" }));
  }
}, [hydrated, isAuthReady, user, openLogin]);



  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({
        ...prev,
        [name]: name === "images" ? Array.from(files).slice(0, 3) : files[0],
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (/\D/.test(input)) {
      setPincodeWarning("Only numbers are allowed.");
    } else if (input.length > 6) {
      setPincodeWarning("Pincode cannot exceed 6 digits.");
    } else {
      setPincodeWarning("");
    }
    const filtered = input.replace(/\D/g, "").slice(0, 6);
    handleInputChange({ target: { name: "pincode", value: filtered } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form:", form);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-112px)] p-6 bg-background text-foreground h-screen">
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
            <h1 className="text-2xl font-bold mb-4 text-highlight">Contribute & Earn</h1>
            <p className="mb-6">You can now contribute your products for rent or resale.</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-foreground text-background p-6 rounded-md">
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                <FormInput label="Full Name" name="fullName" value={form.fullName} required onChange={handleInputChange} />
                <FormInput label="Phone Number" name="phone" value={`+${form.phone}`} readOnly />
                <FormInput label="Additional Phone Number (Optional)" name="additionalPhone" value={form.additionalPhone} onChange={handleInputChange} />
                <FormTextarea label="Address" name="address" value={form.address} onChange={handleInputChange} required maxLength={150} />
                <FormInput label="Nearby Landmark (Optional)" name="landmark" value={form.landmark} onChange={handleInputChange} />
                <div>
                  <Label className="mb-1 text-highlight">Pincode<span className="text-red-500"> *</span></Label>
                  <Input name="pincode" value={form.pincode} onChange={handlePincodeChange} className="border bg-grayInverted placeholder:text-gray" placeholder="Enter your pincode" required />
                  {pincodeWarning && <p className="text-sm text-red-500 mt-1">{pincodeWarning}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4">
                <FormInput label="Product Name" name="productName" value={form.productName} required onChange={handleInputChange} />
                <FormTextarea label="Description (Optional)" name="description" value={form.description} onChange={handleInputChange} maxLength={200} />

                <FormSelect
                  label="Contribution Type"
                  required
                  options={[
                    { label: "Sell to OneStopLease", value: "sell" },
                    { label: "Rent out through OneStopLease", value: "rent" },
                  ]}
                  onChange={(val) => setForm((prev) => ({ ...prev, ownershipType: val }))}
                />

                <FormSelect
                  label="Is it warranty covered?"
                  required
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  onChange={(val) => setForm((prev) => ({
                    ...prev,
                    isWarrantyCovered: val === "yes",
                    warrantyStart: "",
                    warrantyEnd: "",
                  }))}
                />

                {form.isWarrantyCovered && (
                  <>
                    <FormInput label="Warranty Start Date" name="warrantyStart" value={form.warrantyStart} onChange={handleInputChange} type="date" required />
                    <FormInput label="Warranty End Date" name="warrantyEnd" value={form.warrantyEnd} onChange={handleInputChange} type="date" required />
                  </>
                )}

                {/* Image Upload */}

                <ImageUploadGroup
                  productName={form.productName}
                  images={form.images}
                  setImages={(files) => setForm((prev) => ({ ...prev, images: files }))}
                />
                <SingleFileUpload
                  label="Upload Product Bill"
                  file={form.bill}
                  setFile={(file) => setForm((prev) => ({ ...prev, bill: file }))}
                  accept=".jpg,.jpeg,.png,.pdf"
                  productName={form.productName}
                  required
                />

              </div>

              <div className="md:col-span-2 text-center">
                <Button type="submit" className="px-6 py-3 text-base bg-highlight hover:bg-highlight/80">
                  Submit Contribution
                </Button>
              </div>
            </form>
          </>
        )}
      </main>
    </>
  );
}
