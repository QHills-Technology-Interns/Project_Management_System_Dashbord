"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Calendar, Users, DollarSign, Clock,
  Plus, X, Pencil, Trash2,
  AlertCircle, CheckCircle, AlertTriangle,
  ChevronLeft, ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────
   CONFIG
───────────────────────────────────────── */
const API_BASE       = "https://ceo-dashboard-8052.onrender.com/api";
const TEAM_PAGE_SIZE = 5;


/* ================= PAYMENT STATUS MAP ================= */
const PAYMENT_STATUS_MAP = {
  Pending: 0,
  Paid: 1,
  Overdue: 2,
  Cancelled: 3,
  Partial: 4,
};


/* ─────────────────────────────────────────
   HTTP HELPER — uses native fetch so we
   avoid any axios CORS quirks.
   Always sends Authorization + JSON headers.
───────────────────────────────────────── */

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

async function http(method, path, body) {
  const url = `${API_BASE}${path}`;
  const opts = {
    method,
    headers: baseHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  console.log(`[HTTP] ${method} ${url}`, body || "");

  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkErr) {
    // fetch itself threw — CORS block, server down, no internet
    console.error(`[HTTP] Network-level error for ${method} ${url}:`, networkErr.message);
    throw Object.assign(new Error(`Network error: ${networkErr.message}`), {
      isNetworkError: true,
      originalError: networkErr,
    });
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  console.log(`[HTTP] ${method} ${url} → ${res.status}`, data);

  if (!res.ok) {
    throw Object.assign(
      new Error(data?.message || data?.error || `HTTP ${res.status}`),
      { isNetworkError: false, status: res.status, data }
    );
  }

  return data;
}

const httpGet    = (path)         => http("GET",    path);
const httpPost   = (path, body)   => http("POST",   path, body);
const httpPut    = (path, body)   => http("PUT",    path, body);
const httpDelete = (path)         => http("DELETE", path);

/* ─────────────────────────────────────────
   RESPONSE EXTRACTOR
   Handles: [...], {data:[...]}, {data:{data:[...]}}
───────────────────────────────────────── */
const extractList = (d) => {
  if (!d) return [];
  if (Array.isArray(d))              return d;
  if (Array.isArray(d.data))         return d.data;
  if (Array.isArray(d.data?.data))   return d.data.data;
  return [];
};

const extractObject = (d) => {
  if (!d) return {};
  if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) return d.data;
  if (typeof d === "object" && !Array.isArray(d)) return d;
  return {};
};

/* ─────────────────────────────────────────
   MILESTONE NORMALISER
   Handles both DB column names + API aliases
───────────────────────────────────────── */
const normM = (m) => ({
  _id:       m.milestone_id || m.id   || null,
  name:      m.milestone_name || m.name || "",
  amount:    Number(m.total_amount  || m.amount  || 0),
  due_date:  m.payment_due_date    || m.due_date  || null,
  status:    m.payment_status      || m.status    || "Pending",
  paid_date: m.payment_received_date || m.paid_date || null,
  _raw: m,
});

const today = () => new Date().toISOString().split("T")[0];

