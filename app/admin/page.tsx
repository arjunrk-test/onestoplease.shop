"use client";

import { IconType } from "react-icons";
import { FaHandsHelping } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RxActivityLog } from "react-icons/rx";
import { GrTransaction } from "react-icons/gr";
import Link from "next/link";


interface AdminCategories {
  icon: IconType
}

const AdminCategories = [
  { name: "Edit Products", path: "/admin/products", icon: CiEdit, description: "List of all contributions done by the user" },
  { name: "Contributions", path: "/admin/contributions", icon: FaHandsHelping, description: "List of all contributions done by the user" },
  { name: "Add Users", path: "/admin/add-users", icon: FaUsers, description: "List of all contributions done by the user" },
  { name: "Logs & Activity", path: "/admin/logs", icon: RxActivityLog, description: "List of all contributions done by the user" },
  { name: "Orders", path: "/admin/orders", icon: GrTransaction, description: "List of all contributions done by the user" },
];

export default function AdminDashboard() {
  return (
    <main className="max-h-screen text-foreground px-6 py-10">
      <h1 className="text-2xl text-highlight font-bold mb-6">Welcome to the Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
        {AdminCategories.map((admin) => (
          <Link key={admin.path} href={admin.path}>
            <div className="bg-gray text-grayInverted dark:bg-muted rounded-xl p-5 cursor-pointer transition-all group flex flex-col items-center text-center shadow hover:shadow-xl hover:shadow-highlight">
              <div className="text-4xl mb-3 text-highlight group-hover:scale-110 group-hover:text-accent  transition-transform">
                <admin.icon />
              </div>
              <p className="text-base font-semibold text-grayInverted">{admin.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                    {admin.description}
                  </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
