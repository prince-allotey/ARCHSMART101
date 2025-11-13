import React, { useState } from "react";
import { Lightbulb, Shield, Tv, Wifi, Fan, Lock, Power, Smartphone, Zap, Clock, CheckCircle, Brain, Timer, TrendingDown } from "lucide-react";

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
      title: "One-Touch Scenes",
      desc: "Activate 'Movie Mode', 'Goodnight', or 'Party Time' with a single tap. Control lights, music, temperature, and more.",
      icon: <Zap className="w-12 h-12 text-yellow-600" />,
    },
    {
      title: "Voice Control",
      desc: "Works with Alexa, Google Assistant, and Siri. Control everything with your voice in English or Twi.",
      icon: <Brain className="w-12 h-12 text-purple-600" />,
    },
    {
      title: "Smart Scheduling",
      desc: "Automate your entire home. Lights on at sunset, doors lock at midnight, coffee ready at 6am.",
      icon: <Clock className="w-12 h-12 text-blue-600" />,
    },
    {
      title: "Geofencing",
      desc: "Home knows when you're arriving. Lights turn on, AC starts cooling, gates open automatically.",
      icon: <Smartphone className="w-12 h-12 text-green-600" />,
    },
    {
      title: "Energy Monitoring",
      desc: "See real-time power consumption for every device. Get alerts when bills are too high.",
      icon: <TrendingDown className="w-12 h-12 text-emerald-600" />,
    },
    {
      title: "Away Mode",
      desc: "Random lights on/off when you're away to simulate presence. Deters burglars automatically.",
      icon: <Shield className="w-12 h-12 text-red-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block bg-purple-100 px-4 py-2 rounded-full mb-4">
            <span className="text-purple-600 font-semibold text-sm">🏡 Your Home, Smarter Than Ever</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Control Everything from Your Phone
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            One app to control lights, security, entertainment, climate, and more. Turn your home into a smart paradise with scenes, schedules, and voice commands.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700"><strong>Control Anywhere</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700"><strong>Voice Activated</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Timer className="w-5 h-5 text-green-600" />
              <span className="text-gray-700"><strong>Auto Scheduling</strong></span>
            </div>
          </div>
        </header>

        {/* Master Power Control */}
        <div className="flex justify-center mb-12">
          <button
            onClick={toggleAll}
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl ${
              allDevicesOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <Power className="w-6 h-6" />
            {allDevicesOn ? "Turn Everything Off" : "Turn Everything On"}
          </button>
        </div>

        {/* Devices Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-6 rounded-3xl shadow-md bg-white border-2 transition transform hover:-translate-y-1 hover:shadow-xl ${
                device.status ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {device.icon}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {device.name}
                  </h3>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    device.status
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
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
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Total Home Intelligence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced automation features that make your home work for you, not the other way around
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Automation Stats */}
        <section className="mt-20 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12">Proven Time & Money Savings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">40%</div>
                <div className="text-purple-200">Energy Saved</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">2hrs</div>
                <div className="text-purple-200">Daily Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">3,200+</div>
                <div className="text-purple-200">Smart Homes</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">99.9%</div>
                <div className="text-purple-200">Uptime Reliability</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          <div className="relative z-10">
            <Zap className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready for the Smartest Home in Ghana?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join 3,200+ homeowners who control everything from their phone. Full setup in 24 hours, no wiring mess, lifetime support included.
            </p>
  
            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>24hr Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No Monthly Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Lifetime Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Local Support Team</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
