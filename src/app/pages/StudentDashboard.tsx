import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  LogOut,
  MapPin,
  Calendar,
  Search,
  Trash2,
  Bell,
  Briefcase,
  FileText,
  User,
  CheckCircle
} from "lucide-react";
import API from "../../api";

export function StudentDashboard() {

const navigate = useNavigate();

const [activeTab,setActiveTab] =
useState<"jobs"|"applications"|"work"|"profile">("jobs");

const [jobs,setJobs] = useState<any[]>([]);
const [filteredJobs,setFilteredJobs] = useState<any[]>([]);
const [applications,setApplications] = useState<any[]>([]);
const [profile,setProfile] = useState<any>(null);

const [search,setSearch] = useState("");

const [stats,setStats] = useState({
total:0,
accepted:0,
completed:0
});

const [earnings,setEarnings] = useState(0);
const [reviewJob,setReviewJob] = useState<any>(null)
const [reportJob,setReportJob] = useState<any>(null)

const [rating,setRating] = useState(5)
const [comment,setComment] = useState("")
const [reportReason,setReportReason] = useState("")

/* LOAD DATA */

useEffect(()=>{
fetchJobs();
fetchApplications();
fetchProfile();
},[]);

/* ================= JOBS ================= */

const fetchJobs = async()=>{

try{

const res = await fetch(`${API}/gigs`);
const data = await res.json();

const list = Array.isArray(data) ? data : [];

setJobs(list);
setFilteredJobs(list);

}catch(err){
console.log(err);
}

};

const searchJobs = ()=>{

const results = jobs.filter((job:any)=>
job.location?.toLowerCase().includes(search.toLowerCase())
);

setFilteredJobs(results);

};

const applyJob = async(id:number)=>{

try{

const res = await fetch(`${API}/applications/apply/${id}`,{
method:"POST",
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
});

const data = await res.json();

alert(data.message);

fetchApplications();

}catch(err){
console.log(err);
}

};


/* ================= APPLICATIONS ================= */

const fetchApplications = async()=>{

try{

const res = await fetch(`${API}/applications/my`,{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
});

const data = await res.json();

const apps = Array.isArray(data) ? data : [];

setApplications(apps);

/* STATS */

const total = apps.length;
const accepted = apps.filter((a:any)=>a.application_status==="accepted").length;
const completed = apps.filter((a:any)=>a.gig_status==="completed").length;

setStats({total,accepted,completed});

/* EARNINGS */

let earned = 0;

apps.forEach((a:any)=>{
if(a.check_out_time){
earned += Number(a.budget);
}
});

setEarnings(earned);

}catch(err){

console.log(err);
setApplications([]);

}

};

const cancelApplication = async(id:number)=>{

if(!window.confirm("Cancel this application?")) return;

const res = await fetch(`${API}/applications/cancel/${id}`,{
method:"PUT",
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
});

const data = await res.json();

alert(data.message);

fetchApplications();

};


/* ================= WORKFLOW ================= */

const checkIn = async(id:number)=>{

await fetch(`${API}/applications/checkin/${id}`,{
method:"PUT",
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
});

fetchApplications();

};

const checkOut = async(id:number)=>{

await fetch(`${API}/applications/checkout/${id}`,{
method:"PUT",
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
});

fetchApplications();

};


/* ================= PROFILE ================= */

const fetchProfile = async()=>{

const res = await fetch(`${API}/users/me`,{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
});

const data = await res.json();

setProfile(data);

};

const updateProfile = async(e:any)=>{

e.preventDefault();

await fetch(`${API}/users/me`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify(profile)
});

alert("Profile updated");

};


/* ================= STATUS BADGE ================= */

const badgeColor = (status:string)=>{

if(status==="accepted") return "bg-green-100 text-green-700";
if(status==="rejected") return "bg-red-100 text-red-700";
if(status==="cancelled") return "bg-gray-200 text-gray-700";

return "bg-yellow-100 text-yellow-700";

};


/* ================= DIRECTIONS ================= */

const getDirections = (location:string)=>{

navigator.geolocation.getCurrentPosition((pos)=>{

const lat = pos.coords.latitude;
const lng = pos.coords.longitude;

const url =
`https://www.google.com/maps/dir/${lat},${lng}/${encodeURIComponent(location)}`;

window.open(url,"_blank");

});


};

