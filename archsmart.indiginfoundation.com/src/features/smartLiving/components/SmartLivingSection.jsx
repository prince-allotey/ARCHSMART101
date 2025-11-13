import React from "react";
import { Link } from "react-router-dom";
import { Wifi, Shield, Thermometer, Lightbulb, ArrowRight } from "lucide-react";

export const SmartLivingSection = () => {
  const smartFeatures = [
    {
      icon: Lightbulb,
      title: "Smart Lighting",
      description:
        "Automated lighting systems that adjust to your daily routine and save energy.",
      image: "/images/smartliving/smart-lighting.jpg",
      link: "/smart-lighting",
    },
    {
      icon: Shield,
      title: "Security Systems",
      description:
        "Advanced home security with smart locks, cameras, and monitoring.",
      image: "/images/smartliving/Security.jpg",
      link: "/security-systems",
    },
    {
      icon: Thermometer,
      title: "Climate Control",
      description:
        "Smart thermostats and HVAC systems for optimal comfort and efficiency.",
      image: "/images/smartliving/climate.webp",
      link: "/climate-control",
    },
    {
      icon: Wifi,
      title: "Home Automation",
      description:
        "Integrated smart home systems controllable from your smartphone.",
      image: "/images/smartliving/home-automation.webp",
      link: "/home-automation",
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Living Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your home with cutting-edge technology that enhances comfort,
            security, and energy efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {smartFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 relative overflow-hidden">
                    <img
                      src={feature.image}
                      alt={`Smart Living - ${feature.title}`}
                      className="w-full h-48 md:h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-6">
                      <Link
                        to={feature.link}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group/link"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmartLivingSection;
