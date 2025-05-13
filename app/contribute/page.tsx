"use client";

import { useEffect, useState } from "react";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import OtpLoginDialog from "@/components/OtpLoginDialog";
import Spinner from "@/components/Spinner"; // ✅ your custom spinner

export default function Contribute() {
  const user = useSupabaseUser();
  const openLogin = useLoginDialog((state) => state.open);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHydrated(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (hydrated && !user) {
      openLogin("Please login to contribute your products.");
    }
  }, [hydrated, user, openLogin]);

  return (
    <main className="min-h-[calc(100vh-112px)] p-6">
      <OtpLoginDialog />

      {!hydrated ? (
        <div className="flex items-center justify-center h-48">
          <Spinner />
        </div>
      ) : !user ? (
        <div className="text-center mt-10 text-muted">Please login to continue.</div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Contribute & Earn</h1>
          <p className="mb-6">You can now contribute your products for rent or resale.</p>
          {/* Contribution form will go here */}
        </>
      )}
    </main>
  );
}
