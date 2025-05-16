"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsBoxSeam } from "react-icons/bs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";


interface AgentCategiories {
  icon: IconType;
}

const AgentCategiories = [
  { name: "All Contributions", path: "/service-agent/all-contributions", icon: BsBoxSeam, description: "List of all contributions done by the user" },
  { name: "Unassigned", path: "/service-agent/unassigned-contributions", icon: IoCloseCircleOutline, description: "List of unassigned contributions" },
  { name: "Assigned", path: "/service-agent/assigned-contributions", icon: CiCircleCheck, description: "List of assigned contributions to " },
];


export default function AgentDashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUser();
  }, []);
  return (

    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to the Agent Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
        {AgentCategiories.map((agent) => (
          <Link key={agent.path} href={agent.path}>
            <div className="bg-foreground text-background dark:bg-muted rounded-xl p-5 cursor-pointer transition-all group flex flex-col items-center text-center shadow hover:shadow-xl hover:shadow-highlight">
              <div className="text-4xl mb-3 text-highlight group-hover:scale-110 group-hover:text-accent  transition-transform">
                <agent.icon />
              </div>
              <p className="text-base font-semibold text-background">{agent.name}</p>
              {userEmail && (
                <div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {agent.name === "Assigned" && userEmail ? `${agent.description} ${userEmail}` : agent.description}
                  </p>
                </div>
              )}
            </div>
          </Link>

        ))}
      </div>
    </main>
  );
}
