"use client";
import { useState, useEffect, useTransition } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./ui/input-otp";
import { loadingIndicator } from "@/app/constants";

type Props = {
  closeDialog: () => void;
};

export default function OtpLogin({ closeDialog }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
  }, [otp]);

  const sendOtp = async () => {
    setError(null);
    setSuccess("");
    setResendCountdown(30);

    const fullPhone = `+91${phoneNumber.trim()}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });

    if (error) {
      setError(error.message);
      setResendCountdown(0);
    } else {
      setIsOtpSent(true);
      setSuccess("OTP sent successfully.");
    }
  };

  const verifyOtp = async () => {
    startTransition(async () => {
      setError(null);
      const fullPhone = `+91${phoneNumber.trim()}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otp,
        type: "sms",
      });

      if (error) {
        console.error(error);
        setError("Invalid or expired OTP. Try again.");
      } else {
        setSuccess("Login successful!");
        closeDialog();
      }
    });
  };

  return (
    <div>
      {!isOtpSent ? (
        <>
          <Input
            className="text-black w-full bg-white border border-highlight selection:bg-gray-300"
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            We'll send an OTP to your number (India only)
          </p>
        </>
      ) : (
        <div className="flex items-center justify-center mt-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="w-full border border-highlight"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}

      <Button
        onClick={sendOtp}
        disabled={!phoneNumber || isPending || resendCountdown > 0}
        className="mt-5 w-full bg-highlight hover:bg-highlight/80 disabled:cursor-not-allowed"
      >
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown}s`
          : isPending
          ? "Sending OTP..."
          : "Send OTP"}
      </Button>

      <div className="p-4 text-center">
        {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 font-semibold text-sm">{success}</p>
        )}
      </div>

      {isPending && loadingIndicator}
    </div>
  );
}
