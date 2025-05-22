"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import useIsMobile from "@/hooks/useIsMobile";

export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const isMobile = useIsMobile();

  const handleSave = async () => {
    alert("Save feature coming soon!");
  };

  const addNewAddress = () => {
    alert("Add address feature coming soon!");
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-200">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold mb-8 uppercase">Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                disabled
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="whatsappNotifications"
              className="data-[state=checked]:bg-highlight data-[state=checked]:text-white border border-gray-300"
              checked={whatsappNotifications}
              onCheckedChange={(checked) =>
                setWhatsappNotifications(!!checked)
              }
            />
            <Label htmlFor="whatsappNotifications">
              Receive WhatsApp Notifications
            </Label>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button
                variant="default"
                onClick={addNewAddress}
                className="w-full bg-highlight hover:bg-highlightHover"
              >
                Add New Address
              </Button>
            </div>

            <div className="space-y-4">
              <Button onClick={handleSave} className="w-full bg-highlight hover:bg-highlightHover">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}