"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  LayoutDashboard,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Plus,
  Search,
  Bell,
  User,
  User2Icon
} from "lucide-react";

import { ProjectProvider, useProject } from "../../context/ProjectContext";

export default function DashboardLayout({ children }) {
  return (
    <ProjectProvider>
      <LayoutContent>{children}</LayoutContent>
    </ProjectProvider>
  );
}

function LayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useProject();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Projects", href: "/project", icon: FolderKanban },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Add Member", href: "/addmember", icon: User2Icon },



    { label: "Settings", href: "/settings", icon: Settings },
  ];

  /* --------- Dynamic Page Title --------- */
  const getPageTitle = () => {
    if (pathname.startsWith("/project/create"))
      return "Dashboard / Create Project";
    if (pathname.startsWith("/project"))
      return "Dashboard / All Projects";
    if (pathname.startsWith("/analytics"))
      return "Dashboard / Analytics";
    if (pathname.startsWith("/settings"))
      return "Dashboard / Settings";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-orange/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64
        bg-gray   shadow-md flex flex-col
        transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 font-bold text-lg"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm">
              CD
            </div>
            CEO Dashboard
          </Link>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* NEW PROJECT BUTTON */}
        <div className="px-5 mt-5 mb-8">
         <button
  onClick={() => router.push("/project/create")}
  className="w-full flex items-center gap-3
  px-4 py-2.5 rounded-lg
 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all text-white
  text-white font-medium
  transition"
>
  <Plus size={18} />
  New Project
</button>

    
        </div>
        
        {/* NAVIGATION */}
        <nav className="px-4 space-y-2">
          {navLinks.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition
                ${
                  isActive
                    ? "bg-slate-500 text-white"
                    : "text-slate-600 hover:bg-indigo-100"
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg
            text-red-600 hover:bg-red-100 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-white ">
          <div className="flex items-center justify-between px-6 py-4">

            {/* LEFT */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg bg-slate-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>

              <h1 className="text-xl font-semibold text-slate-800">
                {getPageTitle()}
              </h1>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6">

              {/* GLOBAL SEARCH */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border
                  bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* NOTIFICATION */}
              <div className="relative cursor-pointer">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>

              {/* USER */}
              <User size={20} className="cursor-pointer" />

            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-[320px] p-6">
            <h2 className="text-lg font-semibold">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
