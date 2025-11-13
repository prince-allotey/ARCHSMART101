import React, { useState } from "react";
import { Lightbulb, Sun, Moon, Power, Sliders } from "lucide-react";

export default function SmartLighting() {
  const [lights, setLights] = useState([
    { id: 1, name: "Living Room", brightness: 80, color: "warm", active: true },
    { id: 2, name: "Bedroom", brightness: 40, color: "cool", active: false },
    { id: 3, name: "Kitchen", brightness: 100, color: "neutral", active: true },
    { id: 4, name: "Outdoor Patio", brightness: 60, color: "warm", active: false },
  ]);

  const toggleLight = (id) => {
    setLights((prev) =>
      prev.map((light) =>
        light.id === id ? { ...light, active: !light.active } : light
      )
    );
  };

  const adjustBrightness = (id, newValue) => {
    setLights((prev) =>
      prev.map((light) =>
        light.id === id ? { ...light, brightness: newValue } : light
      )
    );
  };

  const totalEnergy = lights
    .filter((light) => light.active)
    .reduce((sum, light) => sum + light.brightness * 0.05, 0)
    .toFixed(1);

  const features = [
    {
      title: "Schedule Automation",
      desc: "Set automatic lighting routines for day and night.",
      icon: <Sun className="w-10 h-10 text-amber-500" />,
    },
    {
      title: "Color Customization",
      desc: "Switch between warm, cool, or RGB lighting for any mood.",
      icon: <Power className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Energy Efficiency",
      desc: "Smart dimming and occupancy sensors save up to 30% energy.",
      icon: <Moon className="w-10 h-10 text-blue-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 p-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            Smart Lighting Control
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Control, schedule, and customize your lighting setup for maximum comfort and energy efficiency.
          </p>
        </header>

        {/* Overview Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <Lightbulb className="w-10 h-10 text-yellow-400 animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Total Energy Usage
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {totalEnergy} kWh currently in use
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sliders className="w-8 h-8 text-amber-500" />
            <span className="text-lg text-gray-800 dark:text-gray-200">
              {lights.filter((l) => l.active).length}/{lights.length} Lights On
            </span>
          </div>
        </div>

        {/* Lights Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {lights.map((light) => (
            <div
              key={light.id}
              className={`p-6 rounded-3xl shadow-md bg-white dark:bg-gray-900 border transition hover:-translate-y-1 hover:shadow-xl ${
                light.active
                  ? "border-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-500/40"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Lightbulb
                    className={`w-8 h-8 ${
                      light.active ? "text-yellow-400 animate-glow" : "text-gray-400"
                    }`}
                  />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {light.name}
                  </h3>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    light.active
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {light.active ? "On" : "Off"}
                </span>
              </div>

              {/* Brightness Slider */}
              <div className="flex items-center gap-3 mb-4">
                <Sun className="w-5 h-5 text-yellow-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={light.brightness}
                  onChange={(e) => adjustBrightness(light.id, Number(e.target.value))}
                  className="flex-1 accent-yellow-400"
                  disabled={!light.active}
                />
                <Moon className="w-5 h-5 text-gray-500" />
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => toggleLight(light.id)}
                className={`w-full py-2 rounded-full font-medium transition ${
                  light.active
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {light.active ? "Turn Off" : "Turn On"}
              </button>
            </div>
          ))}
        </section>

        {/* Features Section */}
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
