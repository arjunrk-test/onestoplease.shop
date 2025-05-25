"use client";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AgentSidebarLinks } from "@/app/constants";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { IconType } from "react-icons";
import ThemeToggle from "@/components/ThemeToogle";

// Define the structure for submenu links
interface SubLink {
  name: string;
  path: string;
  icon: IconType;
}

// Define the main sidebar link structure
interface AgentSidebarLink {
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
    const updatedOpenMenus: Record<string, boolean> = {};

    AgentSidebarLinks.forEach((link: AgentSidebarLink) => {
      if (link.submenu?.some((sub) => (pathname ?? "").startsWith(sub.path))) {
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
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email;

    if (!email) return;

    // 1. Fetch agent ID
    const { data: agent, error: agentError } = await supabase
      .from("service_agents")
      .select("id")
      .eq("email", email)
      .single();

    if (agentError || !agent?.id) {
      console.error("❌ Agent not found:", agentError);
      return;
    }

    // 2. First confirm open session exists
    const { data: openSessions, error: sessionError } = await supabase
      .from("agent_login_sessions")
      .select("*")
      .eq("agent_id", agent.id)
      .is("logout_time", null);

    if (sessionError) {
      console.error("❌ Failed to fetch sessions:", sessionError);
      return;
    }

    if (openSessions?.length === 0) {
      console.log("⚠️ No open session found for this agent.");
    } else {

      const now = new Date().toISOString();
      const { data: updatedRows, error: updateError } = await supabase
        .from("agent_login_sessions")
        .update({ logout_time: now })
        .eq("agent_id", agent.id)
        .is("logout_time", null)
        .select(); // Forces returning updated rows

      if (updateError) {
        console.error("❌ Failed to update logout_time:", updateError.message);
      } 
    }

    // 4. Set logged_in = false
    await supabase
      .from("service_agents")
      .update({ logged_in: false })
      .eq("email", email);

    // 5. Sign out
    await signOut();
    router.push("/");
  };





  return (
  <div className="p-2 bg-foreground h-full">
    <div className="flex flex-col bg-background w-72 h-full text-foreground rounded-lg shadow-sm overflow-hidden">
      
      {/* Sidebar Header */}
        <div className="p-4 text-sm">
  {userEmail && (
    <div className="flex items-center justify-between">
      <div>
        <p className=" text-xs">Logged in as,</p>
        <p className="text-xs text-highlight">{userEmail}</p>
      </div>
      <div className="scale-90">
        <ThemeToggle />
      </div>
    </div>
  )}
</div>


      {/* Sidebar Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-2">
          {AgentSidebarLinks.map((link: AgentSidebarLink) => {
            const Icon = link.icons;
            const isOpen = openMenus[link.name];

            return (
              <div key={link.name}>
                {link.submenu ? (
                  <div
                    className={`flex items-center justify-between gap-3 p-2 m-2 text-sm duration-150 rounded-xl transition-all cursor-pointer ${
                      isOpen
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

                {/* Submenu */}
                {isOpen && link.submenu && (
                  <div className="ml-6 border-l-2 border-highlight pl-3">
                    {link.submenu.map((subLink) => {
                      const SubIcon = subLink.icon;
                      return (
                        <Link key={subLink.name} href={subLink.path}>
                          <div
                            className={` group flex items-center gap-2 p-2 m-1 text-sm rounded-lg transition-all cursor-pointer ${
                              (pathname ?? "").replace(/\/$/, "") ===
                              subLink.path.replace(/\/$/, "")
                                ? "bg-highlight text-black"
                                : "bg-transparent text-foreground hover:bg-highlight hover:text-background"
                            }`}
                          >
                            <span className="flex items-center gap-2 capitalize">
                              <SubIcon className="text-md text-foreground group-hover:text-background" />
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

      {/* Sidebar Footer */}
      <div className="p-4 border-t dark:border-white/10 border-black/10">
        <Button
          onClick={handleLogout}
          variant="default"
          className="w-full text-left px-2 py-1 text-sm bg-red-600 hover:bg-red-500 text-foreground rounded-md"
        >
          Logout
        </Button>
      </div>
    </div>
  </div>
);
}

export default Sidebar;
