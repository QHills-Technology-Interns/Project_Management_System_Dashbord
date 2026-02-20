"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Activity,
  AlertTriangle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BadgeDollarSign,
} from "lucide-react";

/* ================= FONT ================= */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* ================= CONFIG ================= */
const API_BASE = "https://ceo-dashboard-8052.onrender.com/api";
const ITEMS_PER_PAGE = 4;

/* ================= PAGE ================= */
export default function DashboardPage() {
  const router = useRouter();

  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ================= MOUNT FIX (HYDRATION SAFE) ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= INIT ================= */
  useEffect(() => {
  const init = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await fetchDashboard(token);
    } catch (e) {
      console.error("Dashboard overview failed");
    }

    try {
      await fetchProjects(token);
    } catch (e) {
      console.error("Projects fetch failed");
    }

    try {
      await fetchMilestones(token);
    } catch (e) {
      console.error("Milestones fetch failed");
    }

    setLoading(false); // 🔥 ALWAYS RUNS
  };

  init();
}, []);

  /* ================= 🔔 AUTO REFRESH EVERY 30s ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const interval = setInterval(() => {
      fetchDashboard(token);
      fetchProjects(token);
      fetchMilestones(token);
      console.log("🔄 Dashboard auto refreshed");
    }, 30000); // 30 sec

    return () => clearInterval(interval);
  }, []);

  /* ================= FETCHERS ================= */
  const fetchDashboard = async (token) => {
    const res = await axios.get(`${API_BASE}/dashboard/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOverview(res.data?.data || null);
  };

  const fetchProjects = async (token) => {
    const res = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(res.data?.data || []);
  };
const fetchMilestones = async (token) => {
  const res = await axios.get(`${API_BASE}/milestones`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const raw = res.data?.data || [];

  // 1️⃣ Normalize once
  const normalized = raw.map(normalizeMilestone);

  // 2️⃣ Pending milestones → right side UI
  const pendingOnly = normalized.filter(
    (m) => m.status === "Pending"
  );
  setMilestones(pendingOnly);

  // 3️⃣ Paid milestones → Total Revenue
  const revenue = normalized
    .filter((m) => m.status === "Paid")
    .reduce((sum, m) => sum + m.amount, 0);

  // 4️⃣ Update dashboard revenue
  setOverview((prev) => ({
    ...prev,
    financial: {
      ...prev?.financial,
      total_revenue: revenue,
    },
  }));
};


  /* ================= MILESTONE NORMALIZER ================= */
const normalizeMilestone = (m) => ({
  id: m.milestone_id || m.id,
  name: m.milestone_name || m.name,
  amount: Number(m.total_amount || m.amount || 0),
  due_date: m.payment_due_date || m.due_date,
  status: m.payment_status || m.status,
  project_id: m.project_id,
});


  /* ================= HELPERS ================= */
  const getProgressColor = (value) => {
    if (value < 40) return "from-red-500 to-rose-500";
    if (value < 70) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-600";
  };

  const getDeadline = (p) => {
    const raw =
      p.end_date_actual ||
      p.end_date_planned ||
      p.start_date_actual ||
      p.start_date_planned;

    if (!raw) return "Not Set";

    const dateObj = new Date(raw);

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "in progress":
      return "bg-blue-100 text-blue-700";
    case "on hold":
      return "bg-indigo-100 text-indigo-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "at risk":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const calculateTotalRevenue = (milestones) => {
  return milestones
    .filter((m) => m.payment_status === "Paid")
    .reduce((sum, m) => sum + Number(m.total_amount || 0), 0);
};

  /* ================= LOADING ================= */
  if (!mounted || loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading dashboard...
      </p>
    );
  }

  /* ================= UI ================= */
  return (
    <div
      className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100 px-4 sm:px-8 lg:px-12 py-10 space-y-12`}
    >
      {/* ================= HEADER ================= */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Real-time project insights
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <AnimatedKpiCard
          title="Total Projects"
          value={overview?.projects?.total || 0}
          icon={FolderKanban}
          gradient="from-blue-500 to-indigo-600"
        />

        <AnimatedKpiCard
          title="Active Projects"
          value={overview?.projects?.in_progress || 0}
          icon={Activity}
          gradient="from-green-500 to-emerald-600"
        />

        <AnimatedKpiCard
          title="Projects At Risk"
          value={
            (overview?.projects?.total || 0) -
            (overview?.projects?.completed || 0)
          }
          icon={AlertTriangle}
          gradient="from-yellow-500 to-orange-500"
        />

        <AnimatedKpiCard
          title="Total Revenue"
          value={overview?.financial?.total_revenue || 0}
          icon={DollarSign}
          gradient="from-purple-500 to-indigo-600"
        />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ================= PROJECT TABLE ================= */}
        <div className="xl:col-span-2 backdrop-blur-xl bg-white/90 border border-white/40 shadow-2xl rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-xl font-semibold">
              Project Performance
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="bg-indigo-50 text-indigo-700">
                <tr>
                  <th className="px-6 py-4 text-left">Project</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Progress</th>
                  <th className="px-6 py-4 text-left">Deadline</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProjects.map((p) => {
                  const progress =p.total_phases && p.completed_phases? Math.round((p.completed_phases / p.total_phases) * 100): 0;

                  const gradient = getProgressColor(progress);

                  return (
                    <tr
                      key={p.project_id}
                      className="border-t hover:bg-indigo-50 transition-all duration-300"
                    >
                      <td className="px-6 py-5 font-medium text-slate-700">
                        {p.project_name}
                      </td>

                     <td className="px-6 py-5 text-center">
  <span
    className={`
      inline-flex items-center justify-center
      px-5 py-1.5
      text-xs font-semibold
      rounded-full
      whitespace-nowrap
      min-w-[110px]
      ${getStatusStyle(p.project_status)}
    `}
  >
    {p.project_status}
  </span>
</td>



                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-semibold">
                            {progress}%
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {getDeadline(p)}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() =>
                            router.push(`/project/${p.project_id}`)
                          }
                          className="text-indigo-600 font-medium hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 p-6">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className="p-2 bg-white shadow rounded-lg"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-1.5 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-white shadow rounded-lg"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ================= MILESTONES ================= */}
        <div className="backdrop-blur-xl bg-white/90 border border-white/40 shadow-2xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5 text-slate-800">
            Upcoming Milestones
          </h2>

          {milestones.length === 0 && (
            <p className="text-sm text-gray-500">
              No milestones available
            </p>
          )}

          {milestones.map((m) => (
  <MilestoneCard
    key={m.id}
    title={m.name}
    project={`Project ID: ${m.project_id}`}
    amount={m.amount}
    date={m.due_date ? new Date(m.due_date).toLocaleDateString() : "—"}
    status={m.status}
  />
))}

        
        </div>
      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */
function AnimatedKpiCard({ title, value, icon: Icon, gradient }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setDisplay(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div className="backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800">
            {display}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} text-white flex items-center justify-center shadow-lg`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

/* ================= MILESTONE CARD ================= */
function MilestoneCard({ title, project, amount, date, status }) {
  const statusStyle =
    status === "Paid"
      ? "bg-green-100 text-green-700"
      : status === "Overdue"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-800">
            {title}
          </h3>
          <p className="text-sm text-gray-500">
            {project}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyle}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar size={14} />
          {date}
        </div>

        <div className="flex items-center gap-2 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          <BadgeDollarSign size={16} />
          ₹{amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
