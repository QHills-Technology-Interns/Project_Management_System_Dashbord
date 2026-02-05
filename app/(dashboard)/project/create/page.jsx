"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const { project_id } = useParams();

  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ---------------- FETCH PROJECT ---------------- */
  const fetchProject = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${project_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProject(res.data.data);
  };

  /* ---------------- FETCH TEAM MEMBERS ---------------- */
  const fetchTeamMembers = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/team-members/${project_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTeamMembers(res.data.data || []);
  };

  useEffect(() => {
    if (project_id) {
      Promise.all([fetchProject(), fetchTeamMembers()])
        .finally(() => setLoading(false));
    }
  }, [project_id]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      {/* ---------------- PROJECT INFO ---------------- */}
      <div>
        <h1 className="text-2xl font-bold">{project?.project_name}</h1>
        <p className="text-gray-600">
          Client: {project?.client_name}
        </p>
      </div>

      {/* ---------------- TEAM MEMBERS SECTION ---------------- */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Team Members</h2>
            <p className="text-sm text-gray-500">
              Add team members and their allocation
            </p>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            + Add Member
          </button>
        </div>

        {/* ---------------- EMPTY STATE ---------------- */}
        {teamMembers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-2">
              No team members added yet.
            </p>
            <button className="text-blue-600 text-sm hover:underline">
              Add your first team member
            </button>
          </div>
        ) : (
          /* ---------------- TEAM LIST ---------------- */
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Role</th>
                <th className="py-2">Allocation %</th>
                <th className="py-2">Rate / Hr</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b last:border-none"
                >
                  <td className="py-3">
                    {member.user.firstName} {member.user.lastName}
                  </td>
                  <td className="py-3">
                    {member.member_role}
                  </td>
                  <td className="py-3">
                    {member.allocation_percentage}%
                  </td>
                  <td className="py-3">
                    ₹{member.rate_per_hour}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
