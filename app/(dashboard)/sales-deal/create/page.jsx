"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

/* ---------------- FONT CONFIG ---------------- */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CreateSalesDeal() {
  const router = useRouter();
  const [tab, setTab] = useState("deal");

  const [form, setForm] = useState({
    deal_name: "",
    deal_value: "",
    currency: "USD",
    category: "",
    sub_category: "",
    client_name: "",
    client_contact_person: "",
    sales_rep_id: "0a130306-9ef8-4bc4-96af-2669c110dade",
    client_email: "",
    client_phone: "",
    pipeline_stage: "Lead",
    probability_percentage: "",
    lead_source: "",
    first_contact_date: "",
    expected_close_date: "",
    actual_close_date: "",
    proposal_amount: "",
    competitors: "",
    our_usp: "",
    lost_reason: "",
    next_action: "",
    next_action_date: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login required");
        return;
      }

      const payload = {
        deal_name: form.deal_name,
        client_name: form.client_name,
        client_contact_person: form.client_contact_person || null,
        client_email: form.client_email || null,
        client_phone: form.client_phone || null,

        deal_value: Number(form.deal_value),
        currency: form.currency,

        category: form.category || null,
        sub_category: form.sub_category || null,

        sales_rep_id: form.sales_rep_id || null,

        pipeline_stage: form.pipeline_stage,
        probability_percentage: Number(form.probability_percentage || 0),

        lead_source: form.lead_source || null,

        first_contact_date: form.first_contact_date || null,
        expected_close_date: form.expected_close_date || null,
        actual_close_date: form.actual_close_date || null,

        proposal_amount: Number(form.proposal_amount || 0),
        competitors: form.competitors || null,
        our_usp: form.our_usp || null,
        lost_reason: form.lost_reason || null,

        next_action: form.next_action || null,
        next_action_date: form.next_action_date || null
      };

      const res = await fetch(
        "https://ceo-dashboard-8052.onrender.com/api/sales-deal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create sales deal");
        return;
      }

      alert("Sales Deal Created Successfully 🎉");
      console.log("Success:", data);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong");
    }
  };

  const Input = ({ label, name, type = "text", required, placeholder }) => (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 text-sm
        focus:ring-2 focus:ring-green-500 focus:outline-none transition"
      />
    </div>
  );

  return (
    <div
      className={`${inter.className} min-h-screen bg-gray-100 flex items-center justify-center px-4`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-10 flex flex-col"
      >
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Sales Deal
          </h1>
          <p className="text-gray-500 text-sm">
            Capture deal details and move it through your sales pipeline
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          {[
            ["deal", "Deal Info"],
            ["client", "Client Info"],
            ["pipeline", "Pipeline"],
            ["strategy", "Strategy"]
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-2 rounded-full font-semibold transition
                ${
                  tab === key
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          {/* DEAL INFO */}
          {tab === "deal" && (
            <>
              <Input
                label="Deal Name"
                name="deal_name"
                required
                placeholder="e.g. Website Redesign – ABC Corp"
              />

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Deal Value <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    name="deal_value"
                    value={form.deal_value}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 25000"
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-sm
                    focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <Input
                label="Currency"
                name="currency"
                placeholder="USD / INR"
              />

              <Input
                label="Category"
                name="category"
                placeholder="e.g. Software / Services"
              />

              <Input
                label="Sub Category"
                name="sub_category"
                placeholder="e.g. CRM Implementation"
              />
            </>
          )}

          {/* CLIENT INFO */}
          {tab === "client" && (
            <>
              <Input
                label="Client Name"
                name="client_name"
                required
                placeholder="e.g. ABC Corporation"
              />
              <Input
                label="Contact Person"
                name="client_contact_person"
                placeholder="e.g. John Doe"
              />
              <Input
                label="Client Email"
                name="client_email"
                type="email"
                placeholder="e.g. john@abccorp.com"
              />
              <Input
                label="Client Phone"
                name="client_phone"
                placeholder="e.g. +91 9876543210"
              />
            </>
          )}

          {/* PIPELINE */}
          {tab === "pipeline" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Pipeline Stage
                </label>
                <select
                  name="pipeline_stage"
                  value={form.pipeline_stage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 text-sm
                  focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                >
                  {[
                    "Lead",
                    "Qualified",
                    "Proposal",
                    "Negotiation",
                    "Closed Won",
                    "Closed Lost"
                  ].map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Probability %"
                name="probability_percentage"
                type="number"
                placeholder="e.g. 70"
              />
              <Input
                label="Lead Source"
                name="lead_source"
                placeholder="e.g. Website / Referral"
              />
              <Input
                label="First Contact Date"
                name="first_contact_date"
                type="date"
              />
              <Input
                label="Expected Close Date"
                name="expected_close_date"
                type="date"
              />
              <Input
                label="Actual Close Date"
                name="actual_close_date"
                type="date"
              />
              <Input
                label="Proposal Amount"
                name="proposal_amount"
                type="number"
                placeholder="e.g. 23000"
              />
            </>
          )}

          {/* STRATEGY */}
          {tab === "strategy" && (
            <>
              {[
                ["Competitors", "competitors"],
                ["Our USP", "our_usp"],
                ["Next Action", "next_action"]
              ].map(([label, name]) => (
                <div key={name} className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 h-24 text-sm bg-gray-50
                    focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                  />
                </div>
              ))}

              <Input
                label="Next Action Date"
                name="next_action_date"
                type="date"
              />
            </>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:-translate-y-0.5 transition
            text-white px-16 py-3 rounded-2xl font-bold"
          >
            Save Deal
          </button>
        </div>
      </form>
    </div>
  );
}