/* ═══════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════ */
export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();

  /* ── state ── */
  const [project,        setProject]        = useState(null);
  const [team,           setTeam]           = useState([]);
  const [users,          setUsers]          = useState([]);
  const [phases,         setPhases]         = useState([]);
  const [milestones,     setMilestones]     = useState([]);
  const [milestoneStats, setMilestoneStats] = useState({});
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState(null);
  const [teamPage,       setTeamPage]       = useState(1);

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone,   setEditingMilestone]   = useState(null);
  const [showPhaseModal,     setShowPhaseModal]     = useState(false);
  const [editingPhase,       setEditingPhase]       = useState(null);
  const [newTaskText,        setNewTaskText]         = useState({});

  const emptyMS = { name: "", amount: "", due_date: "", status: "Pending" };
  const emptyPH = { phaseName: "", startDate: "", endDate: "", status: "Not Started", budgetAllocated: "", tasks: [] };

  const [milestoneForm, setMilestoneForm] = useState(emptyMS);
  const [phaseForm,     setPhaseForm]     = useState(emptyPH);

  /* ── pagination ── */
  const totalTeamPages = Math.max(Math.ceil(team.length / TEAM_PAGE_SIZE), 1);
  const pagedTeam      = team.slice((teamPage - 1) * TEAM_PAGE_SIZE, teamPage * TEAM_PAGE_SIZE);

  /* ── monthly cost ── */
  const monthlyTeamCost = useMemo(() =>
    team.reduce((sum, m) => {
      const a = Number(m.allocation_percentage) || 0;
      if (m.rate_per_hour) return sum + Number(m.rate_per_hour) * 160 * (a / 100);
      if (m.rate)          return sum + (Number(m.rate) * a) / 100;
      return sum;
    }, 0),
  [team]);

  /* ─────────────────────────────────────
     FETCH ALL DATA
     Uses Promise.allSettled so one failing
     endpoint never blocks the others.
  ───────────────────────────────────── */
  const fetchAllProjectData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    const [projR, teamR, usersR, phasesR, msR, statsR] = await Promise.allSettled([
      httpGet(`/projects/${projectId}`),
      httpGet(`/projects/team-members/${projectId}`),
      httpGet(`/users`),
      httpGet(`/phases/project/${projectId}`),          // GET /phases/project/:projectId
      httpGet(`/milestones/project/${projectId}`),      // GET /milestones/project/:projectId
      httpGet(`/milestones/stats`),                     // GET /milestones/stats
    ]);

    /* project */
    if (projR.status === "fulfilled") {
      const raw = projR.value;
      const pd  = raw?.data ?? raw;
      setProject(Array.isArray(pd) ? pd[0] : pd);
    } else {
      console.error("Project fetch failed:", projR.reason?.message);
      setError("Failed to load project.");
    }

    /* team */
    if (teamR.status === "fulfilled") {
      const t = extractList(teamR.value);
      console.log("[DEBUG] team[0]:", t[0]);
      setTeam(t);
    } else {
      console.error("Team failed:", teamR.reason?.message);
      setTeam([]);
    }

    /* users */
    usersR.status === "fulfilled"
      ? setUsers(extractList(usersR.value))
      : setUsers([]);

    /* phases */
    if (phasesR.status === "fulfilled") {
      const ph = extractList(phasesR.value);
      console.log("[DEBUG] phases count:", ph.length, "| phase[0]:", ph[0]);
      setPhases(ph);
    } else {
      console.error("Phases failed:", phasesR.reason?.message, phasesR.reason?.status, phasesR.reason?.data);
      setPhases([]);
    }

    /* milestones */
    if (msR.status === "fulfilled") {
      const raw = extractList(msR.value);
      console.log("[DEBUG] milestones count:", raw.length, "| ms[0]:", raw[0]);
      setMilestones(raw.map(normM));
    } else {
      console.error("Milestones failed:", msR.reason?.message, msR.reason?.status, msR.reason?.data);
      setMilestones([]);
    }

    /* stats */
    if (statsR.status === "fulfilled") {
      const s = extractObject(statsR.value);
      console.log("[DEBUG] milestoneStats:", s);
      setMilestoneStats(s);
    } else {
      console.error("Stats failed:", statsR.reason?.message);
      setMilestoneStats({});
    }

    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchAllProjectData(); }, [fetchAllProjectData]);

  /* ─────────────────────────────────────
     SAVE MILESTONE
  ───────────────────────────────────── */
  const saveMilestone = async () => {
    if (!milestoneForm.name || !milestoneForm.amount || !milestoneForm.due_date) {
      alert("Please fill in all required fields");
      return;
    }

    // Send every possible field name so the controller accepts it
const payload = {
  project_id: projectId,
  milestone_name: milestoneForm.name,
  total_amount: Number(milestoneForm.amount),
  payment_due_date: milestoneForm.due_date,
  payment_status: milestoneForm.status,   // STRING ENUM
  payment_received_date:
    milestoneForm.status === "Paid" ? today() : null,
};



    console.log("[saveMilestone] payload →", payload);

    try {
      setSaving(true);
      let result;

      if (editingMilestone) {
        const id = editingMilestone._id;
        console.log("[saveMilestone] PUT /milestones/" + id);
        result = await httpPut(`/milestones/${id}`, payload);
      } else {
        console.log("[saveMilestone] POST /milestones");
        result = await httpPost("/milestones", payload);
      }

      console.log("[saveMilestone] ✅ success:", result);
      await fetchAllProjectData();
      setShowMilestoneModal(false);
      setEditingMilestone(null);
      setMilestoneForm(emptyMS);
    } catch (err) {
      console.error("[saveMilestone] ❌ failed:", err);
      if (err.isNetworkError) {
        alert(
          "❌ Network Error — request was blocked.\n\n" +
          "You MUST add CORS to your Express server:\n\n" +
          "  const cors = require('cors');\n" +
          "  app.use(cors({ origin: '*' }));\n" +
          "  app.use(express.json());\n\n" +
          "Add these lines BEFORE your routes in app.js / server.js\n\n" +
          `Raw error: ${err.message}`
        );
      } else {
        alert(`Server error (HTTP ${err.status}): ${err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────────────────────────────
     DELETE MILESTONE
  ───────────────────────────────────── */
  const deleteMilestone = async (id) => {
    if (!confirm("Delete this milestone?")) return;
    try {
      setSaving(true);
      await httpDelete(`/milestones/${id}`);
      await fetchAllProjectData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally { setSaving(false); }
  };

  /* ─────────────────────────────────────
     SAVE PHASE
  ───────────────────────────────────── */
  const savePhase = async () => {
    if (!phaseForm.phaseName || !phaseForm.startDate || !phaseForm.endDate) {
      alert("Phase name, start date, and end date are required");
      return;
    }
    if (!project?.project_id) { alert("Project ID not found"); return; }

    const payload = {
      projectId:       project.project_id,
      phaseName:       phaseForm.phaseName,
      startDate:       phaseForm.startDate,
      endDate:         phaseForm.endDate,
      status:          phaseForm.status,
      budgetAllocated: Number(phaseForm.budgetAllocated || 0),
      tasks:           phaseForm.tasks || [],
    };

    console.log("[savePhase] payload →", payload);

    try {
      setSaving(true);
      let result;

      if (editingPhase) {
        const id = editingPhase.id;
        console.log("[savePhase] PUT /phases/" + id);
        result = await httpPut(`/phases/${id}`, payload);
      } else {
        console.log("[savePhase] POST /phases");
        result = await httpPost("/phases", payload);
      }

      console.log("[savePhase] ✅ success:", result);
      await fetchAllProjectData();
      setShowPhaseModal(false);
      setEditingPhase(null);
      setPhaseForm(emptyPH);
    } catch (err) {
      console.error("[savePhase] ❌ failed:", err);
      if (err.isNetworkError) {
        alert(
          "❌ Network Error — request was blocked.\n\n" +
          "Fix your Express server (app.js / server.js):\n\n" +
          "  const cors = require('cors');\n" +
          "  app.use(cors({ origin: '*' }));\n" +
          "  app.use(express.json());\n\n" +
          "These must come BEFORE your routes.\n\n" +
          `Raw error: ${err.message}`
        );
      } else {
        alert(`Server error (HTTP ${err.status}): ${err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────────────────────────────
     DELETE PHASE
  ───────────────────────────────────── */
  const deletePhase = async (id) => {
    if (!confirm("Delete this phase?")) return;
    try {
      setSaving(true);
      await httpDelete(`/phases/${id}`);
      await fetchAllProjectData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally { setSaving(false); }
  };

  /* ─────────────────────────────────────
     TASK HELPERS
  ───────────────────────────────────── */
  const phasePayload = (phase, tasks) => ({
    projectId:       project?.project_id,
    phaseName:       phase.phaseName,
    startDate:       phase.startDate,
    endDate:         phase.endDate,
    status:          phase.status,
    budgetAllocated: Number(phase.budgetAllocated ?? 0),
    tasks,
  });

  const addTaskToPhase = async (phaseId) => {
    const name = newTaskText[phaseId]?.trim();
    if (!name) return;
    try {
      setSaving(true);
      const phase = phases.find((p) => p.id === phaseId);
      if (!phase) return;
      const tasks = [...(phase.tasks || []),
        { id: `t-${Date.now()}`, name, completed: false }];
      await httpPut(`/phases/${phaseId}`, phasePayload(phase, tasks));
      await fetchAllProjectData();
      setNewTaskText((p) => ({ ...p, [phaseId]: "" }));
    } catch (err) { alert("Add task failed: " + err.message); }
    finally { setSaving(false); }
  };

  const toggleTask = async (phaseId, idx) => {
    try {
      setSaving(true);
      const phase = phases.find((p) => p.id === phaseId);
      if (!phase) return;
      const tasks = (phase.tasks || []).map((t, i) =>
        i === idx ? { ...t, completed: !t.completed } : t);
      await httpPut(`/phases/${phaseId}`, phasePayload(phase, tasks));
      await fetchAllProjectData();
    } catch (err) { alert("Toggle task failed: " + err.message); }
    finally { setSaving(false); }
  };

  const deleteTask = async (phaseId, idx) => {
    try {
      setSaving(true);
      const phase = phases.find((p) => p.id === phaseId);
      if (!phase) return;
      const tasks = (phase.tasks || []).filter((_, i) => i !== idx);
      await httpPut(`/phases/${phaseId}`, phasePayload(phase, tasks));
      await fetchAllProjectData();
    } catch (err) { alert("Delete task failed: " + err.message); }
    finally { setSaving(false); }
  };

  /* ─────────────────────────────────────
     MODAL HELPERS
  ───────────────────────────────────── */
  const openAddMS   = () => { setEditingMilestone(null); setMilestoneForm(emptyMS); setShowMilestoneModal(true); };
  const openEditMS  = (m) => {
    setEditingMilestone(m);
    setMilestoneForm({ name: m.name, amount: String(m.amount), due_date: m.due_date?.slice(0, 10) || "", status: m.status });
    setShowMilestoneModal(true);
  };
  const closeMS = () => { setShowMilestoneModal(false); setEditingMilestone(null); };

  const openAddPH  = () => { setEditingPhase(null); setPhaseForm(emptyPH); setShowPhaseModal(true); };
  const openEditPH = (p) => {
    setEditingPhase(p);
    setPhaseForm({
      phaseName:       p.phaseName || "",
      startDate:       p.startDate?.slice(0, 10) || "",
      endDate:         p.endDate?.slice(0, 10)   || "",
      status:          p.status || "Not Started",
      budgetAllocated: String(p.budgetAllocated ?? ""),
      tasks:           p.tasks || [],
    });
    setShowPhaseModal(true);
  };
  const closePH = () => { setShowPhaseModal(false); setEditingPhase(null); };

  /* ─────────────────────────────────────
     LOADING / ERROR
  ───────────────────────────────────── */
  if (loading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button onClick={fetchAllProjectData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Try Again</button>
        </div>
      </div>
    );
  }
  if (!project) return null;

/* ─────────────────────────────────────
   CALCULATIONS (Derived from milestones)
──────────────────────────────────── */
const totalBudget = Number(project.total_budget) || 0;

// ✅ calculate from milestones list
const received = milestones
  .filter(m => m.status === "Paid")
  .reduce((sum, m) => sum + Number(m.amount || 0), 0);

const pending = milestones
  .filter(m => m.status === "Pending")
  .reduce((sum, m) => sum + Number(m.amount || 0), 0);

const spent = received;
const remaining = totalBudget - spent;

/* ───── Timeline calculations ───── */
const pStart = new Date(project.start_date_planned);
const pEnd   = new Date(project.end_date_planned);

const totalDays = Math.max((pEnd - pStart) / 86400000, 1);
const elapsed   = Math.max((Date.now() - pStart) / 86400000, 1);

const timelinePct = Math.min((elapsed / totalDays) * 100, 100);
const budgetPct   = totalBudget ? (spent / totalBudget) * 100 : 0;

const budgetVariance =
  timelinePct > 0 ? Math.round(budgetPct - timelinePct) : 0;

/* ───── Health indicator ───── */
let hStatus = "on_track",
    hTitle  = "Project is on track",
    hMsg    = "Spending is aligned with timeline",
    hBg     = "bg-green-50 border-green-200",
    hTx     = "text-green-700",
    HIcon   = CheckCircle,
    hIBg    = "bg-green-600";

if (budgetVariance > 10) {
  hStatus = "at_risk";
  hTitle  = "Project at risk";
  hMsg    = `Spending is ${budgetVariance}% ahead of timeline`;
  hBg     = "bg-yellow-50 border-yellow-200";
  hTx     = "text-yellow-700";
  HIcon   = AlertTriangle;
  hIBg    = "bg-yellow-500";
}

if (budgetVariance > 25) {
  hStatus = "off_track";
  hTitle  = "Project off track";
  hMsg    = `Overspending by ${budgetVariance}% vs timeline`;
  hBg     = "bg-red-50 border-red-200";
  hTx     = "text-red-700";
  HIcon   = AlertCircle;
  hIBg    = "bg-red-600";
}


  /* ═══════════════════════════════════
     RENDER
  ═══════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100 px-10 py-8 space-y-10 relative ">

      {/* saving toast */}
      {saving && (
        <div className="fixed top-4 right-4 z-50 bg-white border shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" /> Saving…
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{project.project_name}</h1>
          <p className="text-gray-500 mt-1">{project.client_name} • {project.category}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            hStatus === "on_track" ? "bg-green-100 text-green-700" :
            hStatus === "at_risk"  ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
          }`}>
            {hStatus === "on_track" ? "On Track" : hStatus === "at_risk" ? "At Risk" : "Off Track"}
          </span>
        </div>
      </div>

      {/* OVERVIEW */}
      <Card title="Project Overview" icon={Calendar}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <OStat label="Total Budget" value={`$${totalBudget.toLocaleString()}`} />
          <OStat label="Start Date"   value={fmt(project.start_date_planned)} />
          <OStat label="End Date"     value={fmt(project.end_date_planned)} />
          <OStat label="Team Size"    value={`${team.length} members`} />
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-gray-900">{project.description || "—"}</p>
        </div>
        <div className={`mt-6 flex items-start gap-3 border rounded-lg p-4 ${hBg}`}>
          <div className={`h-6 w-6 flex items-center justify-center rounded-full text-white flex-shrink-0 ${hIBg}`}>
            <HIcon size={14} />
          </div>
          <div>
            <p className={`font-medium ${hTx}`}>{hTitle}</p>
            <p className={`text-sm ${hTx}`}>{hMsg}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <MCard label="Budget Used" value={`${budgetPct.toFixed(0)}%`}
            sub={`$${spent.toLocaleString()} of $${totalBudget.toLocaleString()}`} pct={budgetPct} />
          <MCard label="Timeline" value={`${timelinePct.toFixed(0)}%`}
            sub={`${Math.max(Math.round(totalDays - elapsed), 0)} days remaining`} pct={timelinePct} />
          <MStat label="Daily Burn" value={`$${Math.round(spent / elapsed).toLocaleString()}`} sub="per day" />
          <MStat label="Projected Overspend"
            value={budgetVariance > 0 ? `$${Math.round(totalBudget * budgetVariance / 100).toLocaleString()}` : "None"}
            sub={budgetVariance > 0 ? "at current burn rate" : "within budget"}
            green={budgetVariance <= 0} red={budgetVariance > 0} />
        </div>
        <div className="mt-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
            budgetVariance <= 0 ? "bg-green-100 text-green-700" :
            budgetVariance <= 10 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
          }`}>
            Cost Variance: {budgetVariance > 0 ? "+" : ""}{budgetVariance}%
          </span>
        </div>
      </Card>

      {/* TEAM */}
      <Card title="Team & Resources" icon={Users}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Rate</th>
                <th className="px-6 py-4 text-left">Allocation</th>
                <th className="px-6 py-4 text-right">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {team.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">No team members</td></tr>
              ) : pagedTeam.map((m, idx) => {
                const user  = users.find((u) => u.id === m.user_id);
                const alloc = Number(m.allocation_percentage) || 0;
                const cost  = m.rate_per_hour
                  ? Math.round(Number(m.rate_per_hour) * 160 * (alloc / 100))
                  : m.rate ? Math.round((Number(m.rate) * alloc) / 100) : 0;
                const key = m.id || m.member_id || `${m.user_id}-${(teamPage-1)*TEAM_PAGE_SIZE+idx}`;
                return (
                  <tr key={key} className="border-t hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 font-medium">{user ? `${user.firstName} ${user.lastName}` : "—"}</td>
                    <td className="px-6 py-4">{m.member_role}</td>
                    <td className="px-6 py-4 text-green-600 font-medium"> ${m.rate_per_hour}/hr</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 h-2 bg-gray-200 rounded">
                          <div className="h-2 bg-indigo-500 rounded" style={{ width: `${alloc}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{alloc}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold"> ${cost.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {team.length > TEAM_PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4 px-2">
            <p className="text-sm text-gray-500">
              {(teamPage-1)*TEAM_PAGE_SIZE+1}–{Math.min(teamPage*TEAM_PAGE_SIZE, team.length)} of {team.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setTeamPage(p => Math.max(p-1,1))} disabled={teamPage===1}
                className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              {Array.from({length: totalTeamPages}, (_,i)=>i+1).map(pg => (
                <button key={pg} onClick={() => setTeamPage(pg)}
                  className={`w-8 h-8 rounded text-sm font-medium border ${
                    pg===teamPage ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 hover:bg-gray-100 text-gray-600"
                  }`}>{pg}</button>
              ))}
              <button onClick={() => setTeamPage(p => Math.min(p+1,totalTeamPages))} disabled={teamPage===totalTeamPages}
                className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 bg-indigo-50 rounded-lg px-6 py-4 flex justify-between items-center">
          <span className="font-medium text-indigo-700">Total Monthly Team Cost</span>
          <span className="text-xl font-semibold text-indigo-700"> ${Math.round(monthlyTeamCost).toLocaleString()}</span>
        </div>
      </Card>

      {/* PHASES */}
<Card title="Project Planning & Timeline" icon={Clock}>
  <div className="flex justify-end mb-4">
    <button
      onClick={openAddPH}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center shadow-lg hover:scale-105 transition"
    >
      <Plus size={16} /> Add Phase
    </button>
  </div>

  {phases.length === 0 ? (
    <div className="text-center py-8 text-gray-500">
      No phases yet. Click "Add Phase" to start.
    </div>
  ) : (
    <div className="space-y-4">
      {phases.map((p) => {
        // ✅ REAL-TIME SPENT LOGIC
        const phaseSpent =
          p.status === "Completed"
            ? Number(p.budgetAllocated || 0)
            : 0;

        return (
          <div
            key={p.id}
            className="border rounded-xl p-5 bg-white hover:shadow-sm transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center border text-xs ${
                      p.status === "Completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : p.status === "In Progress"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-gray-300 text-gray-300"
                    }`}
                  >
                    {p.status === "Completed" && "✓"}
                    {p.status === "In Progress" && "◉"}
                  </span>
                  <h4 className="font-semibold text-gray-900">
                    {p.phaseName}
                  </h4>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {fmt(p.startDate)} – {fmt(p.endDate)}
                </p>

                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Allocated:</span>{" "}
                  ${Number(p.budgetAllocated || 0).toLocaleString()}
                  &nbsp;&nbsp;
                  <span className="font-medium">Spent:</span>{" "}
                  ${phaseSpent.toLocaleString()}
                </p>

                {/* TASKS */}
                <div className="mt-4 space-y-2">
                  {(p.tasks || []).length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No tasks added
                    </p>
                  ) : (
                    (p.tasks || []).map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <input
                          type="checkbox"
                          checked={t.completed || false}
                          readOnly
                        />
                        <span
                          className={
                            t.completed
                              ? "line-through text-gray-400"
                              : ""
                          }
                        >
                          {t.name}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <StatusBadge status={p.status} />
                <button
                  onClick={() => openEditPH(p)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => deletePhase(p.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</Card>

      {/* FINANCIAL */}
      <Card title="Financial Tracking" icon={DollarSign}>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Stat label="Total Budget" value={`$${totalBudget.toLocaleString()}`}/>
          <Stat label="Spent"        value={`$${spent.toLocaleString()}`}/>
          <Stat label="Remaining"    value={`$${remaining.toLocaleString()}`}/>
          <Stat label="Pending"      value={`$${pending.toLocaleString()}`} yellow/>
        </div>
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">Payment Milestones</h3>
          <button onClick={openAddMS} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center shadow-lg hover:scale-105 transition">
            <Plus size={16}/> Add Milestone
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Milestone</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Due</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Paid Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {milestones.length===0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">No milestones yet</td></tr>
              ) : milestones.map((m,i)=>(
                <tr key={m._id||`ms-${i}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{m.name}</td>
                  <td className="px-4 py-3 font-medium">${m.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{fmt(m.due_date)}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status}/></td>
                  <td className="px-4 py-3">{m.paid_date ? fmt(m.paid_date) : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={()=>openEditMS(m)} className="text-gray-500 hover:text-blue-600"><Pencil size={16}/></button>
                      <button onClick={()=>deleteMilestone(m._id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MILESTONE MODAL */}
      {showMilestoneModal && (
        <Modal onClose={closeMS}>
          <h3 className="text-lg font-semibold mb-4">{editingMilestone?"Edit Milestone":"Add Milestone"}</h3>
          <label className="text-sm text-gray-600">Milestone Name *</label>
          <FInput placeholder="e.g. Initial Deposit" value={milestoneForm.name}
            onChange={e=>setMilestoneForm({...milestoneForm,name:e.target.value})}/>
          <label className="text-sm text-gray-600">Amount ($) *</label>
          <FInput type="number" placeholder="5000" value={milestoneForm.amount}
            onChange={e=>setMilestoneForm({...milestoneForm,amount:e.target.value})}/>
          <label className="text-sm text-gray-600">Due Date *</label>
          <FInput type="date" value={milestoneForm.due_date}
            onChange={e=>setMilestoneForm({...milestoneForm,due_date:e.target.value})}/>
          <label className="text-sm text-gray-600">Status</label>
          <select className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={milestoneForm.status} onChange={e=>setMilestoneForm({...milestoneForm,status:e.target.value})}>
            <option>Pending</option><option>Paid</option><option>Overdue</option>
            <option>Cancelled</option><option>Partial</option>
          </select>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={closeMS} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
            <button onClick={saveMilestone} disabled={saving}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
              {saving?"Saving…":editingMilestone?"Update":"Add"}
            </button>
          </div>
        </Modal>
      )}

      {/* PHASE MODAL */}
{showPhaseModal && (
  <Modal onClose={closePH}>
    <h3 className="text-lg font-semibold mb-4">
      {editingPhase ? "Edit Phase" : "Add Phase"}
    </h3>

    <label className="text-sm text-gray-600">Phase Name *</label>
    <FInput
      value={phaseForm.phaseName}
      onChange={(e) =>
        setPhaseForm({ ...phaseForm, phaseName: e.target.value })
      }
    />

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-gray-600">Start Date *</label>
        <FInput
          type="date"
          value={phaseForm.startDate}
          onChange={(e) =>
            setPhaseForm({ ...phaseForm, startDate: e.target.value })
          }
        />
      </div>
      <div>
        <label className="text-sm text-gray-600">End Date *</label>
        <FInput
          type="date"
          value={phaseForm.endDate}
          onChange={(e) =>
            setPhaseForm({ ...phaseForm, endDate: e.target.value })
          }
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mt-3">
      <div>
        <label className="text-sm text-gray-600">Status</label>
        <select
          className="w-full border p-2 rounded"
          value={phaseForm.status}
          onChange={(e) =>
            setPhaseForm({ ...phaseForm, status: e.target.value })
          }
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-600">Budget ($)</label>
        <FInput
          type="number"
          value={phaseForm.budgetAllocated}
          onChange={(e) =>
            setPhaseForm({
              ...phaseForm,
              budgetAllocated: e.target.value,
            })
          }
        />
      </div>
    </div>

    {/* TASKS IN PHASE FORM */}
    <label className="text-sm text-gray-600 mt-4 block">Tasks</label>

    <div className="space-y-2 mb-4">
      {(phaseForm.tasks || []).map((t, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border px-2 py-1 rounded text-sm"
            placeholder="Task name"
            value={t.name}
            onChange={(e) => {
              const updated = [...phaseForm.tasks];
              updated[i].name = e.target.value;
              setPhaseForm({ ...phaseForm, tasks: updated });
            }}
          />
          <button
            onClick={() => {
              const updated = phaseForm.tasks.filter(
                (_, idx) => idx !== i
              );
              setPhaseForm({ ...phaseForm, tasks: updated });
            }}
            className="text-red-500"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          setPhaseForm({
            ...phaseForm,
            tasks: [...(phaseForm.tasks || []), { name: "", completed: false }],
          })
        }
        className="text-sm text-indigo-600 hover:underline"
      >
        + Add Task
      </button>
    </div>

    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={closePH}
        className="px-5 py-2 rounded-lg border border-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={savePhase}
        className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
      >
        {editingPhase ? "Update" : "Add"}
      </button>
    </div>
  </Modal>
)}
    </div>
  );
}

/* ═══════════════════════════════════════
   UI COMPONENTS
═══════════════════════════════════════ */
const OStat = ({label,value}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);
const MCard = ({label,value,sub,pct}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm text-gray-500">{label}</p>
      <span className="text-sm font-semibold">{value}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded">
      <div className="h-2 bg-blue-600 rounded" style={{width:`${Math.min(pct,100)}%`}}/>
    </div>
    <p className="text-xs text-gray-500 mt-2">{sub}</p>
  </div>
);
const MStat = ({label,value,sub,green,red}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-lg font-semibold mt-1 ${green?"text-green-600":red?"text-red-600":"text-gray-900"}`}>{value}</p>
    <p className="text-xs text-gray-500">{sub}</p>
  </div>
);
const Card = ({title,icon:Icon,children}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center"><Icon size={18}/>{title}</h2>
    {children}
  </div>
);
const Stat = ({label,value,green,yellow}) => (
  <div className={`p-4 rounded ${green?"bg-green-50":yellow?"bg-yellow-50":"bg-gray-100"}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
const StatusBadge = ({status}) => {
  const map = {
    Paid:"bg-green-100 text-green-700", Completed:"bg-green-100 text-green-700",
    "In Progress":"bg-blue-100 text-blue-700", Pending:"bg-yellow-100 text-yellow-700",
    Overdue:"bg-red-100 text-red-700", Cancelled:"bg-gray-100 text-gray-700",
    Partial:"bg-purple-100 text-purple-700", "Not Started":"bg-gray-100 text-gray-700",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]||"bg-gray-100 text-gray-700"}`}>{status}</span>;
};
const FInput = (props) => (
  <input {...props} className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
);
const Modal = ({children,onClose}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 w-[420px] rounded-xl relative max-h-[90vh] overflow-y-auto">
      <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700" onClick={onClose}><X size={20}/></button>
      {children}
    </div>
  </div>
);
const fmt = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});
};
