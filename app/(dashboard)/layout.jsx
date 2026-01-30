"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Receipt,
  Flag,
  FileText,
  Users,
  Activity,
  Handshake,
  DollarSign,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

const navItems = [
  {
    label: "Projects",
    icon: FolderKanban,
    children: [
      { label: "Project", href: "/project/create", icon: FolderKanban },
      { label: "Expenses", href: "/expensses/create", icon: Receipt },
      { label: "Milestones", href: "/milstone/create", icon: Flag }
    ]
  },
  {
    label: "Sales",
    icon: Handshake,
    children: [
      { label: "Sales Team", href: "/salest-team/create", icon: Users },
      { label: "Sales Activities", href: "/sales-activity", icon: Activity },
      { label: "Sales Deal", href: "/sales-deal/create", icon: FileText }
    ]
  },
  {
    label: "Finance",
    icon: DollarSign,
    children: [
      { label: "Invoice", href: "/invoice/create", icon: DollarSign }
    ]
  }
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Overlay (mobile) */}
      <div
        className={`fixed inset-0 bg-black/30 z-20 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform
        lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
  <Link href="/dashboard" className="font-bold text-lg hover:text-blue-600">
    PMS
  </Link>
  <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
    <X size={20} />
  </button>
</div>

        {/* Navigation */}
        <nav className="p-2 space-y-2">
          {navItems.map((menu, index) => {
            const isOpen = openMenu === index;

            return (
              <div key={index}>
                {/* Parent Menu */}
                <button
                  onClick={() => setOpenMenu(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <menu.icon size={18} />
                  <span className="font-medium text-lg">{menu.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Submenu */}
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {menu.children.map((item, i) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-base
                            ${
                              isActive
                                ? "bg-blue-100 text-blue-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          <item.icon size={14} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-gray-900 shadow">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded bg-white/20 text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1 className="text-white text-xl font-semibold">
                Project Management System
              </h1>
            </div>

            <div className="flex items-center gap-4 text-white">
              <button className="px-3 py-1 rounded bg-white/20 text-sm">
                + New Project
              </button>
              <div className="w-8 h-8 bg-white text-blue-600 font-bold flex items-center justify-center rounded-full">
                P
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
