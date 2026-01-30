"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FolderKanban,
  IndianRupee,
  TrendingUp,
  Users,
  AlertTriangle,
  FileText,
  Handshake
} from "lucide-react";

const API = "https://ceo-dashboard-z65r.onrender.com/api/dashboard";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [projectHealth, setProjectHealth] = useState(null);
  const [sales, setSales] = useState(null);
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/overview`),
      axios.get(`${API}/project-health`),
      axios.get(`${API}/sales-funnel`),
      axios.get(`${API}/payment-status`)
    ])
      .then(([o, p, s, pay]) => {
        setOverview(o.data.data);
        setProjectHealth(p.data.data);
        setSales(s.data.data);
        setPayments(pay.data.data);
      })
      .catch(console.error);
  }, []);

  if (!overview) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-center mb-6">
  <h1 className="text-2xl font-bold">
    Project Management Dashboard
  </h1>
</div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Projects"
          value={overview.projects.total}
          icon={FolderKanban}
        />
        <KpiCard
          title="Total Revenue"
          value={`₹${overview.financial.total_revenue.toLocaleString()}`}
          icon={IndianRupee}
        />
        <KpiCard
          title="Active Deals"
          value={overview.sales.active_pipeline}
          icon={Handshake}
        />
        <KpiCard
          title="Active Sales Reps"
          value={overview.team.active_sales_reps}
          icon={Users}
        />
      </div>

      {/* ================= PROJECT HEALTH ================= */}
      <div className="bg-white rounded shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Project Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="On Time" value={projectHealth.timeline_status.on_time} />
          <Stat label="Delayed" value={projectHealth.timeline_status.delayed} />
          <Stat label="Near Completion" value={projectHealth.progress_metrics.near_completion} />
          <Stat label="Needs Attention" value={projectHealth.progress_metrics.needs_attention} />
        </div>
      </div>

      {/* ================= SALES OVERVIEW ================= */}
      <div className="bg-white rounded shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Sales Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Deal Value" value={`₹${sales.metrics.total_deals_value.toLocaleString()}`} />
          <Stat label="Win Rate" value={`${sales.metrics.win_rate}%`} />
          <Stat label="Avg Deal Size" value={`₹${sales.metrics.average_deal_size}`} />
          <Stat label="Expected Revenue" value={`₹${sales.metrics.expected_revenue.toLocaleString()}`} />
        </div>
      </div>

      {/* ================= PAYMENTS ================= */}
      <div className="bg-white rounded shadow p-5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={18} /> Payment Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat
            label="Pending Invoices"
            value={`₹${payments.pending_invoices.amount.toLocaleString()}`}
          />
          <Stat
            label="Overdue Invoices"
            value={`₹${payments.overdue_invoices.amount.toLocaleString()}`}
            danger
          />
          <Stat
            label="Payment Success Rate"
            value={`${payments.payment_metrics.payment_success_rate}%`}
          />
        </div>
      </div>

      {/* ================= ALERTS ================= */}
      {projectHealth.at_risk_projects.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} /> At-Risk Projects
          </h2>
          <ul className="mt-3 list-disc list-inside text-sm text-red-600">
            {projectHealth.at_risk_projects.slice(0, 5).map(p => (
              <li key={p.project_id}>
                {p.project_name} — {p.progress_percentage}% complete
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function KpiCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <Icon size={32} className="text-blue-500 opacity-60" />
    </div>
  );
}

function Stat({ label, value, danger }) {
  return (
    <div className={`p-4 rounded ${danger ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
      <p className="text-sm">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
