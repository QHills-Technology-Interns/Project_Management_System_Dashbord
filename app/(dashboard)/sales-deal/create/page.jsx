"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const token = localStorage.getItem("token"); // ✅ FIX: token defined

    if (!token) {
      alert("Login required");
      return;
    }

    // ✅ CLEAN + SAFE PAYLOAD
    const payload = {
      deal_name: form.deal_name,
      client_name: form.client_name,
      client_contact_person: form.client_contact_person || null,
      client_email: form.client_email || null,
      client_phone: form.client_phone || null,

      deal_value: Number(form.deal_value),
      currency: form.currency, // REQUIRED

      category: form.category || null,
      sub_category: form.sub_category || null,

      sales_rep_id: form.sales_rep_id || null, // backend field

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

    const res = await fetch("https://ceo-dashboard-z65r.onrender.com/api/sales-deal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // ✅ FIX access-token missing
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
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

  const Input = ({ label, name, type = "text", required }) => (
    <div>
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500"
      />
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 flex flex-col"
      >
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Sales Deal
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
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
              className={`px-5 py-2 rounded-full font-semibold transition
                ${
                  tab === key
                    ? "bg-green-600 text-white"
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
              <Input label="Deal Name" name="deal_name" required />
              <Input label="Deal Value" name="deal_value" type="number" required />
              <Input label="Currency" name="currency" />
              <Input label="Category" name="category" />
              <Input label="Sub Category" name="sub_category" />
            </>
          )}

          {/* CLIENT INFO */}
          {tab === "client" && (
            <>
              <Input label="Client Name" name="client_name" required />
              <Input label="Contact Person" name="client_contact_person" />
              <Input label="Client Email" name="client_email" type="email" />
              <Input label="Client Phone" name="client_phone" />
            </>
          )}

          {/* PIPELINE */}
          {tab === "pipeline" && (
            <>
              <div>
                <label className="text-sm font-medium">Pipeline Stage</label>
                <select
                  name="pipeline_stage"
                  value={form.pipeline_stage}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1"
                >
                  {["Lead","Qualified","Proposal","Negotiation","Closed Won","Closed Lost"]
                    .map(stage => <option key={stage}>{stage}</option>)}
                </select>
              </div>

              <Input label="Probability %" name="probability_percentage" type="number" />
              <Input label="Lead Source" name="lead_source" />
              <Input label="First Contact Date" name="first_contact_date" type="date" />
              <Input label="Expected Close Date" name="expected_close_date" type="date" />
              <Input label="Actual Close Date" name="actual_close_date" type="date" />
              <Input label="Proposal Amount" name="proposal_amount" type="number" />
            </>
          )}

          {/* STRATEGY */}
          {tab === "strategy" && (
            <>
              <div className="col-span-2">
                <label className="text-sm font-medium">Competitors</label>
                <textarea
                  name="competitors"
                  value={form.competitors}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1 h-20"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Our USP</label>
                <textarea
                  name="our_usp"
                  value={form.our_usp}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1 h-20"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Next Action</label>
                <textarea
                  name="next_action"
                  value={form.next_action}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1 h-20"
                />
              </div>

              <Input label="Next Action Date" name="next_action_date" type="date" />
            </>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-xl font-bold shadow-md transition"
          >
            Save Deal
          </button>
        </div>
      </form>
    </div>
  );
}
