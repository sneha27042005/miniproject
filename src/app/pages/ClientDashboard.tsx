import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LogOut, MapPin, Calendar, Shield, Home, Trash2, Search } from "lucide-react";
import API from "../../api";
import ClientMap from "../components/clientMap";

export function ClientDashboard() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState<"jobs" | "post" | "profile">("jobs");

  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [latLng, setLatLng] = useState<any>(null);

  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  const [reviewStudent,setReviewStudent] = useState<any>(null)
const [reportStudent,setReportStudent] = useState<any>(null)

const [rating,setRating] = useState(5)
const [comment,setComment] = useState("")
const [reportReason,setReportReason] = useState("")

  useEffect(() => {
    fetchJobs();
    fetchProfile();
  }, []);

  /* FETCH JOBS */

  const fetchJobs = async () => {

    try {

      const res = await fetch(`${API}/gigs/client`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setJobs(data || []);

    } catch (err) {
      console.log(err);
    }

  };

  /* FETCH PROFILE */

  const fetchProfile = async () => {

    try {

      const res = await fetch(`${API}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setProfile(data);

    } catch {}

  };

  /* SEARCH LOCATION */

  const searchLocation = async () => {

    if (!address) return;

    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      const data = await res.json();

      setSuggestions(data);

    } catch (err) {

      console.log("Search error", err);

    }

  };

  /* POST JOB */

  const handlePostJob = async (e: React.FormEvent) => {

    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const body = {
      title: (form.querySelector('input[name="title"]') as HTMLInputElement).value,
      description: (form.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value,
      location: address,
      budget: (form.querySelector('input[name="pay"]') as HTMLInputElement).value,
      duration: (form.querySelector('input[name="duration"]') as HTMLInputElement).value,
      job_date: (form.querySelector('input[name="date"]') as HTMLInputElement).value,
      latitude: latLng?.lat || null,
      longitude: latLng?.lng || null
    };

    await fetch(`${API}/gigs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(body)
    });

    setAddress("");
    setLatLng(null);

    fetchJobs();
    setActiveTab("jobs");

  };
  const handleProfileUpdate = async (e: React.FormEvent) => {

  e.preventDefault();

  try {

    const res = await fetch(`${API}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(profile)
    });

    const data = await res.json();

    alert("Profile updated successfully");

    setProfile(data);

  } catch (err) {

    console.log(err);
    alert("Update failed");

  }

};

  /* DELETE JOB */

  const deleteJob = async (id: number) => {

    if (!window.confirm("Delete this job?")) return;

    await fetch(`${API}/gigs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    fetchJobs();

  };

  /* FETCH APPLICANTS */

  const fetchApplicants = async (jobId: number) => {

  try {

    const res = await fetch(`${API}/applications/gig/${jobId}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

const data = await res.json();

console.log(data);

setApplicants(data || []);

setSelectedJob(jobs.find(job => job.id === jobId));

    

  } catch (err) {
    console.log(err);
  }

};

  /* ACCEPT/REJECT APPLICANT */

  const handleApplicantAction = async (applicationId: number, action: "accept" | "reject") => {

  try {

    const res = await fetch(`${API}/applications/${applicationId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        status: action === "accept" ? "accepted" : "rejected"
      })
    });

    const data = await res.json();
    console.log(data);

    if (selectedJob) {
      fetchApplicants(selectedJob.id);
    }

  } catch (err) {
    console.log(err);
  }

};
/* OPEN REVIEW */

const openStudentReview = (student:any)=>{
setReviewStudent(student)
}

/* SUBMIT REVIEW */

const submitStudentReview = async()=>{

await fetch(`http://localhost:5000/api/reviews`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
reviewee_id: reviewStudent.student_id,
rating,
comment
})
})

alert("Review submitted")

setReviewStudent(null)
setRating(5)
setComment("")
}


/* OPEN REPORT */

const openStudentReport = (student:any)=>{
setReportStudent(student)
}

/* SUBMIT REPORT */

const submitStudentReport = async()=>{

await fetch(`http://localhost:5000/api/reports`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
reported_user_id: reportStudent.student_id,
reason: reportReason
})
})

alert("Report submitted")

