"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner"; 
import { supabase } from "@/lib/supabaseClient";

type ContributeForm = {
  fullName: string;
  phone: string;
  additionalPhone: string;
  address: string;
  locationLink: string;
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
  const [hydrated, setHydrated] = useState(false);
  const [pincodeWarning, setPincodeWarning] = useState("");
  const [locationLinkWarning, setLocationLinkWarning] = useState(""); // 🆕 warning state

  const [form, setForm] = useState<ContributeForm>({
    fullName: "",
    phone: "",
    additionalPhone: "",
    address: "",
    locationLink: "",
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
    if (!user) openLogin("Please login to contribute your products.");
    else setForm((prev) => ({ ...prev, phone: user.phone || "" }));
  }, [hydrated, isAuthReady, user, openLogin]);

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "locationLink") {
      const trimmed = value.trim();
      const isValid =
        trimmed.startsWith("https://maps.app.goo.gl/") ||
        trimmed.startsWith("https://www.google.com/maps") ||
        trimmed.startsWith("https://maps.apple.com");

      setLocationLinkWarning(
        isValid ? "" : "Please enter a valid Google Maps or Apple Maps link."
      );

      setForm((prev) => ({ ...prev, locationLink: trimmed }));
      return;
    }

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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const link = form.locationLink.trim();
  const isValid =
    link.startsWith("https://maps.app.goo.gl/") ||
    link.startsWith("https://www.google.com/maps") ||
    link.startsWith("https://maps.apple.com");

  if (!isValid) {
    setLocationLinkWarning("Please enter a valid Google Maps or Apple Maps link.");
    return;
  }

  try {
    if (!user) throw new Error("User not authenticated");

    // Upload product images to 'contributor-product-images'
    const imageUrls: string[] = [];
    for (let i = 0; i < form.images.length; i++) {
      const file = form.images[i];
      const cleanedProductName = form.productName.replace(/\s+/g, "").toLowerCase();
      const filename = `${cleanedProductName}${i + 1}.${file.name.split(".").pop()}`;
      const path = `${form.phone}/${cleanedProductName}/${filename}`;

      const { error: imageError } = await supabase.storage
        .from("contributor-product-images")
        .upload(path, file, { upsert: true });

      if (imageError) throw imageError;

      const { data: imageUrlData } = supabase.storage
        .from("contributor-product-images")
        .getPublicUrl(path);

      imageUrls.push(imageUrlData.publicUrl);
    }

    let billUrl = "";
    if (form.bill) {
      const extension = form.bill.name.split(".").pop();
      const cleanedProductName = form.productName.replace(/\s+/g, "").toLowerCase();
      const filename = `${cleanedProductName}_bill.${extension}`;
      const billPath = `${form.phone}/${cleanedProductName}/${filename}`;
      const { error: billError } = await supabase.storage
        .from("contributor-product-bill")
        .upload(billPath, form.bill, { upsert: true });

      if (billError) throw billError;

      const { data: billUrlData } = supabase.storage
        .from("contributor-product-bill")
        .getPublicUrl(billPath);

      billUrl = billUrlData.publicUrl;
    }

    const { error: dbError } = await supabase.from("contributions").insert({
      user_id: user.id,
      full_name: form.fullName,
      phone_number: form.phone,
      additional_phone: form.additionalPhone,
      address: form.address,
      landmark: form.landmark,
      location_link: form.locationLink,
      pincode: form.pincode,
      product_name: form.productName,
      description: form.description,
      contribution_type: form.ownershipType,
      warranty_covered: form.isWarrantyCovered,
      warranty_start: form.isWarrantyCovered ? form.warrantyStart : null,
      warranty_end: form.isWarrantyCovered ? form.warrantyEnd : null,
      image_urls: imageUrls,
      bill_url: billUrl,
    });

    if (dbError) throw dbError;

    // Success
    toast.success("Contribution submitted successfully!");

    // Clear the form
    setForm({
      fullName: "",
      phone: user.phone || "",
      additionalPhone: "",
      address: "",
      locationLink: "",
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
    setLocationLinkWarning("");
    setPincodeWarning("");
  } catch (error: any) {
    console.error("Submission failed:", error.message);
    toast.error("Submission failed. Please try again.");
  }
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
                <FormInput label="Location link (google maps or apple maps)" name="locationLink" value={form.locationLink} required onChange={handleInputChange} />
                {locationLinkWarning && (
                  <p className="text-sm text-red-500 mt-1">{locationLinkWarning}</p>
                )}
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
