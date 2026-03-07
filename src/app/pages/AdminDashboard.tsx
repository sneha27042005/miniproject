import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  LogOut,
  Shield,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  X,
  Eye,
  Flag,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  Search,
} from "lucide-react";

interface VerificationRequest {
  _id: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  submittedDate: string;
  businessType: string;
  idDocument: string;
  status: "pending" | "approved" | "rejected";
}

interface Report {
  _id: string;
  reportedBy: string;
  reportedUser: string;
  userType: "student" | "client";
  reason: string;
  description: string;
  date: string;
  status: "pending" | "reviewed" | "resolved";
  severity: "low" | "medium" | "high";
}

interface User {
  _id: string;
  name: string;
  type: "student" | "client";
  email: string;
  status: "active" | "suspended" | "banned";
  jobsCompleted: number;
  rating: number;
  verified?: boolean;
}

interface Job {
  _id: string;
  title: string;
  client: string;
  student?: string;
  status: "open" | "in-progress" | "completed";
  pay: string;
  date: string;
  flagged?: boolean;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activeTab, setActiveTab] = useState<
    "overview" | "verification" | "users" | "reports" | "jobs"
  >("overview");

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔐 Protect Route
  useEffect(() => {
    if (!token || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [ver, rep, usr, jb] = await Promise.all([
        fetch("http://localhost:5000/api/admin/verifications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/admin/reports", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/admin/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setVerificationRequests(await ver.json());
      setReports(await rep.json());
      setUsers(await usr.json());
      setJobs(await jb.json());
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  const handleApproveVerification = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/verify/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAllData();
  };

  const handleRejectVerification = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAllData();
  };

  const handleSuspendUser = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/suspend/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAllData();
  };

  const handleActivateUser = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/activate/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAllData();
  };

  const handleReviewReport = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/reports/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAllData();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-600" />
          <h1 className="text-xl font-semibold">Admin Panel</h1>
        </div>
        <button onClick={handleLogout}>
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="grid grid-cols-5 gap-2 bg-white p-2 rounded-xl shadow-sm mb-6">
          {["overview","verification","users","reports","jobs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 rounded-lg ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u._id} className="bg-white p-4 rounded-lg shadow flex justify-between">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <div className="flex gap-3">
                  {u.status === "active" ? (
                    <button
                      onClick={() => handleSuspendUser(u._id)}
                      className="text-yellow-600"
                    >
                      <UserX />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateUser(u._id)}
                      className="text-green-600"
                    >
                      <UserCheck />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VERIFICATION TAB */}
        {activeTab === "verification" && (
          <div className="space-y-4">
            {verificationRequests.map((v) => (
              <div key={v._id} className="bg-white p-4 rounded-lg shadow">
                <p className="font-semibold">{v.clientName}</p>
                <p className="text-sm text-gray-500">{v.email}</p>

                {v.status === "pending" && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleApproveVerification(v._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectVerification(v._id)}
                      className="border border-red-600 text-red-600 px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded-lg shadow">
                <p className="font-semibold">{r.reason}</p>
                <p className="text-sm text-gray-500">{r.description}</p>
                {r.status === "pending" && (
                  <button
                    onClick={() => handleReviewReport(r._id)}
                    className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
                  >
                    Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded-lg shadow">
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-gray-500">
                  Client: {job.client} | Status: {job.status}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}