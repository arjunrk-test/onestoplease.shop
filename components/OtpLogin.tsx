"use client";
import { auth } from "@/firebase"
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { loadingIndicator } from "@/app/constants";

type Props = {
  closeDialog: () => void;
};

function OtpLogin({ closeDialog }: Props) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth, "recaptcha-container", { size: "invisible" }
    );
    setRecaptchaVerifier(recaptchaVerifier);
    return () => { recaptchaVerifier.clear(); }
  }, []);

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6;
    if (hasEnteredAllDigits) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");
      setSuccess("");
      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }
      try {
        await confirmationResult.confirm(otp);
        closeDialog(); // ✅ close dialog on success
        router.replace("/"); // or wherever you want
      } catch (error) {
        console.log(error);
        setError("Failed to verify OTP. Please check the OTP.");
        setSuccess("");
      }
    });
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setResendCountdown(30);

    startTransition(async () => {
      setError("");
      if (!recaptchaVerifier) {
        return setError("Recaptcha verifier is not initialized.");
      }

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth, phoneNumber, recaptchaVerifier
        );
        setConfirmationResult(confirmationResult);
        setSuccess("OTP sent successfully.");
      } catch (err: any) {
        console.log(err);
        setResendCountdown(0);

        if (err.code === "auth/invalid-phone-number")
          setError("Invalid phone number. Please check the number.");
        else if (err.code === "auth/too-many-requests")
          setError("Too many requests. Please try again later.");
        else
          setError("Failed to send OTP. Please try later.");
      }
    });
  };

  return (
    <div>
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <Input
            className="text-black w-full bg-white border border-highlight selection:bg-gray-300"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            Please enter your number with the country code (i.e. +91 for India)
          </p>
        </form>
      )}

      {confirmationResult && (
        <div className="flex items-center justify-center mt-4 ">
          <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} className="w-full border border-highlight">
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
        disabled={!phoneNumber || isPending || resendCountdown > 0}
        onClick={() => requestOtp()}
        className="mt-5 w-full bg-highlight hover:bg-highlight/80 disabled:cursor-not-allowed"
      >
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown}`
          : isPending
            ? "Sending OTP"
            : "Send OTP"}
      </Button>

      <div className="p-4 text-center">
        {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
        {success && <p className="text-green-600 font-semibold text-sm">{success}</p>}
      </div>

      <div id="recaptcha-container" className="fixed bottom-0 right-0 opacity-0 pointer-events-none z-[-1]" />
      {isPending && loadingIndicator}
    </div>
  );
}

export default OtpLogin;
