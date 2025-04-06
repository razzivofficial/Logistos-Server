import React from "react";
import { motion } from "framer-motion";

const endpoints = {
  startRDS: "https://a4552wrm2urw3v623x7lz7vqle0gmrrc.lambda-url.ap-south-1.on.aws/",
  startEC2: "https://j5zxbrxtf7x4og3is62inv7agu0cuurt.lambda-url.ap-south-1.on.aws/",
  stopRDS: "https://7jklls3rfp5p6ybneatexyhuay0rmmzu.lambda-url.ap-south-1.on.aws/",
  stopEC2: "https://c665d2ugxezezbdzceuebtlaku0cacbv.lambda-url.ap-south-1.on.aws/",
};

const App: React.FC = () => {
  const handleClick = (url: string) => {
    window.open(url, "_blank"); // Opens in new tab (better UX)
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 mx-4">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-8 text-purple-700">
          ☁️ Cloud Control Panel
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {[
            { label: "Start RDS", url: endpoints.startRDS, icon: "🛢️", color: "bg-green-500 hover:bg-green-600" },
            { label: "Start EC2", url: endpoints.startEC2, icon: "🖥️", color: "bg-green-500 hover:bg-green-600" },
            { label: "Stop RDS", url: endpoints.stopRDS, icon: "🛢️", color: "bg-red-500 hover:bg-red-600" },
            { label: "Stop EC2", url: endpoints.stopEC2, icon: "🖥️", color: "bg-red-500 hover:bg-red-600" },
          ].map(({ label, url, icon, color }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(url)}
              className={`${color} text-white py-4 px-6 rounded-xl flex items-center justify-between shadow-md font-medium w-full transition-colors`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </div>
              <span className="text-sm">→</span>
            </motion.button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Clicking a button will open the Lambda URL in a new tab
        </p>
      </div>
    </div>
  );
};

export default App;