import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
		<div className="min-h-screen flex bg-gray-100">
			{/* Sidebar */}
			<aside
				className={`${
					sidebarOpen ? "w-64" : "w-0"
				} bg-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg`}
			>
				{/* Logo Section */}
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
							<Home className="w-6 h-6 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-800">ArchSmart</h2>
							<p className="text-xs text-gray-500">Admin Panel</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
					{links.map((link) => {
						const Icon = link.icon;
						return (
							<NavLink
								key={link.to}
								to={link.to}
								end
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
										isActive
											? "bg-blue-50 text-blue-600 font-medium shadow-sm"
											: "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
									}`
								}
							>
								<Icon className="w-5 h-5" />
								<span>{link.label}</span>
							</NavLink>
						);
					})}
				</nav>

				{/* User Section */}
				<div className="p-4 border-t border-gray-200">
					<div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
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
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-800 truncate">
								{user?.name || "Guest"}
							</p>
							<p className="text-xs text-gray-500 capitalize">{user?.role}</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
					>
						<LogOut className="w-5 h-5" />
						<span>Logout</span>
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navbar */}
				<header className="bg-white shadow-sm border-b border-gray-200">
					<div className="px-6 py-4 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								{sidebarOpen ? (
									<X className="w-5 h-5 text-gray-600" />
								) : (
									<Menu className="w-5 h-5 text-gray-600" />
								)}
							</button>
							<div className="relative hidden md:block">
								<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="text"
									placeholder="Search..."
									className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
								/>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="relative" ref={notificationsRef}>
								<button 
									onClick={openNotifications}
									className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<Bell className="w-5 h-5 text-gray-600" />
									{unread > 0 && (
										<span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 text-[10px] leading-5 bg-red-500 text-white rounded-full text-center">
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
													src={(function(){
														return resolveUploadedUrl(user.profile_picture_url) || assetUrl('/profile_pictures/placeholder.jpg');
													})()} 
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
