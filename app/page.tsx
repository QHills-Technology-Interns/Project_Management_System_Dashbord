// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   FolderKanban,
//   Receipt,
//   Flag,
//   FileText,
//   Users,
//   Activity,
//   Handshake,
//   Search,
//   Menu,
//   ChevronDown
// } from "lucide-react";

// const navItems = [
//   { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
//   { label: "Projects", icon: FolderKanban, href: "/project/create" },
//   { label: "Expenses", icon: Receipt, href: "/expensses/create" },
//   { label: "Milestones", icon: Flag, href: "/milstone/create" },
//   { label: "Invoices", icon: FileText, href: "/invoice/create" },
//   { label: "Sales Team", icon: Users, href: "/salest-team" },
//   { label: "Sales Activity", icon: Activity, href: "/sales-activity" },
//   { label: "Sales Deals", icon: Handshake, href: "/sales-deal/create" }
// ];

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(true);

//   return (
//     <div className="flex h-screen bg-slate-100 overflow-hidden">

//       {/* ================= SIDEBAR ================= */}
//       <aside className={`bg-white border-r transition-all duration-300 ${open ? "w-64" : "w-16"}`}>
//         {/* Logo */}
//         <div className="h-16 flex items-center gap-3 px-4 border-b">
//           <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
//             P
//           </div>
//           {open && <span className="font-semibold text-lg">PMS</span>}
//           <button onClick={() => setOpen(!open)} className="ml-auto">
//             <Menu size={18} />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="p-2 space-y-1">
//           {navItems.map((item) => {
//             const isActive = pathname.startsWith(item.href);

//             return (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] transition
//                 ${
//                   isActive
//                     ? "bg-blue-50 text-blue-600 font-medium"
//                     : "text-slate-600 hover:bg-slate-100"
//                 }`}
//               >
//                 <item.icon size={20} />
//                 {open && <span>{item.label}</span>}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* ================= MAIN ================= */}
//       <div className="flex-1 flex flex-col">

//         {/* TOP BAR (ZOHO STYLE) */}
//         <header className="h-16 bg-white border-b flex items-center justify-between px-6">
//           {/* Search */}
//           <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg w-96">
//             <Search size={16} className="text-slate-500" />
//             <input
//               placeholder="Search projects, invoices..."
//               className="bg-transparent text-sm w-full outline-none"
//             />
//           </div>

//           {/* Org + User */}
//           <div className="flex items-center gap-4">
//             <button className="text-sm font-medium flex items-center gap-1">
//               Demo Org <ChevronDown size={14} />
//             </button>

//             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
//               A
//             </div>
//           </div>
//         </header>

//         {/* CONTENT */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
export default function Home() {
  return <h1>Hello</h1>;
}
