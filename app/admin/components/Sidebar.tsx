"use client";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SideBarLinks } from "@/app/constants";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { IconType } from "react-icons";

// Define the structure for submenu links
interface SubLink {
  name: string;
  path: string;
  icon: IconType;
}

// Define the main sidebar link structure
interface SidebarLink {
  name: string;
  path?: string;
  icons: React.ElementType;
  submenu?: SubLink[];
}

const Sidebar: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { user, signOut } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUser();
  }, []);

  // ✅ Expand menu based on current pathname
  useEffect(() => {
    if (!pathname) return;

    const updatedOpenMenus: Record<string, boolean> = {};

    SideBarLinks.forEach((link: SidebarLink) => {
      if (link.submenu?.some((sub) => pathname.startsWith(sub.path))) {
        updatedOpenMenus[link.name] = true;
      }
    });

    setOpenMenus(updatedOpenMenus);
  }, [pathname]);


  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="p-2 bg-transparent">
      <div className="flex flex-col bg-black/80 w-72 h-full text-white rounded-lg shadow-sm overflow-y-auto max-h-screen">
        {/* Sidebar Header */}
        <div className="flex items-center p-4 text-xl font-bold">
          {userEmail && (
            <div>
              <p className="text-white text-xs">Logged in as,</p>
              <p className="text-xs text-highlight">{userEmail}</p>
              <Button
                onClick={handleLogout}
                variant="default"
                className="w-full text-left px-2 py-1 text-sm bg-highlight text-white hover:bg-highlightHover rounded-md mt-2"
              >
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Links */}
        <div className="mt-4">
          {SideBarLinks.map((link: SidebarLink) => {
            const Icon = link.icons;
            const isOpen = openMenus[link.name];

            return (
              <div key={link.name}>
                {link.submenu ? (
                  <div
                    className={`flex items-center justify-between gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${isOpen
                      ? "bg-highlight text-black"
                      : "bg-transparent text-gray-300 hover:bg-highlight hover:text-black"
                      }`}
                    onClick={() => toggleMenu(link.name)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="text-xl" />
                      <span className="capitalize">{link.name}</span>
                    </div>
                    <span className="ml-auto">
                      {isOpen ? <ChevronDown /> : <ChevronRight />}
                    </span>
                  </div>
                ) : (
                  <Link href={link.path || "#"}>
                    <div
                      className={`flex items-center gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${pathname === link.path
                        ? "bg-highlight text-black"
                        : "bg-transparent text-gray-300 hover:bg-highlight hover:text-black"
                        }`}
                    >
                      <Icon className="text-xl" />
                      <span className="capitalize">{link.name}</span>
                    </div>
                  </Link>
                )}

                {/* Submenu */}
                {isOpen && link.submenu && (
                  <div className="ml-6 border-l-2 border-highlight pl-3">
                    {link.submenu.map((subLink) => {
                      const SubIcon = subLink.icon;
                      return (
                        <Link key={subLink.name} href={subLink.path}>
                          <div
                            className={` group flex items-center gap-2 p-2 m-1 text-sm rounded-lg transition-all cursor-pointer ${(pathname ?? "").replace(/\/$/, "") === subLink.path.replace(/\/$/, "")
                                ? "bg-highlight text-black"
                                : "bg-transparent text-white hover:bg-highlight hover:text-black"
                              }`}
                          >
                            <span className="flex items-center gap-2 capitalize">
                              <SubIcon className="text-[18px] text-yellow-500 group-hover:text-white" />
                              {subLink.name}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}


              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
