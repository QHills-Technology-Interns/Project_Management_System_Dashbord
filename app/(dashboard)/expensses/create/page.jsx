"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS = ["Pending", "Paid", "Cancelled", "Rejected"];

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
          <div>
            <label className={label}>Payment Status</label>

            <div className="flex gap-3 mt-3 flex-wrap">
              {STATUS.map((s) => {
                const isActive = form.payment_status === s;

                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() =>
                      setForm((p) => ({ ...p, payment_status: s }))
                    }
                    className={`inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold border transition
                      ${
                        isActive
                          ? s === "Paid"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : s === "Rejected"
                            ? "bg-red-100 text-red-600 border-red-300"
                            : s === "Cancelled"
                            ? "bg-gray-100 text-gray-700 border-gray-300"
                            : "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
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
