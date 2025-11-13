import React, { useState } from "react";
import { Camera, Shield, Bell, Lock, Unlock, AlertTriangle, Power, Wifi, Eye, Smartphone, Clock, CheckCircle, Video, MapPin, Zap } from "lucide-react";

export default function SecuritySystems() {
	const [systems, setSystems] = useState([
		{ id: 1, name: "Front Door Lock", icon: <Lock className="w-8 h-8 text-emerald-500" />, status: true },
		{ id: 2, name: "Garage Door Lock", icon: <Lock className="w-8 h-8 text-emerald-500" />, status: true },
		{ id: 3, name: "Outdoor Camera", icon: <Camera className="w-8 h-8 text-blue-500" />, status: true },
		{ id: 4, name: "Indoor Motion Sensor", icon: <Shield className="w-8 h-8 text-yellow-500" />, status: false },
		{ id: 5, name: "Alarm System", icon: <Bell className="w-8 h-8 text-red-500" />, status: false },
	]);

	const toggleSystem = (id) => {
		setSystems((prev) =>
			prev.map((sys) => (sys.id === id ? { ...sys, status: !sys.status } : sys))
		);
	};

	const activeSystems = systems.filter((s) => s.status).length;
	const totalSystems = systems.length;

	const threatLevel =
		activeSystems === totalSystems
			? "Low"
			: activeSystems >= totalSystems / 2
			? "Moderate"
			: "High";

	const threatColor =
		threatLevel === "Low"
			? "text-green-500"
			: threatLevel === "Moderate"
			? "text-yellow-500"
			: "text-red-600";

	const features = [
		{
			title: "HD Live Streaming",
			desc: "Crystal-clear 4K video feeds accessible from your phone anywhere in the world. Night vision included.",
			icon: <Video className="w-10 h-10 text-blue-500" />,
		},
		{
			title: "Instant Alerts & AI Detection",
			desc: "Smart AI distinguishes between people, pets, and vehicles. Get real-time notifications within seconds.",
			icon: <Bell className="w-10 h-10 text-red-500" />,
		},
		{
			title: "Facial Recognition",
			desc: "Know who's at your door before you answer. Recognize family, friends, and flag unknown visitors.",
			icon: <Eye className="w-10 h-10 text-purple-500" />,
		},
		{
			title: "Remote Access Control",
			desc: "Lock or unlock doors from anywhere. Grant temporary access to guests. Track every entry and exit.",
			icon: <Smartphone className="w-10 h-10 text-emerald-500" />,
		},
		{
			title: "Cloud Recording 24/7",
			desc: "Never miss a moment with continuous cloud storage. Review footage anytime from the past 30 days.",
			icon: <Clock className="w-10 h-10 text-amber-500" />,
		},
		{
			title: "Perimeter Protection",
			desc: "Advanced motion sensors cover every angle. Create custom zones and get alerts for specific areas.",
			icon: <MapPin className="w-10 h-10 text-indigo-500" />,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 p-20">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<header className="text-center mb-16">
					<div className="inline-block bg-red-100 px-4 py-2 rounded-full mb-4">
						<span className="text-red-600 font-semibold text-sm">🛡️ Military-Grade Protection</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
						Protect What Matters Most with<br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
							Advanced Security Systems
						</span>
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Guard your home, family, and valuables with Ghana's most sophisticated security technology. AI-powered cameras, smart locks, and 24/7 monitoring that keeps you protected even when you're miles away.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
						<div className="flex items-center gap-2 text-gray-700">
							<CheckCircle className="w-5 h-5 text-emerald-500" />
							<span>4K HD Cameras</span>
						</div>
						<div className="flex items-center gap-2 text-gray-700">
							<CheckCircle className="w-5 h-5 text-emerald-500" />
							<span>AI Detection</span>
						</div>
						<div className="flex items-center gap-2 text-gray-700">
							<CheckCircle className="w-5 h-5 text-emerald-500" />
							<span>99.9% Uptime</span>
						</div>
						<div className="flex items-center gap-2 text-gray-700">
							<CheckCircle className="w-5 h-5 text-emerald-500" />
							<span>Police Integration</span>
						</div>
					</div>
				</header>

				{/* System Status Overview */}
				<div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-8 mb-16 border border-blue-200">
					<div className="flex items-center gap-4 mb-6 md:mb-0">
						<div className="relative">
							<Shield className={`w-12 h-12 ${activeSystems === totalSystems ? 'text-emerald-500' : 'text-amber-500'} ${activeSystems === totalSystems ? 'animate-pulse' : ''}`} />
							{activeSystems === totalSystems && (
								<div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full">
									<div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping"></div>
								</div>
							)}
						</div>
						<div>
							<h2 className="text-3xl font-bold text-gray-900">
								System Status: {activeSystems === totalSystems ? 'Armed' : 'Partial'}
							</h2>
							<p className="text-gray-600 text-lg">
								<span className="font-bold text-blue-600">{activeSystems}/{totalSystems}</span> security devices online
							</p>
							<p className="text-sm text-gray-500">
								🌐 All systems connected • Response time: &lt;2 seconds
							</p>
						</div>
					</div>
					<div className="flex flex-col items-center gap-3">
						<div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg ${
							threatLevel === 'Low' ? 'bg-emerald-100' :
							threatLevel === 'Moderate' ? 'bg-amber-100' :
							'bg-red-100'
						}`}>
							<AlertTriangle className={`w-6 h-6 ${threatColor}`} />
							<div>
								<div className="text-xs text-gray-600">Threat Level</div>
								<div className={`text-xl font-bold ${threatColor}`}>{threatLevel}</div>
							</div>
						</div>
						<p className="text-xs text-gray-500">Last scan: 2 minutes ago</p>
					</div>
				</div>

				{/* Security Devices Grid */}
				<section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{systems.map((system) => (
						<div
							key={system.id}
							className={`p-6 rounded-3xl shadow-md bg-white border transition transform hover:-translate-y-1 hover:shadow-xl ${
								system.status ? "border-green-500" : "border-gray-300"
							}`}
						>
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-4">
									{system.icon}
									<h3 className="text-xl font-semibold text-gray-800">
										{system.name}
									</h3>
								</div>
								<span
									className={`text-sm px-3 py-1 rounded-full ${
										system.status
											? "bg-green-100 text-green-700"
											: "bg-gray-200 text-gray-600"
									}`}
								>
									{system.status ? "Active" : "Inactive"}
								</span>
							</div>
							<button
								onClick={() => toggleSystem(system.id)}
								className={`w-full py-2 rounded-full font-medium transition ${
									system.status
										? "bg-red-500 hover:bg-red-600 text-white"
										: "bg-green-500 hover:bg-green-600 text-white"
								}`}
							>
								{system.status ? "Deactivate" : "Activate"}
							</button>
						</div>
					))}
				</section>

				{/* Smart Security Features Section */}
				<section className="mt-24 mb-16">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-gray-900 dark:text-dark mb-4">
							Enterprise-Grade Security for Your Home
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							The same technology trusted by banks and government buildings, now protecting Ghanaian homes
						</p>
					</div>
					
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={feature.title}
								className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div className="flex justify-center mb-6">{feature.icon}</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
									{feature.title}
								</h3>
								<p className="text-gray-600 text-center leading-relaxed">
									{feature.desc}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Security Stats */}
				<section className="mt-20 bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
					<div className="absolute inset-0 opacity-10">
						<div className="absolute inset-0" style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
						}} />
					</div>

					<div className="relative z-10">
						<h2 className="text-4xl font-bold text-center mb-12">Proven Protection Results</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">98%</div>
								<div className="text-blue-200">Crime Prevention Rate</div>
							</div>
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">&lt;30s</div>
								<div className="text-blue-200">Response Time</div>
							</div>
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">3,500+</div>
								<div className="text-blue-200">Homes Protected</div>
							</div>
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">24/7</div>
								<div className="text-blue-200">Monitoring</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="mt-20 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
					<div className="absolute inset-0 opacity-20">
						<div className="absolute inset-0" style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
						}} />
					</div>

					<div className="relative z-10">
						<Shield className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Don't Wait Until It's Too Late
						</h2>
						<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
							Every 15 seconds, a home is broken into. Protect your family today with Ghana's #1 security system. Professional installation in 24 hours.
						</p>

						<div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>No Contract Required</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>Free Installation</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>30-Day Money Back</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>Police Certified</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
