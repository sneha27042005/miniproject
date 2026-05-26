import { motion } from "motion/react";
import { MapPin, Users } from "lucide-react";

export function LocalGigIntro() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-amber-50 via-amber-50 to-emerald-100 overflow-hidden flex items-center justify-center">
      {/* Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23000' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: "400px 400px",
        }}
      />

      {/* Warm Lighting Background */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 119, 6, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Floating Job Cards Background */}
        <motion.div
          className="absolute -left-20 top-20 bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-200"
          style={{
            maxWidth: "200px",
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-800">
              Barista
            </span>
          </div>
          <p className="text-xs text-gray-600">$18/hr • 0.3 km away</p>
        </motion.div>

        <motion.div
          className="absolute -right-20 bottom-32 bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200"
          style={{
            maxWidth: "200px",
          }}
          animate={{
            y: [0, 15, 0],
            rotate: [2, -2, 2],
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            delay: 1,
          }}
          initial={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">
              Tutor
            </span>
          </div>
          <p className="text-xs text-gray-600">$22/hr • 0.5 km away</p>
        </motion.div>

        {/* Main Content Container */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Phone with Notification */}
          <motion.div
            className="relative mb-8"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            {/* Phone Frame */}
            <div className="w-48 h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl shadow-2xl p-2 border-8 border-slate-400">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center">
                {/* Phone Screen Content */}
                <motion.div
                  className="text-center px-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                >
                  <MapPin className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    NEW JOB NEARBY
                  </p>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    Delivery Assistant
                  </p>
                  <p className="text-xs text-gray-600 mb-3">$17/hr • 0.2 km</p>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">
                    View Now
                  </button>
                </motion.div>
              </div>

              {/* Pulsing Map Pin on Phone */}
              <motion.div
                className="absolute top-12 right-6 w-8 h-8"
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <div className="w-full h-full bg-emerald-500 rounded-full shadow-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Hand holding phone (simple SVG) */}
            <motion.svg
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-32 text-amber-900 opacity-80"
              viewBox="0 0 100 120"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <path
                d="M30 80 Q25 90 30 110 M40 85 Q35 95 38 110 M50 88 Q50 100 50 110 M60 85 Q65 95 62 110"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M20 70 Q15 75 20 85 L35 75"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          </motion.div>

          {/* Logo and Text */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5, duration: 1.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">LocalGig</h1>
            </div>

            {/* Tagline */}
            <motion.p
              className="text-xl text-gray-700 font-light tracking-wide max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6, duration: 1 }}
            >
              Find Local Work.{" "}
              <motion.span
                className="block mt-2 text-emerald-600 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.5, duration: 1 }}
              >
                Build Real Experience.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Fade Out at End */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.3] }}
            transition={{ delay: 8, duration: 1.5 }}
            style={{
              background: "radial-gradient(circle, transparent 0%, rgba(0,0,0,0.3) 100%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
