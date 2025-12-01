import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
	LayoutDashboard,
	User,
	FileText,
	Home,
	Users,
	Settings,
	LogOut,
	Bell,
	Search,
	Menu,
	X,
	ChevronDown,
	MessageSquare,
	Phone,
} from "lucide-react";
import { getNotifications, getUnreadCount, markAllRead, markRead } from "../../../api/notificationApi";
import { resolveUploadedUrl, assetUrl } from "../../../api/config";

export default function DashboardLayout({ children }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [showAccountMenu, setShowAccountMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [unread, setUnread] = useState(0);
	
	const accountMenuRef = useRef(null);
	const notificationsRef = useRef(null);
	
	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
				setShowAccountMenu(false);
			}
			if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
				setShowNotifications(false);
			}
		}
		
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		let active = true;
		async function loadNotifications() {
			if (!user) return;
			try {
				const [list, count] = await Promise.all([
					getNotifications(10),
					getUnreadCount(),
				]);
				if (!active) return;
				setNotifications(Array.isArray(list) ? list : []);
				setUnread(count || 0);
			} catch {}
		}
		loadNotifications();
		// refresh occasionally while on dashboard
		const t = setInterval(loadNotifications, 60000);
		return () => { active = false; clearInterval(t); };
	}, [user]);

	const openNotifications = async () => {
		setShowNotifications((s) => !s);
		if (!showNotifications && unread > 0) {
			try { await markAllRead(); setUnread(0); } catch {}
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	const adminLinks = [
		{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ to: "/dashboard/profile", label: "User Profile", icon: User },
		{ to: "/dashboard/properties", label: "Properties", icon: Home },
		{ to: "/dashboard/blog", label: "Blog Posts", icon: FileText },
		{ to: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
		{ to: "/dashboard/consultations", label: "Consultations", icon: Phone },
		{ to: "/dashboard/users", label: "Users", icon: Users },
		{ to: "/dashboard/settings", label: "Settings", icon: Settings },
	];

	const agentLinks = [
		{ to: "/agent/dashboard", label: "My Properties", icon: Home },
		{ to: "/agent/profile", label: "Profile", icon: User },
	];

	const userLinks = [
		{ to: "/user/dashboard", label: "Overview", icon: LayoutDashboard },
		{ to: "/user/profile", label: "Profile", icon: User },
	];

	const links =
		user?.role === "admin"
			? adminLinks
			: user?.role === "agent"
			? agentLinks
			: userLinks;

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
			{/* Sidebar */}
			<aside
				className={`${
					sidebarOpen ? "w-72" : "w-0"
				} bg-gradient-to-b from-white via-blue-50/50 to-slate-50/50 transition-all duration-300 overflow-hidden flex flex-col shadow-2xl border-r border-blue-100/50 backdrop-blur-sm`}
			>
				{/* Logo Section */}
				<div className="p-8 border-b border-blue-100/50 bg-gradient-to-r from-blue-600/5 to-slate-600/5">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
							<Home className="w-7 h-7 text-white" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-800 tracking-tight">ArchSmart</h2>
							<p className="text-sm text-blue-600 font-medium">Admin Dashboard</p>
						</div>
					</div>
					<div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg border border-blue-100/50">
						<p className="text-xs text-gray-600 leading-relaxed">
							Professional property management platform for modern real estate businesses.
						</p>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-6 space-y-2 overflow-y-auto">
					<div className="mb-6">
						<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Platform Management</h3>
					</div>
					{links.map((link) => {
						const Icon = link.icon;
						return (
							<NavLink
								key={link.to}
								to={link.to}
								end
								className={({ isActive }) =>
									`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
										isActive
											? "bg-gradient-to-r from-blue-600 to-slate-600 text-white shadow-lg transform scale-105"
											: "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-102"
									}`
								}
							>
								<div className={`p-2 rounded-lg transition-all duration-200 ${
									location.pathname === link.to
										? "bg-white/20"
										: "bg-gray-100 group-hover:bg-blue-100"
								}`}>
									<Icon className={`w-5 h-5 transition-colors duration-200 ${
										location.pathname === link.to
											? "text-white"
											: "text-gray-600 group-hover:text-blue-600"
									}`} />
								</div>
								<span className="font-medium">{link.label}</span>
							</NavLink>
						);
					})}
				</nav>

				{/* User Section */}
				<div className="p-6 border-t border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-slate-50/50">
					<div className="flex items-center gap-4 px-4 py-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
						{user?.profile_picture_url ? (
									<img 
										src={resolveUploadedUrl(user.profile_picture_url) || assetUrl('/profile_pictures/placeholder.jpg')} 
										alt={user.name} 
										className="w-12 h-12 rounded-xl object-cover border-2 border-blue-200 shadow-sm"
									/>
								) : (
							<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
								<User className="w-6 h-6 text-white" />
							</div>
						)}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-gray-800 truncate">
								{user?.name || "Guest"}
							</p>
							<p className="text-xs text-blue-600 font-medium capitalize bg-blue-100/50 px-2 py-1 rounded-full w-fit mt-1">
								{user?.role}
							</p>
						</div>
					</div>
					<div className="mt-4">
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
						>
							<div className="p-1.5 bg-red-100 rounded-lg">
								<LogOut className="w-4 h-4" />
							</div>
							<span>Sign Out</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navbar */}
				<header className="relative z-50 bg-gradient-to-r from-white via-blue-50/30 to-slate-50/30 backdrop-blur-sm shadow-lg border-b border-blue-100/50">
					<div className="px-8 py-5 flex items-center justify-between min-h-[72px]">
						<div className="flex items-center gap-6 flex-1 min-w-0">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="p-3 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-md flex-shrink-0"
							>
								{sidebarOpen ? (
									<X className="w-5 h-5 text-gray-700" />
								) : (
									<Menu className="w-5 h-5 text-gray-700" />
								)}
							</button>
							<div className="hidden md:block min-w-0 flex-1">
								<h1 className="text-xl font-bold text-gray-800 truncate">Dashboard Overview</h1>
								<p className="text-sm text-gray-600 truncate">Monitor your platform performance</p>
							</div>
						</div>

						<div className="flex items-center gap-4 flex-shrink-0">
							{/* Status Indicator */}
							<div className="hidden lg:flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium text-green-700">All Systems Operational</span>
							</div>

							<div className="relative" ref={notificationsRef}>
								<button
									onClick={openNotifications}
									className="relative p-3 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-md z-10"
								>
									<Bell className="w-5 h-5 text-gray-700" />
									{unread > 0 && (
										<span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 text-[10px] leading-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-center font-bold shadow-lg z-20">
											{unread > 9 ? '9+' : unread}
										</span>
									)}
								</button>
								
								{/* Notifications Dropdown */}
								{showNotifications && (
									<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
										<div className="p-4 border-b border-gray-200">
											<h3 className="font-semibold text-gray-800">Notifications</h3>
										</div>
										<div className="max-h-96 overflow-y-auto">
											{notifications.length === 0 ? (
												<div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
											) : (
												<ul className="divide-y divide-gray-100">
													{notifications.map((n) => (
														<li key={n.id} className="p-4 hover:bg-gray-50">
															<div className="flex items-start gap-3">
																<div className={`mt-1 h-2 w-2 rounded-full ${n.read_at ? 'bg-gray-300' : 'bg-blue-500'}`} />
																<div className="flex-1">
																	<p className="text-sm font-medium text-gray-900">{n.title}</p>
																	{n.body && <p className="text-xs text-gray-600 mt-0.5">{n.body}</p>}
																	<p className="text-[10px] text-gray-400 mt-1">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p>
																</div>
															</div>
														</li>
													))}
												</ul>
											)}
										</div>
									</div>
								)}
							</div>
							
							<div className="relative" ref={accountMenuRef}>
								<button 
									onClick={() => setShowAccountMenu(!showAccountMenu)}
									className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
								>
									{user?.profile_picture_url ? (
											<img 
												src={resolveUploadedUrl(user.profile_picture_url) || assetUrl('/profile_pictures/placeholder.jpg')} 
												alt={user.name} 
												className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
											/>
									) : (
										<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
											<User className="w-4 h-4 text-white" />
										</div>
									)}
									<span className="text-sm font-medium text-gray-700 hidden sm:block">
										{user?.name || "Account"}
									</span>
									<ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
								</button>
								
								{/* Account Dropdown */}
								{showAccountMenu && (
									<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
										<div className="p-3 border-b border-gray-200 flex items-center gap-3">
											{user?.profile_picture_url ? (
												<img 
													src={resolveUploadedUrl(user.profile_picture_url) || assetUrl('/profile_pictures/placeholder.jpg')} 
													alt={user.name} 
													className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
												/>
											) : (
												<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
													<User className="w-5 h-5 text-white" />
												</div>
											)}
											<div>
												<p className="font-semibold text-gray-800">{user?.name}</p>
												<p className="text-xs text-gray-500 capitalize">{user?.role}</p>
											</div>
										</div>
										<div className="p-2">
											<button
												onClick={() => {
													setShowAccountMenu(false);
													navigate(user?.role === 'admin' ? '/dashboard/profile' : `/${user?.role}/profile`);
												}}
												className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 flex items-center gap-2"
											>
												<User className="w-4 h-4" />
												Profile
											</button>
											<button
												onClick={() => {
													setShowAccountMenu(false);
													navigate(user?.role === 'admin' ? '/dashboard/settings' : `/${user?.role}/settings`);
												}}
												className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 flex items-center gap-2"
											>
												<Settings className="w-4 h-4" />
												Settings
											</button>
										</div>
										<div className="p-2 border-t border-gray-200">
											<button
												onClick={() => {
													setShowAccountMenu(false);
													handleLogout();
												}}
												className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 flex items-center gap-2"
											>
												<LogOut className="w-4 h-4" />
												Logout
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="flex-1 p-6 overflow-y-auto">
					<div className="max-w-7xl mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
}
