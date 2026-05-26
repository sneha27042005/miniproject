import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
Shield,
LogOut,
UserCheck,
UserX,
X
} from "lucide-react";

export function AdminDashboard() {

const navigate = useNavigate();
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

const API = "http://localhost:5000/api/admin";

const [activeTab,setActiveTab] = useState<
"overview"|"verification"|"users"|"reports"|"jobs"
>("overview");

const [overview,setOverview] = useState<any>(null);
const [verificationRequests,setVerificationRequests] = useState<any[]>([]);
const [users,setUsers] = useState<any[]>([]);
const [reports,setReports] = useState<any[]>([]);
const [jobs,setJobs] = useState<any[]>([]);
const [searchTerm,setSearchTerm] = useState("");

/* PROTECT ROUTE */

useEffect(()=>{

if(!token || user.role !== "admin"){
navigate("/admin/login");
}

},[]);


/* LOAD DATA */

useEffect(()=>{

fetchOverview();
fetchVerification();
fetchUsers();
fetchReports();
fetchJobs();

},[]);


/* FETCH FUNCTIONS */

const fetchOverview = async()=>{

const res = await fetch(`${API}/overview`,{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();

setOverview(data);

};


const fetchVerification = async()=>{

const res = await fetch(`${API}/verification`,{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();

setVerificationRequests(data);

};


const fetchUsers = async()=>{

const res = await fetch(`${API}/users`,{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();

setUsers(data);

};


const fetchReports = async()=>{

const res = await fetch(`${API}/reports`,{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();

setReports(data);

};


const fetchJobs = async()=>{

const res = await fetch(`${API}/jobs`,{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();

setJobs(data);

};


/* ACTIONS */

const approveVerification = async(id:number)=>{

await fetch(`${API}/verification/${id}`,{
method:"PUT",
headers:{ Authorization:`Bearer ${token}` }
});

fetchVerification();

};


const resolveReport = async(id:number)=>{

await fetch(`${API}/reports/${id}/resolve`,{
method:"PUT",
headers:{ Authorization:`Bearer ${token}` }
});

fetchReports();

};


const deleteJob = async(id:number)=>{

if(!window.confirm("Delete this job?")) return;

await fetch(`${API}/jobs/${id}`,{
method:"DELETE",
headers:{ Authorization:`Bearer ${token}` }
});

fetchJobs();

};


const handleLogout = ()=>{

localStorage.clear();
navigate("/");

};


/* SEARCH FILTER */

const filteredUsers = users.filter(u =>
u.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredJobs = jobs.filter(j =>
j.title.toLowerCase().includes(searchTerm.toLowerCase())
);


/* UI */

return(

<div className="min-h-screen bg-gray-100">

{/* HEADER */}

<header className="bg-white border-b px-6 py-4 flex justify-between items-center">

<div className="flex items-center gap-2">
<Shield className="text-purple-600"/>
<h1 className="text-xl font-semibold">Admin Panel</h1>
</div>

<button onClick={handleLogout}>
<LogOut className="text-gray-600"/>
</button>

</header>


<div className="max-w-7xl mx-auto p-6">

{/* TABS */}

<div className="grid grid-cols-5 gap-2 bg-white p-2 rounded-xl shadow mb-6">

{["overview","verification","users","reports","jobs"].map(tab=>(
<button
key={tab}
onClick={()=>setActiveTab(tab as any)}
className={`py-3 rounded-lg ${
activeTab===tab
?"bg-purple-600 text-white"
:"text-gray-600 hover:bg-gray-100"
}`}
>
{tab.toUpperCase()}
</button>
))}

</div>


{/* SEARCH */}

{activeTab!=="overview" &&(

<input
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
placeholder="Search..."
className="border p-3 rounded w-full mb-6"
/>

)}


{/* OVERVIEW */}

{activeTab==="overview" && overview &&(

<div className="grid grid-cols-3 gap-6">

<div className="bg-white p-6 rounded-xl shadow">
<p className="text-sm text-gray-500">Total Users</p>
<p className="text-2xl font-bold">{overview.totalUsers}</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<p className="text-sm text-gray-500">Active Jobs</p>
<p className="text-2xl font-bold text-purple-600">
{overview.activeJobs}
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<p className="text-sm text-gray-500">Reports</p>
<p className="text-2xl font-bold text-red-600">
{reports.length}
</p>
</div>

</div>

)}


{/* VERIFICATION */}

{activeTab==="verification" &&(

<div className="space-y-4">

{verificationRequests.map(v=>(

<div key={v.id} className="bg-white p-5 rounded-xl shadow flex justify-between">

<div>
<p className="font-semibold">{v.name}</p>
<p className="text-sm text-gray-500">{v.email}</p>
</div>

<button
onClick={()=>approveVerification(v.id)}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Approve
</button>

</div>

))}

</div>

)}


{/* USERS */}

{activeTab==="users" &&(

<div className="space-y-4">

{filteredUsers.map(u=>(

<div key={u.id} className="bg-white p-5 rounded-xl shadow flex justify-between">

<div>
<p className="font-semibold">{u.name}</p>
<p className="text-sm text-gray-500">{u.email}</p>
<p className="text-xs text-gray-400">Role: {u.role}</p>
</div>

<div className="flex gap-3">

<UserCheck className="text-green-600"/>
<UserX className="text-red-600"/>

</div>

</div>

))}

</div>

)}


{/* REPORTS */}

{activeTab==="reports" &&(

<div className="space-y-4">

{reports.map(r=>(

<div key={r.id} className="bg-white p-5 rounded-xl shadow flex justify-between">

<div>
<p className="font-semibold">{r.reason}</p>
<p className="text-sm text-gray-500">
Reported by {r.reporter_name}
</p>
</div>

<button
onClick={()=>resolveReport(r.id)}
className="bg-purple-600 text-white px-4 py-2 rounded"
>
Resolve
</button>

</div>

))}

</div>

)}


{/* JOBS */}

{activeTab==="jobs" &&(

<div className="space-y-4">

{filteredJobs.map(job=>(

<div key={job.id} className="bg-white p-5 rounded-xl shadow flex justify-between">

<div>
<p className="font-semibold">{job.title}</p>
<p className="text-sm text-gray-500">
Client: {job.client_name}
</p>
<p className="text-xs text-gray-400">
Status: {job.status}
</p>
</div>

<button
onClick={()=>deleteJob(job.id)}
className="text-red-600"
>
<X/>
</button>

</div>

))}

</div>

)}

</div>

</div>

);

}