/* OPEN REVIEW */

const openReview = (job:any)=>{
setReviewJob(job)
}

/* SUBMIT REVIEW */

const submitReview = async()=>{

await fetch(`${API}/reviews`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
reviewee_id: reviewJob.client_id,
rating,
comment
})
})

alert("Review submitted")

setReviewJob(null)
setRating(5)
setComment("")
}

/* OPEN REPORT */

const openReport = (job:any)=>{
setReportJob(job)
}

/* SUBMIT REPORT */

const submitReport = async()=>{

await fetch(`${API}/reports`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
reported_user_id: reportJob.client_id,
reason: reportReason
})
})

alert("Report submitted")

setReportJob(null)
setReportReason("")
}



/* ================= UI ================= */

return(

<div className="min-h-screen bg-gray-100 flex">

{/* SIDEBAR */}

<div className="w-64 bg-white border-r p-6">

<h1 className="text-xl font-semibold mb-8">
LocalGig
</h1>

<div className="space-y-4">

<button
onClick={()=>setActiveTab("jobs")}
className={`flex items-center gap-2 w-full p-2 rounded ${
activeTab==="jobs" ? "bg-green-100 text-green-700":""
}`}
>
<Briefcase size={18}/>
Nearby Jobs
</button>

<button
onClick={()=>setActiveTab("applications")}
className={`flex items-center gap-2 w-full p-2 rounded ${
activeTab==="applications" ? "bg-green-100 text-green-700":""
}`}
>
<FileText size={18}/>
Applications
</button>

<button
onClick={()=>setActiveTab("work")}
className={`flex items-center gap-2 w-full p-2 rounded ${
activeTab==="work" ? "bg-green-100 text-green-700":""
}`}
>
<CheckCircle size={18}/>
My Work
</button>

<button
onClick={()=>setActiveTab("profile")}
className={`flex items-center gap-2 w-full p-2 rounded ${
activeTab==="profile" ? "bg-green-100 text-green-700":""
}`}
>
<User size={18}/>
Profile
</button>

</div>

</div>




{/* MAIN */}

<div className="flex-1 flex flex-col">

{/* NAVBAR */}

<div className="bg-white border-b px-8 py-4 flex justify-between">

<h2 className="font-semibold text-lg">
Student Dashboard
</h2>

<div className="flex items-center gap-6">

<div className="relative">
<Bell size={20}/>
<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded">
{applications.length}
</span>
</div>

{profile &&(

<div className="text-right">

<p className="font-medium">{profile.name}</p>
<p className="text-xs text-gray-500">{profile.email}</p>

</div>

)}

<button onClick={()=>navigate("/")}>
<Home/>
</button>

<button onClick={()=>{
localStorage.clear();
navigate("/");
}}>
<LogOut/>
</button>

</div>

</div>


<div className="p-8 flex-1 overflow-auto">
  {/* DASHBOARD STATS */}

<div className="grid md:grid-cols-4 gap-6 mb-8">

<div className="bg-white shadow p-6 rounded-xl">
<h3 className="text-sm text-gray-500">Total Applications</h3>
<p className="text-2xl font-bold">{stats.total}</p>
</div>

<div className="bg-white shadow p-6 rounded-xl">
<h3 className="text-sm text-gray-500">Accepted Jobs</h3>
<p className="text-2xl font-bold text-green-600">
{stats.accepted}
</p>
</div>

<div className="bg-white shadow p-6 rounded-xl">
<h3 className="text-sm text-gray-500">Completed Jobs</h3>
<p className="text-2xl font-bold text-blue-600">
{stats.completed}
</p>
</div>

<div className="bg-white shadow p-6 rounded-xl">
<h3 className="text-sm text-gray-500">Total Earnings</h3>
<p className="text-2xl font-bold text-green-700">
₹{earnings}
</p>
</div>

</div>


{/* JOBS TAB */}

{activeTab==="jobs" &&(

<div>

<div className="flex gap-3 mb-6">

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search jobs by location"
className="border p-3 rounded w-full"
/>

<button
onClick={searchJobs}
className="bg-green-600 text-white px-4 rounded flex items-center gap-1"
>
<Search size={16}/> Search
</button>

</div>

<div className="grid md:grid-cols-2 gap-6">

{filteredJobs.map(job=>(

<div key={job.id}
className="bg-white p-6 rounded-xl shadow border">

<h3 className="text-lg font-semibold mb-1">
{job.title}
</h3>

<p className="text-gray-600 mb-3">
{job.description}
</p>

<div className="flex gap-6 text-sm mb-2">

<span className="flex items-center gap-1">
<MapPin size={16}/>
{job.location}
</span>

<span className="flex items-center gap-1">
<Calendar size={16}/>
{job.job_date}
</span>

</div>

<div className="font-semibold text-green-600">
₹{job.budget}
</div>

<button
onClick={()=>applyJob(job.id)}
className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
>
Apply
</button>

</div>

))}

</div>

</div>

)}



{/* APPLICATIONS TAB */}

{activeTab==="applications" &&(

<div className="space-y-4">

{applications.map(app=>(

<div key={app.application_id}
className="bg-white p-5 rounded-xl shadow border flex justify-between items-center">

<div>

<h3 className="font-semibold">
{app.title}
</h3>

<div className="flex gap-3 mt-1">

<span className={`px-2 py-1 text-xs rounded ${badgeColor(app.application_status)}`}>
{app.application_status}
</span>

<span className="text-sm text-gray-500">
₹{app.budget}
</span>

</div>

</div>

<div className="flex gap-3">

<button
onClick={()=>getDirections(app.location)}
className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
>
Directions
</button>

<button
onClick={()=>cancelApplication(app.application_id)}
className="text-red-500"
>
<Trash2/>
</button>

</div>

</div>

))}

</div>

)}


{/* WORK TAB */}

{activeTab==="work" &&(

<div className="space-y-4">

{applications
.filter(app=>app.application_status==="accepted")
.map(app=>(

<div key={app.application_id}
className="bg-white p-5 rounded-xl shadow border flex justify-between items-center">

<div>

<h3 className="font-semibold">
{app.title}
</h3>

<p className="text-sm text-gray-500">
₹{app.budget}
</p>

</div>

<div className="flex gap-3">

{/* NOT CHECKED IN YET */}

{!app.check_in_time && (

<button
onClick={()=>checkIn(app.application_id)}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Check In
</button>

)}

{/* CHECKED IN BUT NOT CHECKED OUT */}

{app.check_in_time && !app.check_out_time && (

<button
onClick={()=>checkOut(app.application_id)}
className="bg-red-600 text-white px-4 py-2 rounded"
>
Check Out
</button>

)}

{/* JOB COMPLETED */}

{app.check_out_time && (

<div className="flex items-center gap-3">

<span className="text-green-600 font-semibold flex items-center gap-1">
<CheckCircle size={18}/> Completed
</span>

<button
onClick={()=>openReview(app)}
className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
>
Review
</button>

<button
onClick={()=>openReport(app)}
className="bg-red-600 text-white px-3 py-1 rounded text-sm"
>
Report
</button>

</div>

)}

</div>

</div>

))}

</div>

)}

</div>

</div>
{reviewJob && (

<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-96 shadow-lg">

<h3 className="text-lg font-semibold mb-4">
Leave Review
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
placeholder="Write review..."
value={comment}
onChange={(e)=>setComment(e.target.value)}
className="border p-2 w-full mb-4 rounded"
/>

<div className="flex justify-end gap-2">

<button
onClick={()=>setReviewJob(null)}
className="border px-3 py-1 rounded"
>
Cancel
</button>

<button
onClick={submitReview}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Submit
</button>

</div>

</div>

</div>

)}
{reportJob && (

<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-96 shadow-lg">

<h3 className="text-lg font-semibold mb-4">
Report User
</h3>

<textarea
placeholder="Describe the issue..."
value={reportReason}
onChange={(e)=>setReportReason(e.target.value)}
className="border p-2 w-full mb-4 rounded"
/>

<div className="flex justify-end gap-2">

<button
onClick={()=>setReportJob(null)}
className="border px-3 py-1 rounded"
>
Cancel
</button>

<button
onClick={submitReport}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Submit
</button>

</div>

</div>

</div>

)}

</div>

)
;
}