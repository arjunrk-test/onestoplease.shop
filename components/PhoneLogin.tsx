"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ phone });

    if (error) {
      setMessage(error.message);
    } else {
      setStep("otp");
      setMessage("OTP sent successfully.");
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login successful!");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow">
      {step === "phone" ? (
        <>
          <Input
            type="tel"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-4"
          />
          <Button onClick={sendOtp} disabled={loading || !phone} className="w-full">
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </>
      ) : (
        <>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4"
          />
          <Button onClick={verifyOtp} disabled={loading || otp.length !== 6} className="w-full">
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </>
      )}
      {message && <p className="text-center mt-4 text-sm text-muted">{message}</p>}
    </div>
  );
}
