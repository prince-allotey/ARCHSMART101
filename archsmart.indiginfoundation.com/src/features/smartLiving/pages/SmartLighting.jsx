import React, { useState } from "react";
import { Lightbulb, Sun, Moon, Power, Sliders, Zap, Clock, Shield, Wifi, Smartphone, TrendingDown, CheckCircle } from "lucide-react";

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
      title: "Voice & App Control",
      desc: "Command your lights with Alexa, Google Assistant, or our intuitive mobile app from anywhere in the world.",
      icon: <Smartphone className="w-10 h-10 text-blue-500" />,
    },
    {
      title: "Schedule Automation",
      desc: "Wake up to gentle sunrise simulation. Come home to perfectly lit spaces. Automate your entire lighting schedule.",
      icon: <Clock className="w-10 h-10 text-amber-500" />,
    },
    {
      title: "Scene Customization",
      desc: "Create the perfect ambiance for any moment - movie night, dinner party, or focused work sessions.",
      icon: <Power className="w-10 h-10 text-purple-500" />,
    },
    {
      title: "Energy Intelligence",
      desc: "Cut electricity bills by up to 60%. AI-powered sensors detect presence and adjust automatically.",
      icon: <TrendingDown className="w-10 h-10 text-emerald-500" />,
    },
    {
      title: "16 Million Colors",
      desc: "Transform any room with RGB color customization. Match your mood, season, or special occasions.",
      icon: <Sun className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Security Integration",
      desc: "Simulate presence when away. Flash lights for alerts. Integrate seamlessly with your security system.",
      icon: <Shield className="w-10 h-10 text-red-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full mb-4">
            <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">✨ The Future of Home Lighting</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-dark mb-6 leading-tight">
            Illuminate Your Life with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500">
              Intelligent Lighting
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform every room into a masterpiece of light and ambiance. Control, automate, and personalize your home's lighting with cutting-edge smart technology that saves energy while elevating your lifestyle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>60% Energy Savings</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Voice Controlled</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>16M+ Colors</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Lifetime Warranty</span>
            </div>
          </div>
        </header>

        {/* Overview Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl p-8 mb-16 border border-amber-200 dark:border-amber-900/30">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <div className="relative">
              <Lightbulb className="w-12 h-12 text-yellow-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Live Energy Monitor
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalEnergy} kWh</span> currently in use
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                💰 Saving <span className="font-semibold text-emerald-600">GH₵{(totalEnergy * 2.5).toFixed(2)}</span> vs traditional lighting
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg">
              <Sliders className="w-6 h-6 text-amber-500" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {lights.filter((l) => l.active).length}/{lights.length}
              </span>
              <span className="text-gray-600 dark:text-gray-400">Active</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">Control from anywhere</p>
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
        <section className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-dark mb-4">
              Why Smart Lighting Changes Everything
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-700 max-w-2xl mx-auto">
              Experience the perfect blend of convenience, savings, and sophistication
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          <div className="relative z-10">
            <Zap className="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of Ghanaian homeowners who've upgraded to smart lighting. Professional installation, lifetime support, and unbeatable prices.
            </p>
            
            

            <div className="mt-10 flex flex-wrap justify-center gap-8 text-white">
              <div>
                <div className="text-3xl font-bold">2,000+</div>
                <div className="text-white/80 text-sm">Installations</div>
              </div>
              <div>
                <div className="text-3xl font-bold">60%</div>
                <div className="text-white/80 text-sm">Energy Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold">5-Star</div>
                <div className="text-white/80 text-sm">Customer Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
 