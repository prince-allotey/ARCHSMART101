import React, { useState } from "react";
import { Lightbulb, Shield, Tv, Wifi, Fan, Lock, Power } from "lucide-react";

export default function HomeAutomation() {
  const [devices, setDevices] = useState([
    { id: 1, name: "Living Room Lights", icon: <Lightbulb className="w-8 h-8 text-yellow-400" />, status: true },
    { id: 2, name: "Security System", icon: <Shield className="w-8 h-8 text-red-500" />, status: false },
    { id: 3, name: "Smart TV", icon: <Tv className="w-8 h-8 text-blue-500" />, status: true },
    { id: 4, name: "Wi-Fi Router", icon: <Wifi className="w-8 h-8 text-green-500" />, status: true },
    { id: 5, name: "Ceiling Fan", icon: <Fan className="w-8 h-8 text-cyan-400" />, status: false },
    { id: 6, name: "Smart Lock", icon: <Lock className="w-8 h-8 text-gray-500" />, status: true },
  ]);

  const toggleDevice = (id) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: !d.status } : d))
    );
  };

  const allDevicesOn = devices.every((d) => d.status);
  const toggleAll = () => {
    setDevices((prev) => prev.map((d) => ({ ...d, status: !allDevicesOn })));
  };

  const features = [
    {
      title: "Voice Control",
      desc: "Integrate Alexa or Google Assistant for effortless voice commands.",
      icon: <MicIcon />,
    },
    {
      title: "Automation Scenes",
      desc: "Create smart routines like 'Movie Mode' or 'Away Mode' to manage multiple devices.",
      icon: <SceneIcon />,
    },
    {
      title: "Energy Reports",
      desc: "Track real-time power consumption and optimize your energy usage.",
      icon: <ReportIcon />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 p-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            Home Automation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your property’s lighting, security, and entertainment from a single intuitive dashboard.
          </p>
        </header>

        {/* Master Power Control */}
        <div className="flex justify-center mb-12">
          <button
            onClick={toggleAll}
            className={`flex items-center gap-3 px-6 py-3 rounded-full text-lg font-semibold shadow-md transition ${
              allDevicesOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <Power className="w-5 h-5" />
            {allDevicesOn ? "Turn Everything Off" : "Turn Everything On"}
          </button>
        </div>

        {/* Devices Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-6 rounded-3xl shadow-md bg-white dark:bg-gray-900 border transition transform hover:-translate-y-1 hover:shadow-xl ${
                device.status ? "border-green-500" : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {device.icon}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {device.name}
                  </h3>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    device.status
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {device.status ? "ON" : "OFF"}
                </span>
              </div>
              <button
                onClick={() => toggleDevice(device.id)}
                className={`w-full py-2 rounded-full font-medium transition ${
                  device.status
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {device.status ? "Turn Off" : "Turn On"}
              </button>
            </div>
          ))}
        </section>

        {/* Smart Features Section */}
        <section className="mt-20 grid md:grid-cols-3 gap-10">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

// Custom minimal icons for feature cards
const MicIcon = () => (
  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 1v10a4 4 0 0 0 8 0V1M19 11a7 7 0 0 1-14 0" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const SceneIcon = () => (
  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
    <line x1="7" y1="21" x2="17" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ReportIcon = () => (
  <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 3h18v18H3z" />
    <line x1="8" y1="17" x2="8" y2="13" />
    <line x1="12" y1="17" x2="12" y2="9" />
    <line x1="16" y1="17" x2="16" y2="11" />
  </svg>
);
