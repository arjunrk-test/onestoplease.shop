"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import OtpLogin from "./OtpLogin";
import { useLoginDialog } from "@/hooks/useLoginDialog";

export default function MobileOtpLoginDialog() {
  const { isOpen, message, close } = useLoginDialog();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="w-[95%] max-w-[360px] p-5 bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center mb-2">
            Login with OTP
          </DialogTitle>
        </DialogHeader>

        {message && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 text-xs p-2 mb-4 rounded">
            {message}
          </div>
        )}

        <OtpLogin closeDialog={close} />
      </DialogContent>
    </Dialog>
  );
}
