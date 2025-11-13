import React, { useState, useEffect, Suspense } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import TableCard from "../features/dashboard/components/TableCard";
import ChartCard from "../features/dashboard/components/ChartCard";
import StatCard from "../features/dashboard/components/StatCard";
import { Users as UsersIcon, UserCheck, UserX, TrendingUp } from "lucide-react";
const PropertyDistributionChart = React.lazy(() => import("../features/dashboard/components/charts/PropertyDistributionChart"));

export default function DashboardUsers() {
  const [users] = useState([
    { id: 1, name: "Admin User", email: "admin@gmail.com", role: "admin", status: "active" },
    { id: 2, name: "Agent Smith", email: "agent@example.com", role: "agent", status: "active" },
    { id: 3, name: "John Doe", email: "john@example.com", role: "user", status: "active" },
  ]);

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      agent: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || ""}`}>
        {role}
      </span>
    );
  };

  const rows = users.map((user) => ({
    id: user.id,
    cells: [user.name, user.email, getRoleBadge(user.role), user.status],
  }));

  const roleData = [
    { name: "Admins", value: users.filter((u) => u.role === "admin").length, color: "#8b5cf6" },
    { name: "Agents", value: users.filter((u) => u.role === "agent").length, color: "#3b82f6" },
    { name: "Users", value: users.filter((u) => u.role === "user").length, color: "#6b7280" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-sm text-gray-600 mt-1">Manage user accounts and roles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={users.length}
            icon={UsersIcon}
            color="blue"
            footer="All registered accounts"
          />
          <StatCard
            title="Active Users"
            value={users.filter((u) => u.status === "active").length}
            icon={UserCheck}
            color="green"
            footer="Currently active"
          />
          <StatCard
            title="Growth Rate"
            value="+12%"
            icon={TrendingUp}
            color="purple"
            footer="Last 30 days"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Users by Role" subtitle="Distribution of user types">
            <Suspense fallback={<div className="w-full" style={{height:300}}><div className="h-full w-full bg-gray-100 rounded" /></div>}>
              <PropertyDistributionChart data={roleData} height={300} showLegend />
            </Suspense>
          </ChartCard>

          <TableCard
            title="Recent Users"
            subtitle={`${users.length} total users`}
            headers={["Name", "Email", "Role", "Status"]}
            rows={rows}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
