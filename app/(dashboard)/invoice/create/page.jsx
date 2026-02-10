"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateInvoice() {
  const router = useRouter();
  const [tab, setTab] = useState("basic");

  const [form, setForm] = useState({
    project_id: "4b8f945d-ac7c-49ee-8a80-aa563373a319",
  invoice_number: "",
  invoice_date: "",
  due_date: "",
  subtotal: 0,
  total_amount: 0,
  tax_rate: 0,        // ✅ ADD
  tax_amount: 0,  
  tax: 0,
  currency: "INR",
  invoice_status: "Draft",
  vendor_name: "",
  notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://ceo-dashboard-8052.onrender.com/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json(); // 👈 IMPORTANT

    if (data.success) {
        alert("Invoice created successfully ✅");
      // router.push("/invoices"); // redirect only on success
    } else {
      alert(data.message || data.error || "Failed to create invoice");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};
  const Input = ({ label, name, type = "text", required }) => (
    <div>
      <label className="text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-green-400"
      />
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col"
      >
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Invoice
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-8">
          {["basic", "amounts", "payment"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full font-semibold transition
                ${
                  tab === t
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-2 gap-6">

          {tab === "basic" && (
            <>
              <Input label="Invoice Number" name="invoice_number" required />
              <Input label="Project ID" name="project_id" required />
              <Input label="Invoice Date" name="invoice_date" type="date" required />
              <Input label="Due Date" name="due_date" type="date" required />
            </>
          )}

          {tab === "amounts" && (
            <>
              <Input label="Subtotal" name="subtotal" type="number" required />
              <Input label="Tax Rate (%)" name="tax_rate" type="number" />
              <Input label="Total Amount" name="total_amount" type="number" required />
            </>
          )}

          {tab === "payment" && (
            <>
              <div>
                <label className="text-sm font-semibold">Invoice Status</label>
                <select
                  name="invoice_status"
                  value={form.invoice_status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1"
                >
                  {["Draft", "Sent", "Paid", "Overdue"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <Input label="Payment Method" name="payment_method" />
              <Input label="Transaction ID" name="transaction_id" />
              <div className="col-span-2">
                <label className="text-sm font-semibold">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1 h-20"
                />
              </div>
            </>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-xl font-bold shadow-md transition"
          >
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
