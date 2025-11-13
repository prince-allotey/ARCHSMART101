import React from "react";
import { motion } from "framer-motion";
import { Home, Building2, TrendingUp, Handshake, MapPin, ShieldCheck, CheckCircle, Star, Users, Award, Clock, FileText, Search, Key } from "lucide-react";

export default function PropertySales() {
  const features = [
    {
      icon: <Home className="w-10 h-10 text-blue-600" />,
      title: "Wide Property Range",
      desc: "From cozy apartments to luxury villas — find your perfect match in our curated listings.",
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-emerald-600" />,
      title: "Market Insights",
      desc: "Stay informed with the latest property trends, pricing, and investment opportunities.",
    },
    {
      icon: <Handshake className="w-10 h-10 text-amber-600" />,
      title: "Transparent Transactions",
      desc: "We ensure smooth and secure property deals, handling all paperwork and legalities for you.",
    },
    {
      icon: <Building2 className="w-10 h-10 text-indigo-600" />,
      title: "Commercial Expertise",
      desc: "Looking for office spaces or retail properties? Our team specializes in commercial sales.",
    },
    {
      icon: <MapPin className="w-10 h-10 text-rose-600" />,
      title: "Prime Locations",
      desc: "We focus on properties in high-demand, growth-oriented areas with strong future value.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-gray-700" />,
      title: "Trusted Service",
      desc: "With verified listings and professional consultants, you can buy with full confidence.",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Tell Us What You Want",
      desc: "Share your budget, preferred location, property type, and must-have features. Our AI-powered search finds perfect matches instantly.",
      icon: <Search className="w-12 h-12 text-blue-600" />,
    },
    {
      step: "02",
      title: "Property Tours & Viewings",
      desc: "We arrange convenient viewing times, provide virtual tours, and give you honest assessments of every property's condition and value.",
      icon: <MapPin className="w-12 h-12 text-green-600" />,
    },
    {
      step: "03",
      title: "Negotiate Best Price",
      desc: "Our expert negotiators fight for you to get the best deal. We've saved clients an average of 12% below asking price.",
      icon: <TrendingUp className="w-12 h-12 text-purple-600" />,
    },
    {
      step: "04",
      title: "Handle All Paperwork",
      desc: "From land searches to deed transfers, we manage all legal documentation. You just sign, we handle everything else.",
      icon: <FileText className="w-12 h-12 text-orange-600" />,
    },
    {
      step: "05",
      title: "Get Your Keys",
      desc: "Final inspection, handover, and you're done! Plus, we offer 6 months free property management for all sales.",
      icon: <Key className="w-12 h-12 text-teal-600" />,
    },
  ];

  const testimonials = [
    {
      name: "Kwame Mensah",
      role: "Homeowner, East Legon",
      rating: 5,
      text: "ArchSmart helped me find my dream home in just 2 weeks! They negotiated GH₵150,000 off the asking price. Professional service from start to finish.",
    },
    {
      name: "Ama Serwaa",
      role: "Business Owner, Tema",
      rating: 5,
      text: "Bought a commercial property through ArchSmart. They handled all the complex paperwork and saved me months of stress. Highly recommend!",
    },
    {
      name: "David Osei",
      role: "First-Time Buyer, Spintex",
      rating: 5,
      text: "As a first-time buyer, I was nervous. The team walked me through every step, explained everything clearly, and got me an amazing deal. Thank you!",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="py-24 px-6 lg:px-20 text-center">
        <motion.div
          className="inline-block bg-blue-100 px-4 py-2 rounded-full mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-blue-600 font-semibold text-sm">🏠 Ghana's #1 Property Sales Platform</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Find Your Dream Property in Ghana
        </motion.h1>

        <motion.p
          className="text-gray-700 text-xl leading-relaxed max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          From luxury villas in East Legon to affordable apartments in Tema, we connect you with verified properties across Ghana. Expert guidance, transparent pricing, and stress-free transactions guaranteed.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-6 text-sm mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700"><strong>2,500+ Properties Sold</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-700"><strong>4.9/5 Client Rating</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700"><strong>14 Days Average Sale</strong></span>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
            Browse Properties
          </button>
          <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all">
            Speak to an Agent
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Why Choose ArchSmart for Your Next Property
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

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Property Journey Made Simple
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From search to handover in 5 easy steps. We handle the complex parts so you can focus on celebrating.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {process.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row items-start gap-6 bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {item.step}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {item.icon}
                  <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-20 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Trusted by Thousands Across Ghana</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">2,500+</div>
              <div className="text-blue-100">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">GH₵450M+</div>
              <div className="text-blue-100">Total Sales Value</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">14 Days</div>
              <div className="text-blue-100">Average Sale Time</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who found their dream properties with ArchSmart
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-base leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Every Property Type, Every Location
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're looking for residential or commercial, we have verified listings across all major cities in Ghana
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <Home className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Apartments</h3>
            <p className="text-gray-600 text-sm mb-3">Modern flats, penthouses, and studios</p>
            <p className="text-2xl font-bold text-blue-600">450+ Listings</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Houses</h3>
            <p className="text-gray-600 text-sm mb-3">Villas, townhouses, and bungalows</p>
            <p className="text-2xl font-bold text-green-600">620+ Listings</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Commercial</h3>
            <p className="text-gray-600 text-sm mb-3">Offices, retail spaces, warehouses</p>
            <p className="text-2xl font-bold text-purple-600">280+ Listings</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Land</h3>
            <p className="text-gray-600 text-sm mb-3">Residential & commercial plots</p>
            <p className="text-2xl font-bold text-orange-600">350+ Listings</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-20 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Award className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join 2,500+ satisfied homeowners who trusted ArchSmart. Book a free consultation today and let our expert agents find the perfect property for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              Schedule Free Consultation
            </button>
            <button className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              View All Properties
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free Property Valuation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Legal Support Included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>6 Months Free Management</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
