import React, { useState, useEffect, Suspense } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import StatCard from "../features/dashboard/components/StatCard";
import ChartCard from "../features/dashboard/components/ChartCard";
const AdminApprovals = React.lazy(() => import("../features/dashboard/components/AdminApprovals"));
const AdminBlogForm = React.lazy(() => import("../features/dashboard/components/AdminBlogFormSimple"));
const AdminBlogManager = React.lazy(() => import("../features/dashboard/components/AdminBlogManager"));
import { Home, Users, FileText, Clock, Bell } from "lucide-react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const PropertyDistributionChart = React.lazy(() => import("../features/dashboard/components/charts/PropertyDistributionChart"));
const InquiriesLineChart = React.lazy(() => import("../features/dashboard/components/charts/InquiriesLineChart"));
const SalesBarChart = React.lazy(() => import("../features/dashboard/components/charts/SalesBarChart"));

export default function DashboardAdmin() {
  const [refresh, setRefresh] = useState(0);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalBlogPosts: 0,
    pendingApprovals: 0,
    pushReady: false,
  });

  const [testPushEndpoint, setTestPushEndpoint] = useState("");

  useEffect(() => {
    // Try to detect an existing push subscription for test button enabling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(async reg => {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          setTestPushEndpoint(sub.endpoint);
          setStats(s => ({ ...s, pushReady: true }));
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const [propertiesRes, blogPostsRes] = await Promise.all([
          axios.get("/api/properties/my").catch(() => ({ data: [] })), // Use /my endpoint for admin to see all properties
          axios.get("/api/blog-posts").catch(() => ({ data: [] })),
        ]);

        const properties = Array.isArray(propertiesRes.data) ? propertiesRes.data : [];
        const blogPosts = Array.isArray(blogPostsRes.data) ? blogPostsRes.data : [];

        const newPendingCount = properties.filter((p) => p.status === "pending").length;
        
        // Show notification if pending count increased
        if (stats.pendingApprovals > 0 && newPendingCount > stats.pendingApprovals) {
          toast.success(`New property posted! ${newPendingCount} properties awaiting approval.`, {
            duration: 5000,
            icon: '🏠',
          });
        }

        setStats({
          totalProperties: properties.length,
          totalUsers: 0, // Would need a users endpoint
          totalBlogPosts: blogPosts.length,
          pendingApprovals: newPendingCount,
          pushReady: stats.pushReady,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, [refresh]);

  // Mock data for charts (similar to Light Bootstrap Dashboard)
  const propertyTypeData = [
    { name: "Residential", value: 53, color: "#3b82f6" },
    { name: "Commercial", value: 36, color: "#10b981" },
    { name: "Land", value: 11, color: "#f59e0b" },
  ];

  const monthlyInquiriesData = [
    { month: "Jan", inquiries: 40 },
    { month: "Feb", inquiries: 45 },
    { month: "Mar", inquiries: 60 },
    { month: "Apr", inquiries: 55 },
    { month: "May", inquiries: 70 },
    { month: "Jun", inquiries: 80 },
  ];

  const salesData = [
    { month: "Jan", sales: 12 },
    { month: "Feb", sales: 15 },
    { month: "Mar", sales: 18 },
    { month: "Apr", sales: 22 },
    { month: "May", sales: 25 },
    { month: "Jun", sales: 30 },
  ];

  // Image diagnostics state
  const [imageDiagnostics, setImageDiagnostics] = useState({ loading: true, items: [], checked: 0 });

  useEffect(() => {
    const runDiagnostics = async () => {
      setImageDiagnostics(s => ({ ...s, loading: true }));
      try {
        // Fetch a limited set of properties for diagnostic (approved + pending)
        const res = await axios.get('/api/properties/my').catch(() => ({ data: [] }));
        const props = Array.isArray(res.data) ? res.data.slice(0, 12) : [];
        // Prepare items with preliminary URLs
        const origin = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//archsmartadm.indiginfoundation.com` : '');
        const normalize = (val) => {
          if (!val) return null;
          if (/^https?:\/\//i.test(val)) return val;
          if (val.startsWith('/storage/')) return `${origin}${val}`;
          if (!val.startsWith('/')) return `${origin}/storage/${val}`;
          return val;
        };
        const expanded = props.map(p => {
          const list = Array.isArray(p.image_urls) && p.image_urls.length ? p.image_urls : (Array.isArray(p.images) ? p.images : []);
          const urls = list.map(normalize).filter(Boolean);
          return { id: p.id, title: p.title, status: p.status, urls, results: [] };
        });
        setImageDiagnostics({ loading: false, items: expanded, checked: 0 });
        // Sequentially test each image to avoid flooding server
        let checkedCount = 0;
        for (const item of expanded) {
          const results = [];
          for (const url of item.urls) {
            const outcome = await new Promise(resolve => {
              const img = new Image();
              const timer = setTimeout(() => { resolve({ url, ok: false, reason: 'timeout' }); }, 8000);
              img.onload = () => { clearTimeout(timer); resolve({ url, ok: true }); };
              img.onerror = () => { clearTimeout(timer); resolve({ url, ok: false, reason: 'error' }); };
              img.src = url;
            });
            results.push(outcome);
          }
          item.results = results;
          checkedCount += item.urls.length;
          setImageDiagnostics(s => ({ ...s, checked: checkedCount, items: [...expanded] }));
        }
      } catch (e) {
        setImageDiagnostics({ loading: false, items: [], checked: 0 });
      }
    };
    runDiagnostics();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={Home}
            color="blue"
            footer="All listed properties"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers || "—"}
            icon={Users}
            color="green"
            footer="Registered users"
          />
          <StatCard
            title="Blog Posts"
            value={stats.totalBlogPosts}
            icon={FileText}
            color="purple"
            footer="Published articles"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={Clock}
            color="orange"
            footer="Awaiting review"
          />
          <StatCard
            title="Push Status"
            value={stats.pushReady ? 'Active' : 'Inactive'}
            icon={Bell}
            color={stats.pushReady ? 'green' : 'gray'}
            footer={stats.pushReady ? 'Ready for test' : 'No subscription'}
          />
        </div>

        {/* Charts Section - Light Bootstrap Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Types Pie Chart */}
          <ChartCard
            title="Property Distribution"
            subtitle="By property type"
            footer="Updated now"
          >
            <Suspense fallback={<div className="w-full" style={{height:250}}><div className="h-full w-full bg-gray-100 rounded" /></div>}>
              <PropertyDistributionChart data={propertyTypeData} />
            </Suspense>
          </ChartCard>

          {/* Monthly Inquiries Line Chart */}
          <ChartCard
            title="User Behavior"
            subtitle="Monthly inquiries trend"
            footer="Last 6 months"
          >
            <Suspense fallback={<div className="w-full" style={{height:250}}><div className="h-full w-full bg-gray-100 rounded" /></div>}>
              <InquiriesLineChart data={monthlyInquiriesData} />
            </Suspense>
          </ChartCard>

          {/* Sales Bar Chart */}
          <ChartCard title="2024 Sales" subtitle="Properties sold per month" footer="Year to date">
            <Suspense fallback={<div className="w-full" style={{height:250}}><div className="h-full w-full bg-gray-100 rounded" /></div>}>
              <SalesBarChart data={salesData} />
            </Suspense>
          </ChartCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Properties */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Pending Properties</h2>
              <p className="text-sm text-gray-500">Review and approve property listings</p>
            </div>
            <div className="p-6">
              <Suspense fallback={<div className="h-48 w-full bg-gray-100 rounded" /> }>
                <AdminApprovals />
              </Suspense>
            </div>
          </div>

          {/* Create Blog Post */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Create Blog Post</h2>
              <p className="text-sm text-gray-500">Publish new content</p>
            </div>
            <div className="p-6">
              <Suspense fallback={<div className="h-56 w-full bg-gray-100 rounded" /> }>
                <AdminBlogForm onCreated={() => setRefresh((r) => r + 1)} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Blog Manager */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Manage Blog Posts</h2>
            <p className="text-sm text-gray-500">Edit or delete existing posts</p>
          </div>
          <div className="p-6">
            <Suspense fallback={<div className="h-64 w-full bg-gray-100 rounded" /> }>
              <AdminBlogManager />
            </Suspense>
            <div className="mt-8 border-t pt-6">
              <h3 className="text-md font-semibold mb-2 flex items-center gap-2"><Bell className="h-4 w-4" /> Push Notifications</h3>
              <p className="text-sm text-gray-600 mb-4">Use the button below to send a test notification to your current browser subscription.</p>
              <button
                disabled={!testPushEndpoint}
                onClick={async () => {
                  try {
                    await axios.post('/api/push/test', { endpoint: testPushEndpoint });
                    alert('Test push sent (check notification area).');
                  } catch (e) {
                    alert('Failed to send test push.');
                  }
                }}
                className={`px-4 py-2 rounded text-white text-sm font-medium ${testPushEndpoint ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Send Test Push
              </button>
            </div>
          </div>
        </div>

        {/* Image Diagnostics */}
        <div className="bg-white rounded-lg shadow-md mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Image Diagnostics</h2>
            <p className="text-sm text-gray-500">Checks stored property image URLs for load success vs failure.</p>
          </div>
          <div className="p-6 space-y-4">
            {imageDiagnostics.loading && (
              <div className="text-sm text-gray-500">Running diagnostics…</div>
            )}
            {!imageDiagnostics.loading && imageDiagnostics.items.length === 0 && (
              <div className="text-sm text-gray-500">No properties available for diagnostics.</div>
            )}
            {!imageDiagnostics.loading && imageDiagnostics.items.length > 0 && (
              <>
                <div className="text-xs text-gray-600 mb-2">Checked images: {imageDiagnostics.checked}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imageDiagnostics.items.map(item => {
                    const total = item.urls.length;
                    const okCount = item.results.filter(r => r.ok).length;
                    const failed = total - okCount;
                    return (
                      <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-800 truncate" title={item.title}>{item.title || 'Untitled'}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${failed === 0 ? 'bg-green-100 text-green-700' : failed === total ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{okCount}/{total}</span>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto pr-1 text-[11px] leading-tight">
                          {item.results.map(r => (
                            <div key={r.url} className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${r.ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="truncate" title={r.url}>{r.url.replace(/^https?:\/\//,'')}</span>
                            </div>
                          ))}
                          {item.results.length === 0 && item.urls.map(u => (
                            <div key={u} className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                              <span className="truncate" title={u}>{u.replace(/^https?:\/\//,'')}</span>
                            </div>
                          ))}
                        </div>
                        {failed > 0 && (
                          <div className="mt-2 text-xs text-red-600">{failed} image{failed!==1?'s':''} failed to load.</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
