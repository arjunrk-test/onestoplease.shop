"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CiLogout } from "react-icons/ci";
import { FaDoorOpen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { ProfileList } from "@/app/constants";

type Props = {
  type?: "desktop" | "mobile";
};

const ProfileDropdown = ({ type = "desktop" }: Props) => {
  const { user, signOut } = useAuth();

  return (
    <div className="relative z-50">
      {user ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            {type === "mobile" ? (
              <Button
                variant="default"
                className="flex items-center gap-2 focus:ring-0 focus:outline-none focus-visible:ring-0"
              >
                <FaDoorOpen className="!w-6 !h-6 text-highlight" />
              </Button>
            ) : (

              <Button
                variant="default"
                className="flex items-center gap-2 focus:ring-0 focus:outline-none focus-visible:ring-0 bg-highlight h-8 text-white hover:bg-highlightHover"
              >
                Profile <ChevronDown className="w-4 h-4" />
              </Button>

            )}
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={8}
              className="absolute right-0 bg-white shadow-md rounded-md p-2 min-w-[160px] text-left z-[9999]"
            >
              {ProfileList.map((item) => (
                <DropdownMenu.Item asChild key={item.name}>
                  <Link
                    href={item.reference}
                    className="flex items-center gap-2 focus:ring-0 focus:outline-none px-2 py-1 text-sm hover:bg-black/50 hover:text-white rounded-md"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </DropdownMenu.Item>
              ))}

              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

              <DropdownMenu.Item>
                <Button
                  onClick={signOut}
                  variant="default"
                  className="w-full text-left px-2 py-1 text-sm bg-highlight text-white hover:bg-highlightHover rounded-md"
                >
                  <CiLogout className="text-2xl" /> Logout
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <Link href="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
      )}
    </div>
  );
};

export default ProfileDropdown;
