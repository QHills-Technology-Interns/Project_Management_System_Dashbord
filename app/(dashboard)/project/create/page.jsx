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
      { name: "", role: "Developer", rate: 0, rateType: "Hourly", allocation: 100 },
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
    project_owner: "John Doe", // ✅ REQUIRED
    category: project.category,
    start_date: project.start_date,
    end_date: project.end_date,
    description: project.description,
    total_budget: Number(project.total_budget),
    team_members: teamMembers,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


    alert("Project created successfully");
  } catch (error) {
    console.error(error.response?.data);
    alert(error.response?.data?.message || "Failed to create project");
  }
};



  /* ---------------- STYLES ---------------- */
  const input =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none";
  const label =
    "text-xs font-semibold text-gray-500 uppercase mb-1 block";

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">New Project</h1>
          <p className="text-sm text-gray-500">
            Projects / Create Project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ================= BASIC INFO ================= */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-6">
              Basic Information
            </h2>

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
                <label className={label}>Project owner *</label>
                <input
                  className={input}
                  name="Project Owner"
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
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Team Members</h2>
                <p className="text-sm text-gray-500">
                  Add team members and allocation
                </p>
              </div>

              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>

            {/* EMPTY STATE */}
            {teamMembers.length === 0 && (
              <div className="border-2 border-dashed rounded-xl py-14 text-center">
                <p className="text-gray-500 mb-2">
                  No team members added yet
                </p>
                <button
                  type="button"
                  onClick={addMember}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Add your first team member
                </button>
              </div>
            )}

            {/* MEMBERS */}
            {teamMembers.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-4 items-center bg-gray-50 p-4 rounded-lg mb-4"
              >
                <input
                  className={input}
                  placeholder="Name"
                  value={m.name}
                  onChange={(e) =>
                    updateMember(i, "name", e.target.value)
                  }
                />

                <select
                  className={input}
                  value={m.role}
                  onChange={(e) =>
                    updateMember(i, "role", e.target.value)
                  }
                >
                  <option>Developer</option>
                  <option>Designer</option>
                  <option>Manager</option>
                </select>

                <input
                  type="number"
                  className={input}
                  placeholder="Rate"
                  value={m.rate}
                  onChange={(e) =>
                    updateMember(i, "rate", e.target.value)
                  }
                />

                <select
                  className={input}
                  value={m.rateType}
                  onChange={(e) =>
                    updateMember(i, "rateType", e.target.value)
                  }
                >
                  <option>Hourly</option>
                  <option>Monthly</option>
                </select>

                <input
                  type="number"
                  className={input}
                  placeholder="Allocation %"
                  value={m.allocation}
                  onChange={(e) =>
                    updateMember(i, "allocation", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="text-red-500 hover:text-red-700 flex justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* ================= ACTION ================= */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Create Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
