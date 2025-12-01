import React, { useState, useEffect, Suspense, useCallback } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import StatCard from "../features/dashboard/components/StatCard";
import ChartCard from "../features/dashboard/components/ChartCard";
const AdminApprovals = React.lazy(() => import("../features/dashboard/components/AdminApprovals"));
const AdminBlogForm = React.lazy(() => import("../features/dashboard/components/AdminBlogFormSimple"));
const AdminBlogManager = React.lazy(() => import("../features/dashboard/components/AdminBlogManager"));
const AdvertRequestsAdmin = React.lazy(() => import("../features/advert/admin/AdvertRequestsAdmin"));
import { Home, Users, FileText, Clock, Bell, TrendingUp, Activity, Zap, RefreshCw, BarChart3 } from "lucide-react";
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
  const [consultData, setConsultData] = useState({
    total: 0,
    items: [],
    loading: true,
  });

  const formatDate = (value, includeTime = false) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
    return includeTime ? parsed.toLocaleString() : parsed.toLocaleDateString();
  };

  const fetchConsultations = useCallback(async () => {
    setConsultData((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axios.get("/api/consultations?limit=8");
      const items = Array.isArray(response?.data?.data) ? response.data.data : [];
      const total = typeof response?.data?.total === "number" ? response.data.total : items.length;
      setConsultData({ total, items, loading: false });
    } catch (error) {
      console.error("Failed to load consultations:", error);
      setConsultData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

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
    fetchConsultations();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchConsultations();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refresh, fetchConsultations]);

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
  const [imageDiagnostics, setImageDiagnostics] = useState({ loading: false, items: [], checked: 0 });
  const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);

  // Run diagnostics on demand (user action) to avoid long blocking loads on page render
  const runDiagnostics = async () => {
    setImageDiagnostics(s => ({ ...s, loading: true, items: [], checked: 0 }));
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

      // Now test images, but do not block page load — update results as they complete.
      let checkedCount = 0;
      const timeoutMs = 2000; // lower per-image timeout to keep UI responsive
      const checkImage = (url) => new Promise(resolve => {
        const img = new Image();
        let done = false;
        const timer = setTimeout(() => { if (!done) { done = true; resolve({ url, ok: false, reason: 'timeout' }); } }, timeoutMs);
        img.onload = () => { if (!done) { done = true; clearTimeout(timer); resolve({ url, ok: true }); } };
        img.onerror = () => { if (!done) { done = true; clearTimeout(timer); resolve({ url, ok: false, reason: 'error' }); } };
        img.src = url;
      });

      // Kick off checks for each item concurrently but update state per-item when done.
      await Promise.all(expanded.map(async (item) => {
        const results = await Promise.all(item.urls.map((u) => checkImage(u)));
        item.results = results;
        checkedCount += item.urls.length;
        setImageDiagnostics(s => ({ ...s, checked: checkedCount, items: [...expanded] }));
      }));

      // done
      setImageDiagnostics(s => ({ ...s, loading: false }));
    } catch (e) {
      setImageDiagnostics({ loading: false, items: [], checked: 0 });
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Professional Page Header */}
          <div className="relative z-10 mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-slate-600 to-blue-700 p-8 text-white shadow-2xl border border-blue-500/20">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Platform Analytics
                  </h1>
                  <p className="text-blue-100 text-lg font-medium leading-relaxed">
                    Comprehensive insights into your real estate platform performance and growth metrics.
                  </p>
                  <div className="mt-4 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-200">Live Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-200">Real-time Updates</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3 border border-white/20">
                    <Activity className="h-5 w-5 text-green-300" />
                    <span className="text-sm font-medium">All Systems Operational</span>
                  </div>
                  <button
                    onClick={() => setRefresh(r => r + 1)}
                    className="bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-105 border border-white/20"
                    title="Refresh Data"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
          </div>

          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Home className="h-8 w-8 text-blue-200" />
                  <TrendingUp className="h-5 w-5 text-blue-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-blue-100 text-sm font-medium">Total Properties</p>
                  <p className="text-3xl font-bold">{stats.totalProperties}</p>
                  <p className="text-blue-200 text-xs">All listed properties</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors duration-300"></div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-slate-200" />
                  <Activity className="h-5 w-5 text-slate-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers || "—"}</p>
                  <p className="text-slate-200 text-xs">Registered users</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors duration-300"></div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-blue-200" />
                  <BarChart3 className="h-5 w-5 text-blue-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-blue-100 text-sm font-medium">Blog Posts</p>
                  <p className="text-3xl font-bold">{stats.totalBlogPosts}</p>
                  <p className="text-blue-200 text-xs">Published articles</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors duration-300"></div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 text-amber-200" />
                  <div className="relative">
                    <Zap className="h-5 w-5 text-amber-300" />
                    {stats.pendingApprovals > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-amber-100 text-sm font-medium">Pending Approvals</p>
                  <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                  <p className="text-amber-200 text-xs">Awaiting review</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors duration-300"></div>
            </div>
          </div>

          {/* Modern Consulting Panel */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Consulting Requests</h2>
                  <p className="text-blue-100">Track recent consultation requests from customers</p>
                </div>
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-medium">{consultData.total} total requests</span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchConsultations}
                    disabled={consultData.loading}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${consultData.loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[{
                  label: "Total requests",
                  value: consultData.total,
                  icon: Users,
                  color: "from-blue-600 to-blue-700"
                }, {
                  label: "Recent records",
                  value: consultData.items.length,
                  icon: Activity,
                  color: "from-slate-600 to-slate-700"
                }, {
                  label: "Latest received",
                  value: consultData.items[0] ? formatDate(consultData.items[0].created_at) : "—",
                  icon: Clock,
                  color: "from-blue-600 to-blue-700"
                }].map((stat, index) => (
                  <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-6 w-6 text-white/80" />
                      <TrendingUp className="h-4 w-4 text-white/60" />
                    </div>
                    <p className="text-xs uppercase tracking-wide text-white/80 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Consultation Items */}
              {consultData.loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-gray-600">Loading consultation requests...</span>
                </div>
              ) : consultData.items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No consultation requests available</p>
                  <p className="text-gray-400 text-sm mt-1">New requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultData.items.map((item, index) => (
                    <div key={item.id} className="group relative bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {(item.name || "A")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-800">{item.name || "Anonymous"}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" />
                                    {item.email}
                                  </span>
                                  {item.phone && (
                                    <span className="flex items-center gap-1">
                                      <Bell className="h-4 w-4" />
                                      {item.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {item.message && (
                              <div className="bg-gray-50 rounded-lg p-4 mt-3 border-l-4 border-indigo-500">
                                <p className="text-gray-700 leading-relaxed">{item.message}</p>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                              <Clock className="h-3 w-3" />
                              {formatDate(item.created_at, true)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modern Charts Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics & Insights</h2>
              <p className="text-gray-600">Visualize your platform's performance and trends</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Property Types Pie Chart */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <h3 className="text-lg font-semibold">Property Distribution</h3>
                  <p className="text-blue-100 text-sm">By property type</p>
                </div>
                <div className="p-6">
                  <Suspense fallback={
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  }>
                    <PropertyDistributionChart data={propertyTypeData} />
                  </Suspense>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Updated now</span>
                  </div>
                </div>
              </div>

              {/* Monthly Inquiries Line Chart */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4 text-white">
                  <h3 className="text-lg font-semibold">User Behavior</h3>
                  <p className="text-slate-100 text-sm">Monthly inquiries trend</p>
                </div>
                <div className="p-6">
                  <Suspense fallback={
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                    </div>
                  }>
                    <InquiriesLineChart data={monthlyInquiriesData} />
                  </Suspense>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 6 months</span>
                  </div>
                </div>
              </div>

              {/* Sales Bar Chart */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <h3 className="text-lg font-semibold">2024 Sales</h3>
                  <p className="text-blue-100 text-sm">Properties sold per month</p>
                </div>
                <div className="p-6">
                  <Suspense fallback={
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  }>
                    <SalesBarChart data={salesData} />
                  </Suspense>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Year to date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Properties */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Pending Properties</h2>
                    <p className="text-amber-100 text-sm">Review and approve property listings</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  </div>
                }>
                  <AdminApprovals />
                </Suspense>
              </div>
            </div>

            {/* Advert Requests */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Advert Requests</h2>
                    <p className="text-blue-100 text-sm">Review business advert applications</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }>
                  <AdvertRequestsAdmin />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Modern Blog Management Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Blog Post */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Create Blog Post</h2>
                    <p className="text-slate-100 text-sm">Publish new content</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                  </div>
                }>
                  <AdminBlogForm onCreated={() => setRefresh((r) => r + 1)} />
                </Suspense>
              </div>
            </div>

            {/* Blog Manager */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Manage Blog Posts</h2>
                    <p className="text-blue-100 text-sm">Edit or delete existing posts</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }>
                  <AdminBlogManager />
                </Suspense>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Push Notifications
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Use the button below to send a test notification to your current browser subscription.
                  </p>
                  <button
                    disabled={!testPushEndpoint}
                    onClick={async () => {
                      try {
                        await axios.post('/api/push/test', { endpoint: testPushEndpoint });
                        toast.success('Test push sent! Check your notifications.', {
                          icon: '🔔',
                          duration: 4000,
                        });
                      } catch (e) {
                        toast.error('Failed to send test push notification');
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      testPushEndpoint
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="h-5 w-5" />
                    {testPushEndpoint ? 'Send Test Push' : 'No Subscription Available'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Diagnostics */}
        <div className="bg-gradient-to-br from-white via-slate-50/30 to-blue-50/30 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm mt-8 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/30 bg-gradient-to-r from-blue-600/10 via-slate-600/10 to-blue-600/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-slate-600 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  Image Diagnostics
                </h2>
                <p className="text-sm text-gray-600 mt-1">Checks stored property image URLs for load success vs failure.</p>
              </div>
              <div>
                <button
                  onClick={async () => { setDiagnosticsEnabled(true); await runDiagnostics(); }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-slate-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Run Diagnostics
                </button>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-6">
            {imageDiagnostics.loading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Running diagnostics…</span>
                </div>
              </div>
            )}
            {!imageDiagnostics.loading && imageDiagnostics.items.length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No properties available for diagnostics.</p>
              </div>
            )}
            {!imageDiagnostics.loading && imageDiagnostics.items.length > 0 && (
              <>
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Checked images:</span>
                    <span className="text-sm font-bold text-blue-600">{imageDiagnostics.checked}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imageDiagnostics.items.map(item => {
                    const total = item.urls.length;
                    const okCount = item.results.filter(r => r.ok).length;
                    const failed = total - okCount;
                    return (
                      <div key={item.id} className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-gray-800 truncate flex-1" title={item.title}>
                            {item.title || 'Untitled'}
                          </h3>
                          <span className={`text-xs px-3 py-1.5 rounded-full font-medium shadow-sm ${
                            failed === 0 
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                              : failed === total 
                                ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200' 
                                : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200'
                          }`}>
                            {okCount}/{total}
                          </span>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 text-xs leading-relaxed">
                          {item.results.map(r => (
                            <div key={r.url} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                              <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${r.ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="truncate text-gray-700" title={r.url}>
                                {r.url.replace(/^https?:\/\//,'')}
                              </span>
                            </div>
                          ))}
                          {item.results.length === 0 && item.urls.map(u => (
                            <div key={u} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-white/50">
                              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse shadow-sm" />
                              <span className="truncate text-gray-700" title={u}>
                                {u.replace(/^https?:\/\//,'')}
                              </span>
                            </div>
                          ))}
                        </div>
                        {failed > 0 && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs font-medium text-red-700">
                                {failed} image{failed!==1?'s':''} failed to load.
                              </span>
                            </div>
                          </div>
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
