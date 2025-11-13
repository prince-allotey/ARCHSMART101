import React from "react";

export default function StatCard({ title, value, icon: Icon, trend, footer, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 ${trend.positive ? "text-green-600" : "text-red-600"}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600">{footer}</p>
        </div>
      )}
    </div>
  );
}
