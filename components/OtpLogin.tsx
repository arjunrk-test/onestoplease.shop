// "use client";
// import { useState, useEffect, useTransition } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp";
// import { loadingIndicator } from "@/app/constants";

// type Props = {
//   closeDialog: () => void;
// };

// export default function OtpLogin({ closeDialog }: Props) {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [phase, setPhase] = useState<"phone" | "otp">("phone");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [resendCountdown, setResendCountdown] = useState(0);
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (resendCountdown > 0) {
//       timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   useEffect(() => {
//     if (otp.length === 6) {
//       verifyOtp();
//     }
//   }, [otp]);

//   const sendOtp = async () => {
//     if (phoneNumber.length !== 10) {
//       setError("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     setResendCountdown(30);
//     setError("");
//     setSuccess("");
//     startTransition(async () => {
//       const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phoneNumber}` });
//       if (error) {
//         setError(error.message);
//         setResendCountdown(0);
//       } else {
//         setPhase("otp");
//         setSuccess("OTP sent successfully.");
//       }
//     });
//   };

//   const verifyOtp = async () => {
//     startTransition(async () => {
//       setError("");
//       setSuccess("");

//       const { error } = await supabase.auth.verifyOtp({
//         phone: `+91${phoneNumber}`,
//         token: otp,
//         type: "sms",
//       });

//       if (error) {
//         setError("Invalid or expired OTP. Please try again.");
//         setSuccess("");
//       } else {
//         setSuccess("Login successful");
//         closeDialog();
//       }
//     });
//   };

//   return (
//     <div className="space-y-4 p-4">
//       {phase === "phone" ? (
//         <>
//           <div className="flex gap-2 items-center">
//             <span className="text-sm font-medium">+91</span>
//             <Input
//               type="tel"
//               placeholder="Enter your mobile number"
//               maxLength={10}
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
//               className="flex-1 bg-white border border-highlight"
//             />
//           </div>
//           <Button
//             onClick={sendOtp}
//             disabled={isPending || resendCountdown > 0}
//             className="w-full bg-highlight text-white hover:bg-highlight/90 disabled:cursor-not-allowed"
//           >
//             {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}` : "Send OTP"}
//           </Button>
//         </>
//       ) : (
//         <>
//           <div className="flex justify-center">
//             <InputOTP
//               maxLength={6}
//               value={otp}
//               onChange={(value) => setOtp(value)}
//               className="w-full border border-highlight"
//             >
//               <InputOTPGroup>
//                 <InputOTPSlot index={0} />
//                 <InputOTPSlot index={1} />
//                 <InputOTPSlot index={2} />
//               </InputOTPGroup>
//               <InputOTPSeparator />
//               <InputOTPGroup>
//                 <InputOTPSlot index={3} />
//                 <InputOTPSlot index={4} />
//                 <InputOTPSlot index={5} />
//               </InputOTPGroup>
//             </InputOTP>
//           </div>
//         </>
//       )}

//       <div className="text-center space-y-1">
//         {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
//         {success && <p className="text-sm text-green-600 font-medium">{success}</p>}
//       </div>

//       {isPending && loadingIndicator}
//     </div>
//   );
// }


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
