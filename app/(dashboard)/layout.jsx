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
  LogOut,
  Search
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    navItems.forEach((menu, index) => {
      if (menu.children.some(child => pathname.startsWith(child.href))) {
        setOpenMenu(index);
      }
    });
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-gray-100 text-gray-800
        transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <Link href="/dashboard" className="flex items-center gap-3 font-bold text-lg">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
              BM
            </div>
            BusinessManager
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-2">
          {navItems.map((menu, index) => {
            const isOpen = openMenu === index;

            return (
              <div key={index}>
                <button
                  onClick={() => setOpenMenu(isOpen ? null : index)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 rounded-lg transition
                  ${isOpen ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"}`}
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
                  <div className="ml-4 mt-1 space-y-1 border-l border-gray-300 pl-4">
                    {menu.children.map((item, i) => {
                      const isActive = pathname.startsWith(item.href);

                      return (
                        <Link
                          key={i}
                          href={item.href}
                          className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
                          ${
                            isActive
                              ? "bg-emerald-600 text-white font-medium"
                              : "text-slate-700 hover:bg-emerald-100"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-emerald-700 rounded-r" />
                          )}
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

        <div className="absolute bottom-4 w-full px-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 px-4 py-2 rounded-lg
            text-red-600 hover:bg-red-100 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
  <div className="flex items-center px-6 py-4">

    {/* Left: Menu button */}
    <button
      className="lg:hidden p-2 rounded-lg bg-slate-100"
      onClick={() => setSidebarOpen(true)}
    >
      <Menu size={20} />
    </button>

    {/* Center/Right: Dashboard Heading */}
    <h1 className="ml-6 text-xl font-semibold text-slate-800">
      Dashboard
    </h1>

    {/* Right controls */}
    <div className="flex items-center gap-4 ml-auto">

      {/* Search Bar */}
      <div className="relative hidden sm:block">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects.."
          className="pl-9 pr-3 py-2 w-56 rounded-lg border text-sm
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* + New Project */}
      <button
        onClick={() => router.push("/project/create")}
        className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow hover:bg-emerald-700 transition"
      >
        + New Project
      </button>
    </div>

  </div>
</header>


        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Logout Modal */}
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
