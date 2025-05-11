"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OtpLogin from "./OtpLogin";
import { useLoginDialog } from "@/hooks/useLoginDialog";

export default function OtpLoginDialog() {
  const { isOpen, message, close } = useLoginDialog();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="!w-[800px] !h-[300px] !max-w-none p-0 overflow-hidden bg-gray-200">
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Illustration */}
          <div className="w-full md:w-1/2 bg-highlight text-white p-4 flex flex-col justify-center">
            <img
              src="/login.svg"
              alt="Login Illustration"
              className="w-full h-auto m-2 object-contain"
            />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 bg-white p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-4 font-normal flex justify-center">
                Login with OTP
              </DialogTitle>
            </DialogHeader>

            {message && (
              <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 text-sm p-3 mb-4 rounded">
                {message}
              </div>
            )}

            <OtpLogin closeDialog={close} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
