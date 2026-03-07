import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  LogOut,
  MapPin,
  Calendar,
  Shield,
  Home
} from "lucide-react";
import API from "../../api";

export function ClientDashboard() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"jobs" | "post" | "profile">("jobs");
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
    fetchProfile();
  }, []);


  const fetchJobs = async () => {

    try {

      const res = await fetch(`${API}/gigs/client`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate("/client");
        return;
      }

      const data = await res.json();

      setJobs(Array.isArray(data) ? data : data.gigs || []);

    } catch (error) {

      console.error("Jobs fetch error:", error);
      setJobs([]);

    }

  };


  const fetchProfile = async () => {

    try {

      const res = await fetch(`${API}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate("/client");
        return;
      }

      const data = await res.json();

      setProfile(data);

    } catch (error) {

      console.error("Profile fetch error:", error);
      setProfile(null);

    }

  };


  const handleMarkCompleted = async (jobId: string) => {

    await fetch(`${API}/gigs/complete/${jobId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    fetchJobs();

  };


  const handlePostJob = async (e: React.FormEvent) => {

    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = {
  title: form.title.value,
  description: form.description.value,
  location: form.location.value,
  budget: form.pay.value,
  duration: form.duration.value,
  job_date: form.date.value
};
    await fetch(`${API}/gigs`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify(formData)
});
    form.reset();

    setActiveTab("jobs");

    fetchJobs();

  };


  const handleProfileUpdate = async (e: React.FormEvent) => {

    e.preventDefault();

    await fetch(`${API}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(profile)
    });

    fetchProfile();

  };


  return (

    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">


          {/* LEFT */}

          <div className="flex items-center gap-3">

            <h1 className="text-2xl font-semibold text-gray-800">
              LocalGig
            </h1>

            {Number(profile?.verified) === 1 && (
              <span className="flex items-center gap-1 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" />
                Verified Client
              </span>
            )}

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-5">

            {profile && (
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  {profile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {profile.email}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-gray-600 hover:text-green-600"
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>

          </div>

        </div>

      </header>



      <div className="max-w-7xl mx-auto px-6 py-8">


        {/* TABS */}

        <div className="flex gap-4 mb-8">

          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === "jobs"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            My Jobs
          </button>

          <button
            onClick={() => setActiveTab("post")}
            className="text-gray-600 hover:text-green-600 font-medium"
          >
            + Post New Job
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className="text-gray-600 hover:text-green-600 font-medium"
          >
            My Profile
          </button>

        </div>


        {/* JOB LIST */}

        {activeTab === "jobs" && (

          <div className="space-y-8">

            <h2 className="text-2xl font-semibold">
              My Posted Jobs
            </h2>

            {jobs.map((job) => (

              <div key={job.id} className="bg-white rounded-xl shadow-sm border p-6">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h3 className="text-xl font-semibold">
                      {job.title}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {job.description}
                    </p>

                  </div>

                  <div className="text-right">

                    <div className="text-xl font-bold text-green-600">
                      ${job.budget}/hour
                    </div>

                    <div className="text-sm text-gray-500">
                      {job.duration}
                    </div>

                  </div>

                </div>


                <div className="flex gap-6 text-sm text-gray-600 mb-4">

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {job.job_date}
                  </div>

                </div>


                {job.status === "in-progress" && (
                  <button
                    onClick={() => handleMarkCompleted(job.id)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Mark Completed
                  </button>
                )}

              </div>

            ))}

          </div>

        )}


        {/* POST JOB */}

        {activeTab === "post" && (

          <form onSubmit={handlePostJob} className="bg-white p-6 rounded-xl shadow space-y-4 max-w-2xl">

            <h2 className="text-xl font-semibold">
              Post New Job
            </h2>

            <input name="title" placeholder="Job Title" className="w-full border p-3 rounded-lg" required />
            <textarea name="description" placeholder="Description" className="w-full border p-3 rounded-lg" required />
            <input name="location" placeholder="Location" className="w-full border p-3 rounded-lg" required />
            <input name="pay" placeholder="Pay per hour" className="w-full border p-3 rounded-lg" required />
            <input name="duration" placeholder="Duration" className="w-full border p-3 rounded-lg" required />
            <input name="date" type="date" className="w-full border p-3 rounded-lg" required />

            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
              Post Job
            </button>

          </form>

        )}


        {/* PROFILE */}

        {activeTab === "profile" && profile && (

          <div className="bg-white p-6 rounded-xl shadow max-w-2xl">

            <h2 className="text-xl font-semibold mb-4">
              My Profile
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-4">

              <input
                className="w-full border p-3 rounded-lg"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />

              <input
                className="w-full border p-3 rounded-lg bg-gray-100"
                value={profile.email}
                disabled
              />

              <textarea
                className="w-full border p-3 rounded-lg"
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />

              <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
                Update Profile
              </button>

            </form>

          </div>

        )}

      </div>

    </div>

  );

}