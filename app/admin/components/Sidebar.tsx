// "use client";
// import { GrJava } from "react-icons/gr";
// import { usePathname } from "next/navigation";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { SideBarLinks } from "@/app/constants";
// import { supabase } from "@/lib/supabaseClient";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/components/AuthProvider";


// // Define the structure for submenu links
// interface SubLink {
//   name: string;
//   path: string;
// }

// // Define the main sidebar link structure
// interface SidebarLink {
//   name: string;
//   path?: string;
//   icons: React.ElementType;
//   submenu?: SubLink[];
// }

// const Sidebar: React.FC = () => {
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const pathname = usePathname();
//   const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});


//   useEffect(() => {
//       const getUser = async () => {
//         const { data: { session } } = await supabase.auth.getSession();
//         if (session?.user?.email) {
//           setUserEmail(session.user.email);
//         }
//       };
//       getUser();
//     }, []);

//   useEffect(() => {
//     // Open the main menu if the current path matches any of its submenus
//     SideBarLinks.forEach((link: SidebarLink) => {
//       if (link.submenu) {
//         link.submenu.forEach((subLink) => {
//           if (pathname === subLink.path) {
//             setOpenMenus((prev) => ({
//               ...prev,
//               [link.name]: true,
//             }));
//           }
//         });
//       }
//     });
//   }, [pathname]);

//   const toggleMenu = (menuName: string) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [menuName]: !prev[menuName],
//     }));
//   };
//   const { user, signOut } = useAuth();

//   return (
//     <div className="p-4 bg-transparent">
//       <div className="flex flex-col bg-black w-72 h-full text-white rounded-lg shadow-sm overflow-y-auto max-h-screen">
//         {/* Sidebar Header */}
//         <div className="flex items-center p-4 text-xl font-bold">
//           {userEmail && (
//             <div>
//               <p className="text-white text-xs">Logged in as, </p>
//               <p className="text-xs text-highlight">{userEmail}</p>
//               <Button
//                   onClick={signOut}
//                   variant="default"
//                   className="w-full text-left px-2 py-1 text-sm bg-highlight text-white hover:bg-highlight/80 rounded-md"
//                 >Logout</Button>
//             </div>
            
//           )}
//         </div>

//         {/* Sidebar Links */}
//         <div className="mt-4">
//           {SideBarLinks.map((link: SidebarLink) => {
//             const Icon = link.icons;
//             const isOpen = openMenus[link.name];

//             return (
//               <div key={link.name}>
//                 {link.submenu ? (
//                   // Main Menu with Submenu (Toggle Logic)
//                   <div
//                     className={`flex items-center justify-between gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${
//                       isOpen ? "bg-highlight text-black" : "bg-transparent text-gray-300 hover:bg-highlight hover:text-black"
//                     }`}
//                     onClick={() => toggleMenu(link.name)}
//                   >
//                     <div className="flex items-center gap-2">
//                       <Icon className="text-xl" />
//                       <span className="capitalize">{link.name}</span>
//                     </div>
//                     <span className="ml-auto">
//                       {isOpen ? <ChevronDown /> : <ChevronRight />}
//                     </span>
//                   </div>
//                 ) : (
//                   // Main Menu without Submenu (Direct Link)
//                   <Link href={link.path || "#"}>
//                     <div
//                       className={`flex items-center gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${
//                         pathname === link.path
//                           ? "bg-highlight text-black"
//                           : "bg-transparent text-gray-300 hover:bg-highlight hover:text-black"
//                       }`}
//                     >
//                       <Icon className="text-xl" />
//                       <span className="capitalize">{link.name}</span>
//                     </div>
//                   </Link>
//                 )}

//                 {/* Submenu Links */}
//                 {isOpen && link.submenu && (
//                   <div className="ml-6 border-l-2 border-highlight pl-3">
//                     {link.submenu.map((subLink) => (
//                       <Link key={subLink.name} href={subLink.path}>
//                         <div
//                           className={`flex items-center gap-2 p-2 m-1 text-sm rounded-lg transition-all cursor-pointer ${
//                             pathname === subLink.path
//                               ? "bg-highlight text-black"
//                               : "bg-transparent text-white hover:bg-highlight hover:text-black"
//                           }`}
//                         >
//                           <span className="capitalize">{subLink.name}</span>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



"use client";
import { GrJava } from "react-icons/gr";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SideBarLinks } from "@/app/constants";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter(); // ✅ for navigation
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

  // ✅ Updated logout with redirect
  const handleLogout = async () => {
    await signOut(); // calls supabase.auth.signOut()
    router.push("/"); // redirect after logout is done
  };

  return (
    <div className="p-4 bg-transparent">
      <div className="flex flex-col bg-black w-72 h-full text-white rounded-lg shadow-sm overflow-y-auto max-h-screen">
        {/* Sidebar Header */}
        <div className="flex items-center p-4 text-xl font-bold">
          {userEmail && (
            <div>
              <p className="text-white text-xs">Logged in as, </p>
              <p className="text-xs text-highlight">{userEmail}</p>
              <Button
                onClick={handleLogout}
                variant="default"
                className="w-full text-left px-2 py-1 text-sm bg-highlight text-white hover:bg-highlight/80 rounded-md mt-2"
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
                    className={`flex items-center justify-between gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${
                      isOpen ? "bg-highlight text-black" : "bg-transparent text-gray-300 hover:bg-highlight hover:text-black"
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
                      className={`flex items-center gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${
                        pathname === link.path
                          ? "bg-highlight text-black"
                          : "bg-transparent text-gray-300 hover:bg-highlight hover:text-black"
                      }`}
                    >
                      <Icon className="text-xl" />
                      <span className="capitalize">{link.name}</span>
                    </div>
                  </Link>
                )}

                {isOpen && link.submenu && (
                  <div className="ml-6 border-l-2 border-highlight pl-3">
                    {link.submenu.map((subLink) => (
                      <Link key={subLink.name} href={subLink.path}>
                        <div
                          className={`flex items-center gap-2 p-2 m-1 text-sm rounded-lg transition-all cursor-pointer ${
                            pathname === subLink.path
                              ? "bg-highlight text-black"
                              : "bg-transparent text-white hover:bg-highlight hover:text-black"
                          }`}
                        >
                          <span className="capitalize">{subLink.name}</span>
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
