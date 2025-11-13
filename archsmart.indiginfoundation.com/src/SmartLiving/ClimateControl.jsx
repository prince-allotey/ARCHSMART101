import React, { useState } from "react";
import { Thermometer, Wind, Sun, Snowflake, Power } from "lucide-react";

export default function ClimateControl() {
  const [temperature, setTemperature] = useState(22); // default °C
  const [mode, setMode] = useState("Auto");
  const [power, setPower] = useState(true);

  const increaseTemp = () => setTemperature((prev) => Math.min(prev + 1, 32));
  const decreaseTemp = () => setTemperature((prev) => Math.max(prev - 1, 16));
  const togglePower = () => setPower((prev) => !prev);

  const modes = [
    { label: "Auto", icon: <Wind className="w-5 h-5 text-sky-600" /> },
    { label: "Cool", icon: <Snowflake className="w-5 h-5 text-blue-500" /> },
    { label: "Heat", icon: <Sun className="w-5 h-5 text-amber-500" /> },
  ];

  const features = [
    {
      title: "Remote Access",
      desc: "Adjust your climate settings from any device, anytime.",
      icon: <Wind className="w-10 h-10 text-sky-500" />,
    },
    {
      title: "Energy Efficiency",
      desc: "Smart algorithms optimize power usage and reduce bills.",
      icon: <Sun className="w-10 h-10 text-amber-500" />,
    },
    {
      title: "Multi-Zone Control",
      desc: "Set personalized temperatures for different rooms.",
      icon: <Thermometer className="w-10 h-10 text-blue-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Climate Control
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Monitor and adjust your property's indoor climate from anywhere — comfort meets efficiency.
          </p>
        </header>

        {/* Main Control Card */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-4 mb-6">
            <Thermometer className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Smart Thermostat
            </h2>
          </div>

          <div className="flex items-center gap-6 justify-center">
            <button
              onClick={decreaseTemp}
              className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full w-12 h-12 text-2xl font-bold transition"
              disabled={!power}
            >
              −
            </button>
            <div>
              <p className="text-6xl font-extrabold text-blue-600 dark:text-blue-400">
                {temperature}°C
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Current Temperature
              </p>
            </div>
            <button
              onClick={increaseTemp}
              className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full w-12 h-12 text-2xl font-bold transition"
              disabled={!power}
            >
              +
            </button>
          </div>

          {/* Mode selector */}
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
            {modes.map((m) => (
              <button
                key={m.label}
                onClick={() => setMode(m.label)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border transition ${
                  mode === m.label
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700"
                }`}
                disabled={!power}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Power toggle */}
          <button
            onClick={togglePower}
            className={`mt-10 flex items-center gap-3 px-6 py-3 rounded-full text-lg font-medium transition ${
              power
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-400 hover:bg-gray-500 text-white"
            }`}
          >
            <Power className="w-5 h-5" />
            {power ? "Turn Off" : "Turn On"}
          </button>
        </div>

        {/* Features Section */}
        <section className="mt-16 grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
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
