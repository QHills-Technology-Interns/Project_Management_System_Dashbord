"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = "https://ceo-dashboard-8052.onrender.com/api";

export default function CreateProject() {
  const router = useRouter();

  /* ---------------- PROJECT ---------------- */
  const [project, setProject] = useState({
    project_name: "",
    client_name: "",
    category: "",
    project_owner: "",
    total_budget: "",
    start_date_planned: "",   // ✅ FIXED
    end_date_planned: "",     // ✅ FIXED
    description: "",
  });

  /* ---------------- USERS ---------------- */
  const [users, setUsers] = useState([]);

  /* ---------------- TEAM ---------------- */
  const [teamMembers, setTeamMembers] = useState([]);

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUsers(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleProjectChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const addMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        user_id: "",
        role: "Developer",
        rate: 0,
        rate_type: "Hourly",
        allocation: 100,
      },
    ]);
  };

  const updateMember = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const removeMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleUserSelect = (index, userId) => {
    const updated = [...teamMembers];
    updated[index].user_id = userId;
    setTeamMembers(updated);
  };

  const selectedUserIds = teamMembers
    .map((m) => m.user_id)
    .filter(Boolean);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // ✅ PROJECT CREATE WITH CORRECT DATE FIELDS
      const projectRes = await axios.post(
        `${API_BASE}/projects`,
        {
          ...project,
          total_budget: Number(project.total_budget),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdProjectId =
        projectRes.data.data.project_id || projectRes.data.data.id;

      console.log("CREATED PROJECT ID:", createdProjectId);

      // ✅ Insert Team Members
      for (const member of teamMembers) {
        await axios.post(
          `${API_BASE}/projects/team-members`,
          {
            project_id: createdProjectId,
            user_id: member.user_id,
            member_role: member.role,
            allocation_percentage: Number(member.allocation),
            rate_per_hour: Number(member.rate || 0),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("Project & Members created successfully ✅");

      router.push(`/project/${createdProjectId}`);

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed");
    }
  };

  /* ---------------- STYLES ---------------- */

  const input =
    "w-full h-11 rounded-md border border-gray-300 bg-white px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  const label =
    "text-sm font-medium text-gray-700 mb-2 block";

  const card =
    "bg-white border border-gray-200 rounded-xl p-8 shadow-sm";

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-semibold text-gray-900">
          Create New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ================= BASIC INFO ================= */}
          <div className={card}>
            <h2 className="text-xl font-semibold mb-1">
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-6 mt-6">

              <div>
                <label className={label}>Project Name *</label>
                <input
                  className={input}
                  name="project_name"
                  required
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Client Name *</label>
                <input
                  className={input}
                  name="client_name"
                  required
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Project Owner *</label>
                <input
                  className={input}
                  name="project_owner"
                  required
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Category *</label>
                <select
                  name="category"
                  required
                  onChange={handleProjectChange}
                  className={input}
                >
                  <option value="">Select category</option>
                  <option value="Digital Transformation">
                    Digital Transformation
                  </option>
                  <option value="AI & ML">
                    AI & ML
                  </option>
                </select>
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

              {/* ✅ FIXED DATE FIELDS */}
              <div>
                <label className={label}>Start Date *</label>
                <input
                  type="date"
                  className={input}
                  name="start_date_planned"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>End Date *</label>
                <input
                  type="date"
                  className={input}
                  name="end_date_planned"
                  onChange={handleProjectChange}
                />
              </div>

              <div className="col-span-2">
                <label className={label}>Description</label>
                <textarea
                  rows={4}
                  className={`${input} h-28 resize-none`}
                  name="description"
                  onChange={handleProjectChange}
                />
              </div>

            </div>
          </div>

          {/* ================= TEAM MEMBERS ================= */}
          <div className={card}>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Team Members
              </h2>

              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 border border-gray-300 px-4 h-10 rounded-md bg-gray-50 hover:bg-gray-100"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>

            {teamMembers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No team members added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 items-end bg-gray-50 p-6 rounded-lg"
                  >

                    <div> <label className={label}>Name</label> <select className={input} value={member.user_id || ""} onChange={(e) => handleUserSelect(index, e.target.value) } > <option value="">Name</option> {users .filter( (user) => !selectedUserIds.includes(user.id) || user.id === member.user_id ) .map((user) => ( <option key={user.id} value={user.id}> {user.firstName} {user.lastName} </option> ))} </select> </div> <div> <label className={label}>Role</label> <input className={input} value={member.role} onChange={(e) => updateMember(index, "role", e.target.value) } /> </div> <div> <label className={label}>Rate ($)</label> <input type="number" className={input} value={member.rate} onChange={(e) => updateMember(index, "rate", e.target.value) } /> </div> <div> <label className={label}>Rate Type</label> <select className={input} value={member.rate_type} onChange={(e) => updateMember(index, "rate_type", e.target.value) } > <option>Hourly</option> <option>Monthly</option> </select> </div> <div> <label className={label}>Allocation %</label> <input type="number" className={input} value={member.allocation} onChange={(e) => updateMember(index, "allocation", e.target.value) } /> </div>

                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/project")}
              className="px-6 h-11 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 h-11 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
