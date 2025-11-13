import React, { useState } from "react";
import { Camera, Shield, Bell, Lock, Unlock, AlertTriangle, Power, Wifi } from "lucide-react";

export default function SecuritySystems() {
  const [systems, setSystems] = useState([
    { id: 1, name: "Front Door Lock", icon: <Lock className="w-8 h-8 text-emerald-500" />, status: true },
    { id: 2, name: "Garage Door Lock", icon: <Lock className="w-8 h-8 text-emerald-500" />, status: true },
    { id: 3, name: "Outdoor Camera", icon: <Camera className="w-8 h-8 text-blue-500" />, status: true },
    { id: 4, name: "Indoor Motion Sensor", icon: <Shield className="w-8 h-8 text-yellow-500" />, status: false },
    { id: 5, name: "Alarm System", icon: <Bell className="w-8 h-8 text-red-500" />, status: false },
  ]);

  const toggleSystem = (id) => {
    setSystems((prev) =>
      prev.map((sys) => (sys.id === id ? { ...sys, status: !sys.status } : sys))
    );
  };

  const activeSystems = systems.filter((s) => s.status).length;
  const totalSystems = systems.length;

  const threatLevel =
    activeSystems === totalSystems
      ? "Low"
      : activeSystems >= totalSystems / 2
      ? "Moderate"
      : "High";

  const threatColor =
    threatLevel === "Low"
      ? "text-green-500"
      : threatLevel === "Moderate"
      ? "text-yellow-500"
      : "text-red-600";

  const features = [
    {
      title: "Real-Time Alerts",
      desc: "Get instant notifications for suspicious activity or motion detection.",
      icon: <Bell className="w-10 h-10 text-red-500" />,
    },
    {
      title: "24/7 Monitoring",
      desc: "Enjoy peace of mind with around-the-clock camera surveillance.",
      icon: <Camera className="w-10 h-10 text-blue-500" />,
    },
    {
      title: "Smart Access Control",
      desc: "Lock or unlock doors remotely and track entry logs from anywhere.",
      icon: <Unlock className="w-10 h-10 text-emerald-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            Security Systems
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your smart locks, cameras, and alarm systems from one secure control panel.
          </p>
        </header>

        {/* System Status Overview */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <Wifi className="w-10 h-10 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Online
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {activeSystems}/{totalSystems} devices active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-8 h-8 ${threatColor}`} />
            <span className={`text-lg font-semibold ${threatColor}`}>
              Threat Level: {threatLevel}
            </span>
          </div>
        </div>

        {/* Security Devices Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {systems.map((system) => (
            <div
              key={system.id}
              className={`p-6 rounded-3xl shadow-md bg-white dark:bg-gray-900 border transition transform hover:-translate-y-1 hover:shadow-xl ${
                system.status ? "border-green-500" : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {system.icon}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {system.name}
                  </h3>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    system.status
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {system.status ? "Active" : "Inactive"}
                </span>
              </div>
              <button
                onClick={() => toggleSystem(system.id)}
                className={`w-full py-2 rounded-full font-medium transition ${
                  system.status
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {system.status ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </section>

        {/* Smart Security Features Section */}
        <section className="mt-20 grid md:grid-cols-3 gap-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
