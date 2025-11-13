import React, { useState, useEffect, Suspense } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import TableCard from "../features/dashboard/components/TableCard";
import ChartCard from "../features/dashboard/components/ChartCard";
import StatCard from "../features/dashboard/components/StatCard";
import { FileText, Eye, TrendingUp, Edit } from "lucide-react";
import axios from "../api/axios";
const InquiriesLineChart = React.lazy(() => import("../features/dashboard/components/charts/InquiriesLineChart"));

export default function DashboardBlog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/blog-posts");
        setBlogPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const rows = blogPosts.slice(0, 10).map((post) => ({
    id: post.id,
    cells: [
      post.title || "Untitled",
      post.user?.name || "Unknown",
      new Date(post.created_at).toLocaleDateString(),
      "—", // Views placeholder
    ],
  }));

  // Mock data for chart
  const viewsData = [
    { month: "Jan", views: 400 },
    { month: "Feb", views: 300 },
    { month: "Mar", views: 600 },
    { month: "Apr", views: 800 },
    { month: "May", views: 700 },
    { month: "Jun", views: 900 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your content library</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Posts"
            value={blogPosts.length}
            icon={FileText}
            color="blue"
            footer="Published articles"
          />
          <StatCard
            title="Total Views"
            value="—"
            icon={Eye}
            color="green"
            footer="All time views"
          />
          <StatCard
            title="Avg. Views"
            value="—"
            icon={TrendingUp}
            color="purple"
            footer="Per post"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Blog Performance"
            subtitle="Monthly views trend"
            footer="Updated regularly"
          >
            <Suspense fallback={<div className="w-full" style={{height:300}}><div className="h-full w-full bg-gray-100 rounded" /></div>}>
              <InquiriesLineChart data={viewsData} height={300} metricKey="views" />
            </Suspense>
          </ChartCard>

          <TableCard
            title="Recent Posts"
            subtitle={`${blogPosts.length} total posts`}
            headers={["Title", "Author", "Date", "Views"]}
            rows={rows}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
