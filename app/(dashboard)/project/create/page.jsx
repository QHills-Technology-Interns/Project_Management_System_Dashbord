"use client";

import { useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

export default function CreateProject() {
  /* ---------------- PROJECT ---------------- */
  const [project, setProject] = useState({
    project_name: "",
    client_name: "",
    category: "",
    project_owner: "",
    total_budget: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  /* ---------------- TEAM ---------------- */
  const [teamMembers, setTeamMembers] = useState([]);

  const handleProjectChange = (e) =>
    setProject({ ...project, [e.target.name]: e.target.value });

  const addMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        name: "",
        role: "Developer",
        rate: 0,
        rateType: "Hourly",
        allocation: 100,
      },
    ]);
  };

  const updateMember = (i, field, value) => {
    const updated = [...teamMembers];
    updated[i][field] = value;
    setTeamMembers(updated);
  };

  const removeMember = (i) =>
    setTeamMembers(teamMembers.filter((_, index) => index !== i));

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://ceo-dashboard-z65r.onrender.com/api/projects",
        {
          project_name: project.project_name,
          client_name: project.client_name,
          project_owner: project.project_owner || "John Doe",
          category: project.category,
          start_date: project.start_date,
          end_date: project.end_date,
          description: project.description,
          total_budget: Number(project.total_budget),
          team_members: teamMembers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Project created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create project");
    }
  };

  /* ---------------- UI STYLES ---------------- */
  const input =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 h-10";
  const label =
    "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
          <p className="text-sm text-gray-500">Projects / Create Project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ================= BASIC INFO ================= */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Project Name *</label>
                <input
                  className={input}
                  name="project_name"
                  required
                  placeholder="Website Revamp"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Project Owner *</label>
                <input
                  className={input}
                  name="project_owner"
                  required
                  placeholder="Owner name"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Client Name *</label>
                <input
                  className={input}
                  name="client_name"
                  required
                  placeholder="ABC Corporation"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Category</label>
                <input
                  className={input}
                  name="category"
                  placeholder="Development / Design"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Total Budget ($)</label>
                <input
                  type="number"
                  className={input}
                  name="total_budget"
                  placeholder="0"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Start Date</label>
                <input
                  type="date"
                  className={input}
                  name="start_date"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>End Date</label>
                <input
                  type="date"
                  className={input}
                  name="end_date"
                  onChange={handleProjectChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className={label}>Description</label>
                <textarea
                  rows={3}
                  className={input}
                  name="description"
                  placeholder="Short project overview..."
                  onChange={handleProjectChange}
                />
              </div>
            </div>
          </div>

          {/* ================= TEAM MEMBERS ================= */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Team Members</h2>
                <p className="text-sm text-gray-500">
                  Add team members and allocation
                </p>
              </div>

              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>

            {/* Members */}
           <div className="space-y-4">
  {teamMembers.map((member, index) => (
    <div
      key={index}
      className="bg-gray-50 rounded-xl px-5 py-4"
    >
      <div className="flex items-end gap-5 flex-nowrap">
        {/* Name */}
        <div className="flex flex-col w-48">
          <label className="text-xs text-gray-600 mb-1">Name</label>
          <input
            className="h-10 rounded-lg border px-3 text-sm"
            placeholder="Name"
            value={member.name}
            onChange={(e) =>
              updateMember(index, "name", e.target.value)
            }
          />
        </div>

        {/* Role */}
        <div className="flex flex-col w-40">
          <label className="text-xs text-gray-600 mb-1">Role</label>
          <select
            className="h-10 rounded-lg border px-3 text-sm"
            value={member.role}
            onChange={(e) =>
              updateMember(index, "role", e.target.value)
            }
          >
            <option>Developer</option>
            <option>Designer</option>
            <option>Manager</option>
          </select>
        </div>

        {/* Rate */}
        <div className="flex flex-col w-32">
          <label className="text-xs text-gray-600 mb-1">
            Rate ($)
          </label>
          <input
            type="number"
            className="h-10 rounded-lg border px-3 text-sm"
            placeholder="0"
            value={member.rate}
            onChange={(e) =>
              updateMember(index, "rate", e.target.value)
            }
          />
        </div>

        {/* Rate Type */}
        {/* <div className="flex flex-col w-36">
          <label className="text-xs text-gray-600 mb-1">
            Rate Type
          </label>
          <select
            className="h-10 rounded-lg border px-3 text-sm"
            value={member.rateType}
            onChange={(e) =>
              updateMember(index, "rateType", e.target.value)
            }
          >
            <option>Hourly</option>
            <option>Monthly</option>
          </select>
        </div> */}

        {/* Allocation */}
        <div className="flex flex-col w-36">
          <label className="text-xs text-gray-600 mb-1">
            Allocation %
          </label>
          <input
            type="number"
            className="h-10 rounded-lg border px-3 text-sm"
            placeholder="100"
            value={member.allocation}
            onChange={(e) =>
              updateMember(index, "allocation", e.target.value)
            }
          />
        </div>

        {/* Delete */}
        <div className="flex items-center h-10 mt-5">
          <button
            type="button"
            onClick={() => removeMember(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

          </div>

          {/* ================= ACTION ================= */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
