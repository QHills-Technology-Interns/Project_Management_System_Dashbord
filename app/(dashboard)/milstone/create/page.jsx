"use client";

import { useState } from "react";
import axios from "axios";
import { Inter } from "next/font/google";

/* ---------------- FONT CONFIG ---------------- */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CreateMilestonePage() {
  const [open, setOpen] = useState("basic");

  const [form, setForm] = useState({
    project_id: "",
    milestone_name: "",
    milestone_order: "",
    milestone_description: "",

    planned_date: "",
    actual_date: "",
    date_variance_days: "",

    base_amount: "",
    tax_percentage: "",
    tax_amount: "",
    total_amount: "",
    percentage_of_budget: "",

    payment_status: "Pending",
    payment_due_date: "",
    payment_received_date: "",
    days_overdue: "",

    payment_method: "",
    bank_name: "",
    account_last_4: "",
    transaction_id: "",
    processing_fee: "",

    invoice_number: "",
    invoice_date: "",
    invoice_due_date: "",
    payment_terms: ""
  });

  /* ---------- HANDLERS ---------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      project_id: form.project_id || null,
      milestone_name: form.milestone_name || null,
      milestone_order: form.milestone_order ? Number(form.milestone_order) : null,
      milestone_description: form.milestone_description || null,

      planned_date: form.planned_date || null,
      actual_date: form.actual_date || null,
      date_variance_days: form.date_variance_days ? Number(form.date_variance_days) : null,

      base_amount: form.base_amount ? Number(form.base_amount) : null,
      tax_percentage: form.tax_percentage ? Number(form.tax_percentage) : null,
      tax_amount: form.tax_amount ? Number(form.tax_amount) : null,
      total_amount: form.total_amount ? Number(form.total_amount) : null,
      percentage_of_budget: form.percentage_of_budget ? Number(form.percentage_of_budget) : null,

      payment_status: form.payment_status || "Pending",
      payment_due_date: form.payment_due_date || null,
      payment_received_date: form.payment_received_date || null,
      days_overdue: form.days_overdue ? Number(form.days_overdue) : null,

      payment_method: form.payment_method || null,
      bank_name: form.bank_name || null,
      account_last_4: form.account_last_4 || null,
      transaction_id: form.transaction_id || null,
      processing_fee: form.processing_fee ? Number(form.processing_fee) : null,

      invoice_number: form.invoice_number || null,
      invoice_date: form.invoice_date || null,
      invoice_due_date: form.invoice_due_date || null,
      payment_terms: form.payment_terms || null,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authorization token found. Please login again.");
        return;
      }

      await axios.post(
        "https://ceo-dashboard-8052.onrender.com/api/milestones",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Milestone created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create milestone");
    }
  };

  /* ---------- SECTION ---------- */

  const Section = ({ id, title, children }) => (
    <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition">
      <button
        type="button"
        onClick={() => setOpen(open === id ? "" : id)}
        className={`w-full flex justify-between items-center px-6 py-4 transition
          ${open === id ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"}`}
      >
        <h2 className="font-semibold text-lg">{title}</h2>
        <span
          className={`text-xl transition-transform duration-200 ${
            open === id ? "rotate-180" : ""
          }`}
        >
          {open === id ? "−" : "+"}
        </span>
      </button>

      {open === id && (
        <div className="p-6 bg-white animate-fadeIn">{children}</div>
      )}
    </div>
  );

  return (
    <div className={`${inter.className} min-h-screen bg-gray-100 py-10 px-4 flex justify-center`}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-10 space-y-10"
      >
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Milestone</h1>
          <p className="text-gray-500 text-sm">
            Define milestone scope, schedule and payment details
          </p>
        </div>

        {/* BASIC */}
        <Section id="basic" title="Basic Information">
          <Grid>
            <Input label="Project ID" name="project_id" value={form.project_id} onChange={handleChange} required />
            <Input label="Milestone Name" name="milestone_name" value={form.milestone_name} onChange={handleChange} required />
            <Input label="Milestone Order" name="milestone_order" type="number" value={form.milestone_order} onChange={handleChange} />
            <Textarea label="Description" name="milestone_description" value={form.milestone_description} onChange={handleChange} />
          </Grid>
        </Section>

        {/* DATES */}
        <Section id="dates" title="Schedule Dates">
          <Grid>
            <Input label="Planned Date" name="planned_date" type="date" value={form.planned_date} onChange={handleChange} />
            <Input label="Actual Date" name="actual_date" type="date" value={form.actual_date} onChange={handleChange} />
            <Input label="Date Variance (days)" name="date_variance_days" type="number" value={form.date_variance_days} onChange={handleChange} />
          </Grid>
        </Section>

        {/* FINANCIAL */}
        <Section id="financial" title="Financial Details">
          <div className="bg-green-50 p-4 rounded-xl">
            <Grid>
              <Input label="Base Amount" name="base_amount" value={form.base_amount} onChange={handleChange} />
              <Input label="Tax %" name="tax_percentage" value={form.tax_percentage} onChange={handleChange} />
              <Input label="Tax Amount" name="tax_amount" value={form.tax_amount} onChange={handleChange} />
              <Input label="Total Amount" name="total_amount" value={form.total_amount} onChange={handleChange} />
              <Input label="% of Budget" name="percentage_of_budget" value={form.percentage_of_budget} onChange={handleChange} />
            </Grid>
          </div>
        </Section>

        {/* PAYMENT */}
        <Section id="payment" title="Payment Status">
          <Grid>
            <Select
              label="Payment Status"
              name="payment_status"
              options={["Pending", "Paid", "Overdue", "Cancelled", "Partial"]}
              value={form.payment_status}
              onChange={handleChange}
            />
            <Input label="Due Date" name="payment_due_date" type="date" value={form.payment_due_date} onChange={handleChange} />
            <Input label="Received Date" name="payment_received_date" type="date" value={form.payment_received_date} onChange={handleChange} />
            <Input label="Days Overdue" name="days_overdue" type="number" value={form.days_overdue} onChange={handleChange} />
          </Grid>
        </Section>

        {/* METHOD */}
        <Section id="method" title="Payment Method">
          <Grid>
            <Input label="Payment Method" name="payment_method" value={form.payment_method} onChange={handleChange} />
            <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
            <Input label="Account Last 4" name="account_last_4" value={form.account_last_4} onChange={handleChange} />
            <Input label="Transaction ID" name="transaction_id" value={form.transaction_id} onChange={handleChange} />
            <Input label="Processing Fee" name="processing_fee" value={form.processing_fee} onChange={handleChange} />
          </Grid>
        </Section>

        {/* INVOICE */}
        <Section id="invoice" title="Invoice Information">
          <Grid>
            <Input label="Invoice Number" name="invoice_number" value={form.invoice_number} onChange={handleChange} />
            <Input label="Invoice Date" name="invoice_date" type="date" value={form.invoice_date} onChange={handleChange} />
            <Input label="Invoice Due Date" name="invoice_due_date" type="date" value={form.invoice_due_date} onChange={handleChange} />
            <Input label="Payment Terms" name="payment_terms" value={form.payment_terms} onChange={handleChange} />
          </Grid>
        </Section>

        {/* CTA */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:-translate-y-0.5 transition text-white px-20 py-3 rounded-2xl font-semibold"
          >
            Save Milestone
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

function Input({ label, name, type = "text", required, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-xl px-4 py-3 text-sm
        focus:ring-2 focus:ring-green-500 focus:outline-none transition"
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col md:col-span-2 lg:col-span-3">
      <label className="text-sm font-medium mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="border border-gray-300 rounded-xl px-4 py-3 text-sm bg-gray-50
        focus:ring-2 focus:ring-green-500 focus:outline-none transition resize-none"
      />
    </div>
  );
}

function Select({ label, name, options, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-xl px-4 py-3 text-sm
        focus:ring-2 focus:ring-green-500 focus:outline-none transition"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
