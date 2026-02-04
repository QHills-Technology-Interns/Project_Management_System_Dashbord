"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronDown,
  LogOut
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
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white border-r transform transition-transform
        lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-11 h-11 bg-emerald-600 text-white rounded-full flex items-center justify-center">
              BM
            </div>
            BusinessManager
          </Link>

          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-2">
          {navItems.map((menu, index) => {
            const isOpen = openMenu === index;

            return (
              <div key={index}>
                <button
                  onClick={() => setOpenMenu(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-3 py-2 rounded-lg
                  text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <menu.icon size={18} />
                    <span className="font-medium">{menu.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {menu.children.map((item, i) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm
                          ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700 font-medium"
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

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg
            text-red-600 hover:bg-red-50 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-md bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium">
                + New Project
              </button>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  JD
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">CEO</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-[320px] p-6 shadow-xl">
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
