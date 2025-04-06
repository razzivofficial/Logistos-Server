import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const endpoints = {
  startRDS: "https://a4552wrm2urw3v623x7lz7vqle0gmrrc.lambda-url.ap-south-1.on.aws/",
  startEC2: "https://j5zxbrxtf7x4og3is62inv7agu0cuurt.lambda-url.ap-south-1.on.aws/",
  stopEC2: "https://c665d2ugxezezbdzceuebtlaku0cacbv.lambda-url.ap-south-1.on.aws/",
  stopRDS: "https://a4552wrm2urw3v623x7ldsvdvsdvrrc.lambda-url.ap-south-1.on.aws/",
};

type ServerStatus = {
  [key: string]: "running" | "stopped" | "pending" | "unknown";
};

const App: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    "Start RDS": "unknown",
    "Start EC2": "unknown",
    "Stop EC2": "unknown",
    "Stop RDS": "unknown",
  });
  const [showStatusPanel, setShowStatusPanel] = useState(false);

  const handleClick = async (label: string, url: string) => {
    try {
      setLoading(label);
      setServerStatus(prev => ({ ...prev, [label]: "pending" }));

      // Simulate API call with timeout for demo purposes
      const res = await Promise.race([
        fetch(url, { method: "GET" }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
      ]);

      const text = await (res as Response).text();

      if (text.toLowerCase().includes("null")) {
        toast.error(`❌ ${label} failed - No response from server`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setServerStatus(prev => ({ ...prev, [label]: "stopped" }));
      } else {
        toast.success(`✅ ${label} successful!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setServerStatus(prev => ({
          ...prev,
          [label]: label.includes("Start") ? "running" : "stopped"
        }));
      }
    } catch (error) {
      toast.error(`❌ Failed to ${label}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setServerStatus(prev => ({ ...prev, [label]: "unknown" }));
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500";
      case "stopped": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center justify-center p-4 md:p-8">
      <ToastContainer />

      <motion.div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold mb-4 md:mb-0"
            >
              ☁️ Cloud Server Dashboard
            </motion.h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStatusPanel(!showStatusPanel)}
              className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center gap-2"
            >
              {showStatusPanel ? "Hide" : "Show"} Status
              <motion.span
                animate={{ rotate: showStatusPanel ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ⬇️
              </motion.span>
            </motion.button>
          </div>
        </motion.div>

        {/* Status Panel */}
        <AnimatePresence>
          {showStatusPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-gray-50 border-b">
                <h3 className="font-semibold text-lg mb-4 text-gray-700">Server Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(serverStatus).map(([key, status]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center"
                    >
                      <span className="text-sm font-medium text-gray-600 mb-2">{key}</span>
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(status)}`} />
                      <span className="text-xs mt-1 capitalize">{status}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          {!showButtons ? (
            <motion.div
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2
                }}
                className="mb-8"
              >
                <div className="text-6xl">☁️</div>
              </motion.div>

              <motion.h2
                className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Manage Your Cloud Infrastructure
              </motion.h2>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowButtons(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl shadow-xl font-semibold text-lg flex items-center gap-2"
              >
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {[
                {
                  label: "▶️ Start RDS",
                  key: "Start RDS",
                  color: "from-green-500 to-emerald-500",
                  url: endpoints.startRDS,
                  icon: "🛢️",
                },
                {
                  label: "▶️ Start EC2",
                  key: "Start EC2",
                  color: "from-green-500 to-emerald-500",
                  url: endpoints.startEC2,
                  icon: "🖥️",
                },
                {
                  label: "⛔ Stop EC2",
                  key: "Stop EC2",
                  color: "from-red-500 to-rose-500",
                  url: endpoints.stopEC2,
                  icon: "🖥️",
                },
                {
                  label: "⛔ Stop RDS",
                  key: "Stop RDS",
                  color: "from-red-500 to-rose-500",
                  url: endpoints.stopRDS,
                  icon: "🛢️",
                },
              ].map(({ label, key, color, url, icon }) => (
                <motion.button
                  key={key}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleClick(key, url)}
                  disabled={loading === key}
                  className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl shadow-lg transition font-semibold text-md flex items-center justify-between disabled:opacity-70`}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-2xl"
                      animate={loading === key ? { rotate: 360 } : {}}
                      transition={loading === key ? { repeat: Infinity, duration: 1 } : {}}
                    >
                      {loading === key ? "⏳" : icon}
                    </motion.span>
                    <span>{label.split(" ")[0]}</span>
                  </div>
                  <span className="text-sm font-medium">{label.split(" ").slice(1).join(" ")}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          className="bg-gray-50 p-4 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Cloud Management Dashboard v1.0</p>
          <p className="mt-1">All actions are logged for security purposes</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;