"use client";

import { useState, useMemo } from "react";
import { Clock, CheckCircle, Ban, XCircle } from "lucide-react";
import {
  ProjectProvider,
  useProject,
} from "../../../../context/ProjectContext";
import { Inter } from "next/font/google";

/* ---------------- FONT CONFIG ---------------- */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const API_BASE = "https://ceo-dashboard-8052.onrender.com/api/expenses";

/* ---------------- STATUS CONFIG ---------------- */
const statusConfig = {
  Pending: {
    icon: <Clock size={18} />,
    percent: 30,
    color: "bg-yellow-400",
    text: "Waiting for payment",
    textColor: "text-yellow-600",
    ring: "ring-yellow-300",
  },
  Paid: {
    icon: <CheckCircle size={18} />,
    percent: 100,
    color: "bg-green-500",
    text: "Payment completed",
    textColor: "text-green-600",
    ring: "ring-green-300",
  },
  Cancelled: {
    icon: <Ban size={18} />,
    percent: 0,
    color: "bg-gray-400",
    text: "Payment cancelled",
    textColor: "text-gray-500",
    ring: "ring-gray-300",
  },
  Rejected: {
    icon: <XCircle size={18} />,
    percent: 0,
    color: "bg-red-500",
    text: "Payment rejected",
    textColor: "text-red-600",
    ring: "ring-red-300",
  },
};

/* ---------------- FORM ---------------- */
function CreateExpenseForm() {
  const { projectId } = useProject();

  const [form, setForm] = useState({
    category: "",
    date: "",
    amount: "",
    currency: "INR",
    vendor: "",
    status: "Pending",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const progress = useMemo(() => statusConfig[form.status], [form.status]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectStatus = (status) => setForm({ ...form, status });

  const handleSubmit = async () => {
    if (!projectId) {
      setError("Please select a project first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        project_id: projectId,
        expense_category: form.category,
        expense_date: form.date,
        amount: Number(form.amount),
        currency: form.currency,
        vendor_name: form.vendor,
        payment_status: form.status,
        expense_description: form.description,
        notes: form.notes,
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Expense created successfully ✅");
      setForm({
        category: "",
        date: "",
        amount: "",
        currency: "INR",
        vendor: "",
        status: "Pending",
        description: "",
        notes: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div
      className={`${inter.className} max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-10 space-y-8`}
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">New Expense</h2>
        <p className="text-sm text-gray-500 mt-1">
          Submit expense for Project ID — {projectId || "—"}
        </p>
      </div>

      {/* CATEGORY & DATE */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
          >
            <option value="">Select category</option>
            <option>Travel</option>
            <option>Office Supplies</option>
            <option>Software Licenses</option>
            <option>Hardware</option>
            <option>Contractor Fees</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* AMOUNT & CURRENCY */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Amount</label>
          <div className="flex items-center border rounded-xl px-4 focus-within:ring-2 focus-within:ring-green-500 transition">
            <span className="text-gray-500 mr-2">₹</span>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="w-full py-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
          >
            <option>INR</option>
            <option>USD</option>
          </select>
        </div>
      </div>

      {/* VENDOR */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Vendor Name</label>
        <input
          name="vendor"
          value={form.vendor}
          onChange={handleChange}
          placeholder="Vendor name"
          className="rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
        />
      </div>

      {/* STATUS */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-3">Payment Status</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([key, value]) => (
            <StatusCard
              key={key}
              label={key}
              icon={value.icon}
              ring={value.ring}
              active={form.status}
              onClick={selectStatus}
            />
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress.color} transition-all duration-500`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className={`text-xs mt-2 ${progress.textColor}`}>
          {progress.text}
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Description"
          className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* NOTES */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Notes"
          className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:transform-none"
        >
          {loading ? "Submitting..." : "Submit Expense →"}
        </button>
      </div>
    </div>
    </div>
  );
}

/* ---------------- STATUS CARD ---------------- */
function StatusCard({ label, icon, active, ring, onClick }) {
  const isActive = active === label;

  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={`rounded-full px-4 py-3 text-sm flex flex-col items-center gap-1 transition
        ${
          isActive
            ? `bg-green-50 text-green-700 ring-2 ${ring}`
            : "border border-gray-200 hover:bg-gray-50"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

/* ---------------- PAGE EXPORT ---------------- */
export default function CreateExpensePage() {
  return (
    <ProjectProvider>
      <CreateExpenseForm />
    </ProjectProvider>
  );
}
