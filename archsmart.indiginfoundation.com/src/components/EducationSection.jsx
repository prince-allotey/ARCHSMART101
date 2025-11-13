import React from "react";
import { BookOpen, TrendingUp, DollarSign, FileText, Users, Award, Home, Target, BarChart, Shield, Lightbulb, Calculator } from "lucide-react";

export default function EducationSection() {
  const educationalResources = [
    {
      icon: TrendingUp,
      title: "Real Estate Investment 101",
      description: "Learn the fundamentals of property investment in Ghana",
      topics: ["Market Analysis", "ROI Calculation", "Risk Assessment", "Portfolio Building"],
      level: "Beginner",
      duration: "3-4 hours",
      color: "from-blue-500 to-cyan-500",
      link: "https://alison.com/course/introduction-to-real-estate-investing",
    },
    {
      icon: DollarSign,
      title: "Financing Your Property",
      description: "Understanding mortgages, loans, and financing options",
      topics: ["Mortgage Types", "Bank Requirements", "Down Payments", "Interest Rates"],
      level: "Intermediate",
      duration: "1.5-3 hours",
      color: "from-emerald-500 to-teal-500",
      link: "https://alison.com/course/understanding-mortgages-and-home-equity-revised",
    },
    {
      icon: FileText,
      title: "Legal Framework & Documentation",
      description: "Navigate property laws and legal requirements in Ghana",
      topics: ["Land Title Registration", "Property Laws", "Contract Negotiation", "Due Diligence"],
      level: "Intermediate",
      duration: "1.5-3 hours",
      color: "from-amber-500 to-orange-500",
      link: "https://alison.com/course/basics-of-property-ownership-and-law",
    },
    {
      icon: Users,
      title: "Property Management",
      description: "Effective strategies for managing rental properties",
      topics: ["Tenant Screening", "Rent Collection", "Maintenance", "Legal Compliance"],
      level: "Advanced",
      duration: "1.5-3 hours",
      color: "from-purple-500 to-indigo-500",
      link: "https://alison.com/course/rental-property-management-fundamentals",
    },
  ];

  const relatedCourses = [
    {
      icon: Home,
      title: "First-Time Home Buyer's Guide",
      description: "Everything you need to know about buying your first property",
      level: "Beginner",
      duration: "2 hours",
      color: "from-pink-500 to-rose-500",
      link: "https://alison.com/course/home-buying-101",
    },
    {
      icon: Target,
      title: "Property Valuation Techniques",
      description: "Master the art of determining property values accurately",
      level: "Intermediate",
      duration: "2.5 hours",
      color: "from-cyan-500 to-blue-500",
      link: "https://alison.com/course/property-valuation",
    },
    {
      icon: BarChart,
      title: "Real Estate Market Analysis",
      description: "Analyze market trends and make informed investment decisions",
      level: "Advanced",
      duration: "3 hours",
      color: "from-violet-500 to-purple-500",
      link: "https://alison.com/course/real-estate-market-analysis",
    },
    {
      icon: Shield,
      title: "Property Insurance Essentials",
      description: "Protect your investment with the right insurance coverage",
      level: "Beginner",
      duration: "1.5 hours",
      color: "from-orange-500 to-red-500",
      link: "https://alison.com/course/property-insurance",
    },
    {
      icon: Lightbulb,
      title: "Smart Home Technology Integration",
      description: "Learn about modern smart home systems and automation",
      level: "Intermediate",
      duration: "2 hours",
      color: "from-yellow-500 to-amber-500",
      link: "https://alison.com/course/smart-home-technology",
    },
    {
      icon: Calculator,
      title: "Real Estate Financial Planning",
      description: "Plan your finances for successful property investments",
      level: "Intermediate",
      duration: "2.5 hours",
      color: "from-teal-500 to-emerald-500",
      link: "https://alison.com/course/financial-planning",
    },
  ];

  const marketInsights = [
    {
      title: "Accra Property Market Report 2025",
      value: "15.2%",
      description: "Average property value increase",
      trend: "up",
    },
    {
      title: "Smart Home Adoption Rate",
      value: "23%",
      description: "New properties with smart features",
      trend: "up",
    },
    {
      title: "Average ROI",
      value: "12.8%",
      description: "Annual return on investment",
      trend: "up",
    },
    {
      title: "Rental Yield",
      value: "8.5%",
      description: "Average rental yield in prime areas",
      trend: "stable",
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Estate Education Hub</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of real estate investment with our comprehensive educational resources
            and market insights
          </p>
        </div>

        {/* Market Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Market Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{insight.value}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                <p className="text-gray-600 text-sm">{insight.description}</p>
                <div
                  className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    insight.trend === "up"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {insight.trend === "up" ? "Rising" : "Stable"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Courses */}
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Educational Courses</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {educationalResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${resource.color}`} />
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{resource.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {resource.level}
                        </span>
                        <span>{resource.duration}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{resource.description}</p>

                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">What you'll learn:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {resource.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span className="text-sm text-gray-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center w-full bg-gradient-to-r ${resource.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-opacity`}
                  >
                    Start Learning
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Related Courses Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Related Courses</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expand your knowledge with these specialized courses designed to complement your real estate education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.map((course, index) => {
              const Icon = course.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${course.color}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <Award className="w-4 h-4" />
                    </div>

                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-center w-full bg-gradient-to-r ${course.color} hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm`}
                    >
                      Explore Course
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">Ready to Become a Real Estate Expert?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your learning journey today and gain the knowledge to make smart property investment decisions
          </p>
        </div>
      </div>
    </div>
  );
}
