import React from "react";
import { motion } from "framer-motion";
import { Cpu, Lightbulb, ThermometerSun, Shield, Smartphone, Wifi } from "lucide-react";

export default function SmartHomeInstallation() {
  const features = [
    {
      icon: <Lightbulb className="w-10 h-10 text-yellow-500" />,
      title: "Smart Lighting",
      desc: "Automate your lighting with motion sensors, dimming, and voice control for energy efficiency and comfort.",
    },
    {
      icon: <ThermometerSun className="w-10 h-10 text-red-500" />,
      title: "Climate Control",
      desc: "Regulate your home’s temperature intelligently with automated thermostats and real-time monitoring.",
    },
    {
      icon: <Shield className="w-10 h-10 text-emerald-600" />,
      title: "Smart Security",
      desc: "Enhance your safety with motion sensors, smart locks, and 24/7 camera systems accessible from anywhere.",
    },
    {
      icon: <Smartphone className="w-10 h-10 text-blue-600" />,
      title: "Mobile Integration",
      desc: "Control every aspect of your smart home through your phone — from lighting to appliances and alarms.",
    },
    {
      icon: <Cpu className="w-10 h-10 text-indigo-600" />,
      title: "Automation Hub",
      desc: "Our integrated systems sync seamlessly with Alexa, Google Home, and Apple HomeKit for unified control.",
    },
    {
      icon: <Wifi className="w-10 h-10 text-rose-600" />,
      title: "Connected Network",
      desc: "Experience reliable connectivity with advanced mesh Wi-Fi setups designed for smart devices.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="py-24 px-6 lg:px-20 text-center">
        <motion.h1
          className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Smart Home Installation
        </motion.h1>

        <motion.p
          className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Transform your home into an intelligent, connected space. Our expert team designs and installs
          automation systems that let you control lighting, temperature, and security — right from your smartphone.
        </motion.p>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Smart Living, Simplified
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 text-center flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              {item.icon}
              <h3 className="mt-4 font-semibold text-lg text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
