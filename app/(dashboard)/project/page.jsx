"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = "https://ceo-dashboard-8052.onrender.com/api";

const STATUS_OPTIONS = [
  "All Status",
  "Planning",
  "Active",
  "On Hold",
  "Completed",
  "Cancelled",
];

const SORT_OPTIONS = ["Name", "Client", "Deadline", "Budget", "Status"];
const ITEMS_PER_PAGE = 4;

export default function AllProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState("Name");
  const [openStatus, setOpenStatus] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    let data = [...projects];

    if (search) {
      data = data.filter(
        (p) =>
          p.project_name.toLowerCase().includes(search.toLowerCase()) ||
          (p.client_name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (status !== "All Status") {
      data = data.filter((p) => p.project_status === status);
    }

    data.sort((a, b) => {
      switch (sortBy) {
        case "Budget":
          return (b.total_budget || 0) - (a.total_budget || 0);
        case "Deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        case "Client":
          return (a.client_name || "").localeCompare(b.client_name || "");
        case "Status":
          return a.project_status.localeCompare(b.project_status);
        default:
          return a.project_name.localeCompare(b.project_name);
      }
    });

    return data;
  }, [projects, search, status, sortBy]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-100 text-yellow-700";
      case "Active":
        return "bg-blue-100 text-blue-700";
      case "On Hold":
        return "bg-orange-100 text-orange-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-indigo-600 font-medium">
        Loading projects...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100 px-10 py-8 space-y-10 relative">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
        All Projects
      </h1>

      {/* FILTER BAR */}
      <div className="relative z-50 flex flex-wrap gap-4 items-center backdrop-blur-xl bg-white/60 border border-white/40 shadow-xl p-5 rounded-2xl">

        {/* SEARCH */}
        <div className="relative w-[320px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search projects..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/80 border border-white/40 focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />
        </div>

        <Dropdown
          label={status}
          open={openStatus}
          setOpen={setOpenStatus}
          options={STATUS_OPTIONS}
          value={status}
          onSelect={(v) => {
            setStatus(v);
            setCurrentPage(1);
          }}
        />

        <Dropdown
          label={sortBy}
          open={openSort}
          setOpen={setOpenSort}
          options={SORT_OPTIONS}
          value={sortBy}
          onSelect={setSortBy}
        />

        <div className="ml-auto">
          <button
            onClick={() => router.push("/project/create")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all text-white px-6 py-2.5 rounded-xl font-medium shadow-lg"
          >
            + New Project
          </button>
        </div>
      </div>

{/* PROJECT CARDS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-0">
  {paginatedProjects.map((p, index) => {
    const progress = p.progress_percentage || 0;

    const burnout = progress < 60 ? "Warning" : "On Track";
    const burnoutStyle =
      burnout === "On Track"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700";

    const statusColor = {
      Planning: "from-yellow-400 to-yellow-500",
      Active: "from-blue-500 to-indigo-600",
      "On Hold": "from-orange-400 to-orange-600",
      Completed: "from-green-500 to-emerald-600",
      Cancelled: "from-red-500 to-rose-600",
    };

    const gradient =
      statusColor[p.project_status] ||
      "from-indigo-500 to-purple-600";

    return (
      <div
  key={p.project_id}
  onClick={() => router.push(`/project/${p.project_id}`)}
  className="relative cursor-pointer backdrop-blur-xl bg-white/60 border border-white/40 
             shadow-xl rounded-2xl p-6 space-y-6 transition-all duration-500 
             hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-200 
             opacity-0 animate-fadeSlide"
  style={{
    animationDelay: `${index * 120}ms`,
    animationFillMode: "forwards",
  }}
>
        {/* TOP HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-lg text-slate-800">
              {p.project_name}
            </h2>
            <p className="text-sm text-gray-500">
              {p.client_name}
            </p>
          </div>

          {/* Animated Circular Progress */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 rotate-[-90deg]">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="#e5e7eb"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="url(#grad)"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={150}
                strokeDashoffset={
                  150 - (150 * progress) / 100
                }
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="grad">
                  <stop
                    offset="0%"
                    stopColor="#6366f1"
                  />
                  <stop
                    offset="100%"
                    stopColor="#8b5cf6"
                  />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">
              {progress}%
            </span>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white shadow`}
          >
            {p.project_status}
          </span>
        </div>

        {/* BUDGET */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Budget</span>
          <span className="font-semibold text-indigo-700">
            ${p.total_budget || 0}
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">
              {progress}%
            </span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* DEADLINE */}
<div className="flex justify-between text-sm">
  <span className="text-gray-500">Deadline</span>

  <span className="font-medium text-gray-700">
    {(() => {
      const raw =
        p.end_date_actual ||
        p.end_date_planned ||
        p.start_date_actual ||
        p.start_date_planned;

      if (!raw) return "Not Set";

      const parts = raw.split("-"); // DATEONLY safe

      if (parts.length !== 3) return "Invalid Date";

      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);

      const dateObj = new Date(year, month, day);

      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    })()}
  </span>
</div>

        {/* BURNOUT STATUS */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Burnout Status
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${burnoutStyle}`}
          >
            {burnout}
          </span>
        </div>
      </div>
    );
  })}
</div>


      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white/70 backdrop-blur-md border shadow hover:scale-110 transition disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-1.5 rounded-xl text-sm shadow transition
                ${
                  currentPage === page
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-white/70 backdrop-blur-md hover:bg-white"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-white/70 backdrop-blur-md border shadow hover:scale-110 transition disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Animation CSS */}
      <style jsx global>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}

/* ================= PREMIUM DROPDOWN ================= */
function Dropdown({ label, open, setOpen, options, value, onSelect }) {
  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl min-w-[160px] shadow hover:shadow-lg transition"
      >
        {label}
        <ChevronDown size={16} className="ml-auto text-gray-500" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl animate-fadeSlide">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-indigo-50 transition
              ${opt === value ? "bg-indigo-100 font-medium" : ""}`}
            >
              {opt === value && <Check size={14} />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}  