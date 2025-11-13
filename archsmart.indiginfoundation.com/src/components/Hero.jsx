import React, { useState } from "react";
import {
  Search,
  MapPin,
  Home,
  Zap,
  TrendingUp,
  Users,
  CheckCircle,
  Award,
  Shield,
  Clock,
} from "lucide-react";

export const Hero = ({ onSearchProperties }) => {
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    type: "",
    priceRange: "",
  });

  const handleSearch = () => {
    onSearchProperties(searchFilters);
  };

  return (
    <>
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* === HERO HEADER SECTION === */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Ghana's Premier
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Smart Real Estate Hub
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover modern properties, smart home solutions, and expert real
            estate guidance. Your journey to smart living in Ghana starts here.
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none z-10" />
                <select
                  value={searchFilters.location}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      location: e.target.value,
                    })
                  }
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
                >
                  <option value="">All Locations</option>
                  <option value="accra">Accra</option>
                  <option value="kumasi">Kumasi</option>
                  <option value="takoradi">Takoradi</option>
                  <option value="cape-coast">Cape Coast</option>
                  <option value="tema">Tema</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Property Type
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none z-10" />
                <select
                  value={searchFilters.type}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, type: e.target.value })
                  }
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
                >
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Price Range
              </label>
              <select
                value={searchFilters.priceRange}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    priceRange: e.target.value,
                  })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
              >
                <option value="">Any Price</option>
                <option value="0-200000">Under GH₵200k</option>
                <option value="200000-500000">GH₵200k - GH₵500k</option>
                <option value="500000-1000000">GH₵500k - GH₵1M</option>
                <option value="1000000+">Above GH₵1M</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Premium Properties
            </h3>
            <p className="text-blue-100">
              Curated selection of the finest real estate across Ghana
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Smart Living
            </h3>
            <p className="text-blue-100">
              Modern homes with cutting-edge technology and automation
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Expert Guidance
            </h3>
            <p className="text-blue-100">
              Professional real estate advice and investment insights
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* White Background Section */}
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">500+</h4>
            <p className="text-blue-600 font-semibold text-sm md:text-base">Properties Listed</p>
          </div>
          
          <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">2,000+</h4>
            <p className="text-emerald-600 font-semibold text-sm md:text-base">Happy Clients</p>
          </div>
          
          <div className="text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">50+</h4>
            <p className="text-amber-600 font-semibold text-sm md:text-base">Expert Agents</p>
          </div>
          
          <div className="text-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">98%</h4>
            <p className="text-pink-600 font-semibold text-sm md:text-base">Success Rate</p>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};
