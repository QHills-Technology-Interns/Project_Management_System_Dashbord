"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useProject } from "../../../../context/ProjectContext";


export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const { setProjectId } = useProject(); // ✅ IMPORTANT
 
  useEffect(() => {
    fetchProjects();
  }, []);

const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    const res = await axios.get(
      "https://ceo-dashboard-8052.onrender.com/api/projects",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProjects(res.data.data);
  } catch (err) {
    if (err.response?.status === 401) {
      setError("Unauthorized. Please login again.");
      localStorage.clear();
    } else {
      setError("Failed to fetch projects");
    }
  } finally {
    setLoading(false);
  }
};

  /* 🔥 PROJECT SELECT HANDLER */
  const selectProject = (project) => {
    setProjectId(id);            // ✅ STORE PROJECT ID
    router.push("/expensses/create");    // ✅ GO TO CREATE EXPENSE
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Projects</h1>

      {loading && <p className="text-sm text-gray-500">Loading projects...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Project</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Start</th>
                <th className="px-4 py-3 text-left">End</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => selectProject(project)} // ✅ CLICK
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium">
                      {project.project_name}
                    </td>
                    <td className="px-4 py-3">
                      {project.client_name}
                    </td>
                    <td className="px-4 py-3">
                      {project.project_owner}
                    </td>
                    <td className="px-4 py-3">
                      {project.start_date || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {project.end_date || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {project.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
