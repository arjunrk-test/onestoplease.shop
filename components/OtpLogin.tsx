"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { loadingIndicator } from "@/app/constants";

type Props = {
  closeDialog: () => void;
};

function OtpLogin({ closeDialog }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);

  const requestOtp = async () => {
    setError(null);
    setSuccess("Simulated OTP sent (replace with Supabase logic)");
  };

  const verifyOtp = async () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setSuccess("Simulated OTP verification successful");
      closeDialog();
    }, 1000);
  };

  return (
    <div>
      <Input
        className="text-black w-full bg-white border border-highlight selection:bg-gray-300"
        type="tel"
        placeholder="+91XXXXXXXXXX"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button
        onClick={requestOtp}
        className="mt-5 w-full bg-highlight hover:bg-highlight/80"
      >
        Send OTP
      </Button>

      <Input
        className="mt-4 text-black w-full bg-white border border-highlight selection:bg-gray-300"
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <Button
        onClick={verifyOtp}
        disabled={!otp}
        className="mt-3 w-full bg-highlight hover:bg-highlight/80"
      >
        Verify OTP
      </Button>

      <div className="p-4 text-center">
        {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
        {success && <p className="text-green-600 font-semibold text-sm">{success}</p>}
      </div>

      {isPending && loadingIndicator}
    </div>
  );
}

export default OtpLogin;
