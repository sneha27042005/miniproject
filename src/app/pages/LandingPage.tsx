import { useNavigate } from "react-router";
import { MapPin, Clock, Shield, CheckCircle2, Users } from "lucide-react";
import { motion } from "motion/react";


export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">LocalGig</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/student")}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Student Login
            </button>
            <button
              onClick={() => navigate("/client")}
              className="text-gray-600 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Client Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[500px] relative">
            <div className="pt-8">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
                Connect. Work. Earn.
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                The Smart Way to Find
                <span className="text-blue-600"> Part-Time Jobs </span>
                Near Campus
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                LocalGig connects college students with local clients for flexible, location-based part-time work. 
                Safe, verified, and built for your schedule.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/student")}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Register as Student
                </button>
                <button
                  onClick={() => navigate("/client")}
                  className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Register as Client
                </button>
              </div>
            </div>

            {/* Right Side - College Student Illustration */}
            <div className="flex justify-end items-center h-full gap-8">
              {/* Student Figure */}
              <svg
                width="280"
                height="420"
                viewBox="0 0 280 420"
                className="drop-shadow-lg"
              >
                {/* Backpack */}
                <rect x="40" y="140" width="60" height="100" rx="8" fill="#dc2626" opacity="0.8" />
                <rect x="45" y="145" width="50" height="40" rx="4" fill="#b91c1c" />
                <circle cx="60" cy="160" r="5" fill="#7f1d1d" />
                <circle cx="75" cy="160" r="5" fill="#7f1d1d" />

                {/* Body - College Hoodie */}
                <ellipse cx="140" cy="200" rx="50" ry="70" fill="#2563eb" />
                {/* Hoodie Pocket */}
                <rect x="115" y="210" width="50" height="40" rx="4" fill="#1e40af" opacity="0.7" />

                {/* Head */}
                <circle cx="140" cy="100" r="40" fill="#fdbf5e" />

                {/* Hair - Modern College Boy Style */}
                <path d="M 100 70 Q 140 40 180 70" fill="#8b4513" />
                <path d="M 100 70 L 180 70 L 175 95 L 105 95 Z" fill="#8b4513" />

                {/* Face Details */}
                {/* Eyes */}
                <circle cx="120" cy="95" r="5" fill="#000" />
                <circle cx="160" cy="95" r="5" fill="#000" />
                <circle cx="122" cy="93" r="2" fill="#fff" />
                <circle cx="162" cy="93" r="2" fill="#fff" />

                {/* Nose */}
                <path d="M 140 95 L 140 110" stroke="#c9a96e" strokeWidth="1.5" />

                {/* Smile */}
                <path d="M 125 115 Q 140 125 155 115" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Neck */}
                <rect x="130" y="135" width="20" height="15" fill="#fdbf5e" />

                {/* Left Arm - with watch */}
                <rect x="80" y="170" width="40" height="25" rx="12" fill="#fdbf5e" transform="rotate(-20 100 182)" />
                {/* Watch */}
                <rect x="70" y="185" width="15" height="15" rx="2" fill="#1f2937" />

                {/* Right Arm - holding phone */}
                <path d="M 190 170 Q 215 165 230 180" stroke="#fdbf5e" strokeWidth="25" fill="none" strokeLinecap="round" />
                
                {/* Phone in Hand */}
                <rect x="210" y="140" width="50" height="90" rx="6" fill="#1e40af" stroke="#0c1e3d" strokeWidth="2" />
                {/* Phone Screen */}
                <rect x="216" y="150" width="38" height="70" rx="3" fill="#dbeafe" />
                {/* App Icon */}
                <circle cx="235" cy="165" r="6" fill="#10b981" />
                <text x="235" y="167" fontSize="8" fontWeight="bold" fill="#fff" textAnchor="middle" dy=".3em">📍</text>

                {/* Legs - Jeans */}
                <rect x="115" y="270" width="18" height="70" rx="8" fill="#1e3a5f" />
                <rect x="147" y="270" width="18" height="70" rx="8" fill="#1e3a5f" />

                {/* Shoes - Sneakers */}
                <ellipse cx="124" cy="345" rx="14" ry="10" fill="#374151" />
                <ellipse cx="156" cy="345" rx="14" ry="10" fill="#374151" />
                <ellipse cx="124" cy="342" rx="12" ry="6" fill="#4b5563" />
                <ellipse cx="156" cy="342" rx="12" ry="6" fill="#4b5563" />

                {/* College Badge/ID */}
                <rect x="35" y="240" width="35" height="50" rx="3" fill="#fff" stroke="#2563eb" strokeWidth="2" opacity="0.9" />
                <circle cx="52.5" cy="255" r="8" fill="#fdbf5e" />
                <text x="52.5" y="275" fontSize="6" fontWeight="bold" fill="#1e40af" textAnchor="middle">COLLEGE</text>
              </svg>

              {/* Location Pin & Job Cards */}
              <div className="flex flex-col gap-6">
                {/* Location Pin Animation */}
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  className="drop-shadow-md"
                >
                  {/* Map Background */}
                  <rect width="100" height="100" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
                  
                  {/* Small Map Elements */}
                  <path d="M 20 40 Q 50 20 80 40" stroke="#d1d5db" strokeWidth="2" fill="none" />
                  <circle cx="30" cy="70" r="3" fill="#cbd5e1" />
                  <circle cx="70" cy="65" r="3" fill="#cbd5e1" />
                  
                  {/* Main Location Pin */}
                  <circle cx="50" cy="45" r="12" fill="#10b981" />
                  <path d="M 50 60 L 44 75 Q 50 82 56 75 Z" fill="#10b981" />
                  <circle cx="50" cy="45" r="5" fill="#fff" />
                </svg>

                {/* Job Opportunity Card */}
                <div className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-200 w-32">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📍</span>
                    <p className="text-xs font-bold text-gray-800">Jobs Nearby</p>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">50+ Available</p>
                  <p className="text-xs text-emerald-600 mt-2">$15-25/hr</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose LocalGig?
            </h3>
            <p className="text-xl text-gray-600">
              Everything you need for safe, flexible, and local part-time work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Location-Based Jobs
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Find opportunities right near your campus or home. No long commutes, 
                just local work that fits your location.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Jobs within walking distance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Map preview of job locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Filter by proximity</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Time Matching
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Set your availability and get matched with jobs that fit your schedule. 
                Balance work and study effortlessly.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Flexible scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Update availability anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Track work hours easily</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Reviews & Safety
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Work with verified clients and build your reputation. 
                Check-in/check-out features and review system ensure safety.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Verified client badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Rating and review system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Report and support features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Profile
              </h4>
              <p className="text-gray-600">
                Sign up as a student or client and set up your profile with your preferences and availability
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Find or Post Jobs
              </h4>
              <p className="text-gray-600">
                Students browse nearby jobs, clients post opportunities and review applicants
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Work & Get Paid
              </h4>
              <p className="text-gray-600">
                Complete jobs with check-in/out tracking, build your reputation with reviews
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-white">LocalGig</h1>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting college students with local opportunities for flexible part-time work.
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li>
                  <button
                    onClick={() => navigate("/admin/login")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Admin Access
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
            <p>© 2026 LocalGig. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}