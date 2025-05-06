"use client";
import { GrJava } from "react-icons/gr";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SideBarLinks } from "@/app/constants";

// Define the structure for submenu links
interface SubLink {
  name: string;
  path: string;
}

// Define the main sidebar link structure
interface SidebarLink {
  name: string;
  path?: string;
  icons: React.ElementType;
  submenu?: SubLink[];
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Open the main menu if the current path matches any of its submenus
    SideBarLinks.forEach((link: SidebarLink) => {
      if (link.submenu) {
        link.submenu.forEach((subLink) => {
          if (pathname === subLink.path) {
            setOpenMenus((prev) => ({
              ...prev,
              [link.name]: true,
            }));
          }
        });
      }
    });
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <div className="p-4 bg-transparent">
      <div className="flex flex-col bg-foreground w-64 h-full text-background rounded-lg shadow-sm overflow-y-auto max-h-screen">
        {/* Sidebar Header */}
        <div className="flex justify-center p-2 text-2xl text-highlight font-semibold">
          One Stop Lease
        </div>

        {/* Sidebar Links */}
        <div className="mt-4">
          {SideBarLinks.map((link: SidebarLink) => {
            const Icon = link.icons;
            const isOpen = openMenus[link.name];

            return (
              <div key={link.name}>
                {link.submenu ? (
                  // Main Menu with Submenu (Toggle Logic)
                  <div
                    className={`flex items-center justify-between gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${
                      isOpen ? "bg-highlight text-background" : "bg-transparent text-gray-300 hover:bg-highlight hover:text-black"
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
                  // Main Menu without Submenu (Direct Link)
                  <Link href={link.path || "#"}>
                    <div
                      className={`flex items-center gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${
                        pathname === link.path
                          ? "bg-highlight text-background"
                          : "bg-transparent text-gray-300 hover:bg-highlight hover:text-background"
                      }`}
                    >
                      <Icon className="text-xl" />
                      <span className="capitalize">{link.name}</span>
                    </div>
                  </Link>
                )}

                {/* Submenu Links */}
                {isOpen && link.submenu && (
                  <div className="ml-6 border-l-2 border-highlight pl-3">
                    {link.submenu.map((subLink) => (
                      <Link key={subLink.name} href={subLink.path}>
                        <div
                          className={`flex items-center gap-2 p-2 m-1 text-sm rounded-lg transition-all cursor-pointer ${
                            pathname === subLink.path
                              ? "bg-highlight text-background"
                              : "bg-transparent text-background hover:bg-highlight hover:text-background"
                          }`}
                        >
                          <span className="flex items-center gap-2 capitalize">{subLink.icon}{subLink.name}</span>
                        </div>
                      </Link>
                    ))}
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
