import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  LogOut
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  latitude: number;
  longitude: number;
}

interface Application {
  application_id: string;
  gig_id: string;
  title: string;
  application_status: string;
}

export function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");

  // ================= PROTECT ROUTE =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/student");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchJobs();
    fetchApplications();

    // 🔥 Auto refresh every 10 sec (Feature 6 & 9)
    const interval = setInterval(() => {
      fetchApplications();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gigs");
      const data = await res.json();

      // Feature 7: Nearby filter (within ~5km)
      const nearbyJobs = data.filter((gig: any) => {
        if (!gig.latitude || !gig.longitude) return true;

        const userLat = 10; // Replace with real GPS later
        const userLng = 76;

        const distance = getDistance(
          userLat,
          userLng,
          gig.latitude,
          gig.longitude
        );

        return distance <= 5;
      });

      setJobs(nearbyJobs);

    } catch (err) {
      console.log("Error loading jobs");
    }
  };

  // ================= FETCH APPLICATIONS =================
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/applications/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setApplications(data);

    } catch (err) {
      console.log("Error loading applications");
    }
  };

  // ================= APPLY =================
  const handleApply = async (gigId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/applications/apply/${gigId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Applied successfully!");

      // Feature 5: Auto refresh after apply
      fetchApplications();

    } catch (err) {
      alert("Error applying");
    }
  };

  // ================= DISTANCE CALC =================
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ================= CHECK IF ALREADY APPLIED =================
  const hasApplied = (gigId: string) => {
    return applications.some(app => app.gig_id === gigId);
  };

  const getStatusColor = (status: string) => {
    if (status === "applied") return "text-blue-600";
    if (status === "accepted") return "text-green-600";
    if (status === "in_progress") return "text-yellow-600";
    if (status === "completed") return "text-gray-600";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold">LocalGig</h1>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="p-6">

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("jobs")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Jobs
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Applications
          </button>
        </div>

        {/* JOBS */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.description}</p>
                <p className="text-blue-600 font-bold">₹{job.budget}</p>

                {/* Feature 4 & 8 */}
                {hasApplied(job.id) ? (
                  <span className="text-green-600 font-medium">
                    Already Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(job.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Apply
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.application_id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{app.title}</h3>
                <p className={getStatusColor(app.application_status)}>
                  {app.application_status}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}