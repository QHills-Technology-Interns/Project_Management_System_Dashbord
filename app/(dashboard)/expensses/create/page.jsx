"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PAYMENT_STATUS = [
  {
    key: "Pending",
    label: "Pending",
    color: "yellow",
    desc: "Waiting for payment approval",
    progress: 30,
  },
  {
    key: "Paid",
    label: "Paid",
    color: "green",
    desc: "Payment completed successfully",
    progress: 100,
  },
  {
    key: "Cancelled",
    label: "Cancelled",
    color: "gray",
    desc: "Expense was cancelled",
    progress: 0,
  },
  {
    key: "Rejected",
    label: "Rejected",
    color: "red",
    desc: "Payment request rejected",
    progress: 0,
  },
];


export default function CreateExpense() {
  const router = useRouter();

  const [form, setForm] = useState({
    project_id: "4b8f945d-ac7c-49ee-8a80-aa563373a319",
    expense_category: "",
    expense_description: "",
    expense_date: "",
    amount: "",
    currency: "INR",
    vendor_name: "",
    payment_status: "Pending",
    notes: "",
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(
        "https://ceo-dashboard-z65r.onrender.com/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create expense");
        return;
      }

      alert("✅ Expense created successfully!");

      // ✅ RESET FORM (INCLUDING PAYMENT STATUS)
      setForm({
        project_id: form.project_id,
        expense_category: "",
        expense_description: "",
        expense_date: "",
        amount: "",
        currency: "INR",
        vendor_name: "",
        payment_status: "Pending",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  /* ================= STYLES ================= */

  const input =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white";

  const label = "block mb-1 text-sm font-semibold text-gray-700";

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow p-10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">New Expense</h1>
            <p className="text-sm text-gray-500">
              Fill in all required fields to submit
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
            Project Management System
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ROW 1 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={label}>Expense Category *</label>
              <select
                name="expense_category"
                value={form.expense_category}
                onChange={handleChange}
                className={input}
                required
              >
                <option value="">Select category</option>
                {[
                  "Software Licenses",
                  "Travel",
                  "Contractor Fees",
                  "Hardware",
                  "Office Supplies",
                  "Other",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={label}>Expense Date *</label>
              <input
                type="date"
                name="expense_date"
                value={form.expense_date}
                onChange={handleChange}
                required
                className={input}
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={label}>Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 bg-green-100 text-green-700 rounded-full px-2 py-1 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="pl-12 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className={label}>Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className={input}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* VENDOR */}
          <div>
            <label className={label}>Vendor Name</label>
            <input
              name="vendor_name"
              value={form.vendor_name}
              onChange={handleChange}
              placeholder="Enter vendor or company name"
              className={input}
            />
          </div>

          {/* PAYMENT STATUS */}
        {/* PAYMENT STATUS */}
<div>
  <label className="block mb-2 text-sm font-semibold text-gray-700">
    Payment Status
  </label>

  {/* STATUS CARDS */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {PAYMENT_STATUS.map((s) => {
      const active = form.payment_status === s.key;

      return (
        <button
          key={s.key}
          type="button"
          onClick={() =>
            setForm((p) => ({
              ...p,
              payment_status: s.key,
              notes:
                s.key === "Rejected"
                  ? "Reason for rejection..."
                  : s.key === "Cancelled"
                  ? "Cancellation reason..."
                  : p.notes,
            }))
          }
          className={`rounded-2xl border p-4 text-left transition-all duration-200
            ${
              active
                ? `border-${s.color}-400 bg-${s.color}-50 scale-[1.02]`
                : "border-gray-200 bg-white hover:bg-gray-50"
            }
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm font-bold ${
                active ? `text-${s.color}-700` : "text-gray-700"
              }`}
            >
              {s.label}
            </span>

            {active && (
              <span
                className={`text-xs px-2 py-1 rounded-full bg-${s.color}-100 text-${s.color}-700`}
              >
                Selected
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">{s.desc}</p>
        </button>
      );
    })}
  </div>

  {/* PROGRESS BAR */}
  <div className="mt-5">
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>Payment Progress</span>
      <span>
        {
          PAYMENT_STATUS.find(
            (s) => s.key === form.payment_status
          )?.progress
        }
        %
      </span>
    </div>

    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all duration-500"
        style={{
          width: `${
            PAYMENT_STATUS.find(
              (s) => s.key === form.payment_status
            )?.progress
          }%`,
        }}
      />
    </div>
  </div>

  {/* HELPER TEXT */}
  <p className="mt-2 text-xs text-gray-500 italic">
    {form.payment_status === "Pending" &&
      "💡 Expense will remain open until marked as paid"}
    {form.payment_status === "Paid" &&
      "✅ This expense will be locked for editing"}
    {form.payment_status === "Rejected" &&
      "❌ Please mention a rejection reason in notes"}
    {form.payment_status === "Cancelled" &&
      "⚠️ Cancelled expenses are excluded from reports"}
  </p>
</div>


          {/* DESCRIPTION */}
          <div>
            <label className={label}>Expense Description</label>
            <textarea
              name="expense_description"
              value={form.expense_description}
              onChange={handleChange}
              placeholder="Provide details about the expense..."
              className={`${input} h-28`}
            />
          </div>

          {/* NOTES */}
          <div>
            <label className={label}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes or comments..."
              className={`${input} h-24`}
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              type="button"
              onClick={() =>
                setForm({
                  project_id: form.project_id,
                  expense_category: "",
                  expense_description: "",
                  expense_date: "",
                  amount: "",
                  currency: "INR",
                  vendor_name: "",
                  payment_status: "Pending",
                  notes: "",
                })
              }
              className="text-sm text-gray-500 hover:underline"
            >
              Clear form
            </button>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Submit Expense →
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