setReportStudent(null)
setReportReason("")
}


  return (

    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

          <div className="flex items-center gap-3">

            <h1 className="text-2xl font-semibold">
              LocalGig
            </h1>

            {Number(profile?.verified) === 1 && (
              <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                <Shield size={16}/>
                Verified Client
              </span>
            )}

          </div>


          <div className="flex items-center gap-5">

            {profile && (
              <div className="text-right">
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            )}

            <button onClick={()=>navigate("/")} className="flex items-center gap-1">
              <Home size={16}/> Home
            </button>

            <button
              onClick={()=>{
                localStorage.clear();
                navigate("/");
              }}
            >
              <LogOut/>
            </button>

          </div>

        </div>

      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* TABS */}

        <div className="flex gap-4 mb-8">

  <button
    onClick={() => setActiveTab("jobs")}
    className="bg-green-600 text-white px-6 py-2 rounded-lg"
  >
    My Jobs
  </button>

  <button onClick={() => setActiveTab("post")}>
    + Post Job
  </button>

  <button onClick={() => setActiveTab("profile")}>
    Profile
  </button>

</div>

        {/* JOB LIST */}

        {activeTab==="jobs" && (

          <div className="space-y-6">

            {/* STATS CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-white p-4 rounded-xl border shadow-sm text-center">

                <h3 className="text-2xl font-bold text-blue-600">{jobs.length}</h3>

                <p className="text-gray-600">Total Jobs</p>

              </div>

              <div className="bg-white p-4 rounded-xl border shadow-sm text-center">

                <h3 className="text-2xl font-bold text-green-600">{jobs.filter(job => job.status !== 'completed').length}</h3>

                <p className="text-gray-600">Open Jobs</p>

              </div>

              <div className="bg-white p-4 rounded-xl border shadow-sm text-center">

                <h3 className="text-2xl font-bold text-purple-600">{jobs.filter(job => job.status === 'completed').length}</h3>

                <p className="text-gray-600">Completed Jobs</p>

              </div>

            </div>

            {jobs.map(job => (

              <div key={job.id} className="bg-white p-6 rounded-xl border shadow-sm">

                <div className="flex justify-between">

                  <div>

<div className="flex items-center gap-3">

<h3 className="text-xl font-semibold">
{job.title}
</h3>

<span
className={`px-3 py-1 rounded-full text-sm font-medium ${
job.status === "open"
? "bg-green-100 text-green-700"
: job.status === "in_progress"
? "bg-yellow-100 text-yellow-700"
: "bg-gray-200 text-gray-700"
}`}
>
{job.status}
</span>

</div>

<p className="text-gray-600">
{job.description}
</p>

</div>

                  <div className="flex gap-2">

                    <button
                      onClick={()=>fetchApplicants(job.id)}
                      className="text-blue-500"
                    >
                      View Applicants
                    </button>

                    <button
                      onClick={()=>deleteJob(job.id)}
                      className="text-red-500"
                    >
                      <Trash2/>
                    </button>

                  </div>

                </div>

                <div className="flex gap-6 mt-3 text-sm">

                  <span className="flex items-center gap-1">
                    <MapPin size={16}/> {job.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar size={16}/> {job.job_date}
                  </span>

                </div>

                <div className="mt-3 text-green-600 font-semibold">
                  ₹{job.budget}/hour
                </div>

                {job.latitude && job.longitude && (

                  <ClientMap
                    lat={Number(job.latitude)}
                    lng={Number(job.longitude)}
                  />

                )}

              </div>

            ))}

            {/* APPLICANTS VIEW */}

            {selectedJob && (

              <div className="bg-white p-6 rounded-xl border shadow-sm">

                <div className="flex justify-between items-center mb-4">

                  <h3 className="text-xl font-semibold">Applicants for: {selectedJob.title}</h3>

                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-gray-500"
                  >
                    Close
                  </button>

                </div>

                {applicants.length === 0 ? (

                  <p className="text-gray-600">No applicants yet.</p>

                ) : (

                  <div className="space-y-4">

                   {applicants.map(applicant => (

  <div key={applicant.application_id} className="border p-4 rounded-lg flex justify-between items-center">

    <div>

      <p className="font-medium">{applicant.name}</p>

      <p className="text-sm text-gray-600">{applicant.email}</p>

      <p className="text-sm">Status: {applicant.status}</p>

    </div>

    <div className="flex gap-2">

{applicant.status === "applied" && (
<>
<button
onClick={() => handleApplicantAction(applicant.application_id, "accept")}
className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
Accept
</button>

<button
onClick={() => handleApplicantAction(applicant.application_id, "reject")}
className="bg-red-600 text-white px-4 py-2 rounded-lg"
>
Reject
</button>
</>
)}
<div className="flex gap-2">

<button
onClick={()=>handleApplicantAction(applicant.application_id,"accept")}
className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
Accept
</button>

<button
onClick={()=>handleApplicantAction(applicant.application_id,"reject")}
className="bg-red-600 text-white px-4 py-2 rounded-lg"
>
Reject
</button>

<button
onClick={()=>openStudentReview(applicant)}
className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
>
Review
</button>

<button
onClick={()=>openStudentReport(applicant)}
className="bg-red-600 text-white px-3 py-1 rounded text-sm"
>
Report
</button>

</div>

{applicant.status === "accepted" && (
<span className="text-green-600 font-semibold">
Accepted
</span>
)}

{applicant.status === "rejected" && (
<span className="text-gray-500">
Rejected
</span>
)}

</div>

  </div>

))}

                    

                  </div>

                )}

              </div>

            )}

          </div>

        )}

        {/* POST JOB */}

        {activeTab==="post" && (

          <form
            onSubmit={handlePostJob}
            className="bg-white p-6 rounded-xl shadow space-y-4 max-w-2xl"
          >

            <input name="title" placeholder="Job Title" className="w-full border p-3 rounded-lg" required />

            <textarea name="description" placeholder="Description" className="w-full border p-3 rounded-lg" required />

            {/* LOCATION SEARCH */}

            <div className="flex gap-2">

              <input
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
                placeholder="Search location"
                className="w-full border p-3 rounded-lg"
              />

              <button
                type="button"
                onClick={searchLocation}
                className="bg-blue-500 text-white px-4 rounded-lg flex items-center gap-1"
              >
                <Search size={16}/> Search
              </button>

            </div>

            {suggestions.length > 0 && (

              <div className="border rounded max-h-40 overflow-auto">

                {suggestions.map((item:any)=>(
                  <div
                    key={item.place_id}
                    onClick={()=>{
                      setAddress(item.display_name);
                      setLatLng({
                        lat:parseFloat(item.lat),
                        lng:parseFloat(item.lon)
                      });
                      setSuggestions([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {item.display_name}
                  </div>
                ))}

              </div>

            )}

            <ClientMap latLng={latLng} setLatLng={setLatLng}/>

            <input name="pay" placeholder="Pay per hour" className="w-full border p-3 rounded-lg" required />
            <input name="duration" placeholder="Duration" className="w-full border p-3 rounded-lg" required />
            <input name="date" type="date" className="w-full border p-3 rounded-lg" required />

            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
              Post Job
            </button>

          </form>

        )}

      </div>
      {activeTab === "profile" && profile && (

  <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">

    <h2 className="text-xl font-semibold mb-4">
      Update Profile
    </h2>

    <form onSubmit={handleProfileUpdate} className="space-y-4">

      <input
        className="w-full border p-3 rounded-lg"
        value={profile.name || ""}
        onChange={(e) =>
          setProfile({
            ...profile,
            name: e.target.value
          })
        }
      />

      <input
        className="w-full border p-3 rounded-lg bg-gray-100"
        value={profile.email || ""}
        disabled
      />

      <textarea
        className="w-full border p-3 rounded-lg"
        placeholder="Bio"
        value={profile.bio || ""}
        onChange={(e) =>
          setProfile({
            ...profile,
            bio: e.target.value
          })
        }
      />

      <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
        Update Profile
      </button>

    </form>

  </div>

)}

{reviewStudent && (

<div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-[9999]">

<div className="bg-white p-6 rounded-xl w-96 shadow-lg">

<h3 className="text-lg font-semibold mb-4">
Review Student
</h3>

<select
value={rating}
onChange={(e)=>setRating(Number(e.target.value))}
className="border p-2 w-full mb-3"
>

<option value={5}>5 ⭐</option>
<option value={4}>4 ⭐</option>
<option value={3}>3 ⭐</option>
<option value={2}>2 ⭐</option>
<option value={1}>1 ⭐</option>

</select>

<textarea
placeholder="Write review"
value={comment}
onChange={(e)=>setComment(e.target.value)}
className="border p-2 w-full mb-4"
/>

<div className="flex justify-end gap-2">

<button
onClick={()=>setReviewStudent(null)}
className="border px-3 py-1 rounded"
>
Cancel
</button>

<button
onClick={submitStudentReview}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Submit
</button>

</div>

</div>

</div>

)}
{reportStudent && (

<div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-[9999]">

<div className="bg-white p-6 rounded-xl w-96 shadow-lg">

<h3 className="text-lg font-semibold mb-4">
Report Student
</h3>

<textarea
placeholder="Describe issue"
value={reportReason}
onChange={(e)=>setReportReason(e.target.value)}
className="border p-2 w-full mb-4"
/>

<div className="flex justify-end gap-2">

<button
onClick={()=>setReportStudent(null)}
className="border px-3 py-1 rounded"
>
Cancel
</button>

<button
onClick={submitStudentReport}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Submit
</button>

</div>

</div>

</div>

)}

    </div>

  );

}