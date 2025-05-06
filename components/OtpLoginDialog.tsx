"use client";
import React, { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import OtpLogin from "./OtpLogin";

export default function OtpLoginDialog() {
   const [open, setOpen] = useState(false);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button
               variant="default"
               className="px-6 py-3 h-8 text-md bg-highlight hover:bg-highlight/80"
            >
               Login
            </Button>
         </DialogTrigger>

         <DialogContent className="!w-[800px] !h-[300px] !max-w-none p-0 overflow-hidden bg-gray-200" >
            <div className="flex flex-col md:flex-row w-full">
               {/* Left Section */}
               <div className="w-full md:w-1/2 bg-highlight text-white p-4 flex flex-col justify-center">
                  <div className=" flex items-center justify-center">
                     <img
                        src="/login.svg"
                        alt="Login Illustration"
                        className="w-full h-auto m-2 object-contain"
                     />
                  </div>
               </div>

               {/* Right Section */}
               <div className="w-full md:w-1/2 bg-white p-6">
                  <DialogHeader>
                     <DialogTitle className="text-2xl mb-4 font-normal flex justify-center">Login with OTP</DialogTitle>
                  </DialogHeader>
                  <OtpLogin closeDialog={() => setOpen(false)} />
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
