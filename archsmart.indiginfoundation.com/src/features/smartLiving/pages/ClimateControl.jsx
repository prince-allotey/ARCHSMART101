import React, { useState } from "react";
import { Thermometer, Wind, Sun, Snowflake, Power, Smartphone, Cloud, TrendingDown, CheckCircle, Droplets, Calendar, Clock } from "lucide-react";

export default function ClimateControl() {
	const [temperature, setTemperature] = useState(22); // default °C
	const [mode, setMode] = useState("Auto");
	const [power, setPower] = useState(true);

	const increaseTemp = () => setTemperature((prev) => Math.min(prev + 1, 32));
	const decreaseTemp = () => setTemperature((prev) => Math.max(prev - 1, 16));
	const togglePower = () => setPower((prev) => !prev);

	const modes = [
		{ label: "Auto", icon: <Wind className="w-5 h-5 text-sky-600" /> },
		{ label: "Cool", icon: <Snowflake className="w-5 h-5 text-blue-500" /> },
		{ label: "Heat", icon: <Sun className="w-5 h-5 text-amber-500" /> },
	];

	const features = [
		{
			title: "AI Temperature Learning",
			desc: "Learns your preferences and automatically adjusts to your ideal comfort level throughout the day.",
			icon: <Thermometer className="w-12 h-12 text-blue-600" />,
		},
		{
			title: "Multi-Zone Control",
			desc: "Independent temperature control for every room. No more fighting over the thermostat.",
			icon: <Wind className="w-12 h-12 text-cyan-600" />,
		},
		{
			title: "Energy Intelligence",
			desc: "Smart algorithms reduce energy waste by up to 50% while maintaining perfect comfort.",
			icon: <TrendingDown className="w-12 h-12 text-green-600" />,
		},
		{
			title: "Weather Integration",
			desc: "Automatically adjusts based on outdoor conditions and weather forecasts.",
			icon: <Cloud className="w-12 h-12 text-indigo-600" />,
		},
		{
			title: "Humidity Management",
			desc: "Maintains optimal humidity levels (40-60%) for health and comfort in Ghana's tropical climate.",
			icon: <Droplets className="w-12 h-12 text-teal-600" />,
		},
		{
			title: "Smart Scheduling",
			desc: "Pre-cool or pre-heat your home before you arrive. Wake up to perfect temperature every morning.",
			icon: <Calendar className="w-12 h-12 text-purple-600" />,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 p-20">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<header className="text-center mb-16">
					<div className="inline-block bg-blue-100 px-4 py-2 rounded-full mb-4">
						<span className="text-blue-600 font-semibold text-sm">❄️ Perfect Climate, Every Day</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
						Never Suffer Ghana's Heat Again
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
						Cut your AC bills by 50% while enjoying perfect temperature 24/7. Smart climate control that learns your preferences and adapts to Ghana's tropical weather.
					</p>
					<div className="flex flex-wrap justify-center gap-6 text-sm">
						<div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
							<TrendingDown className="w-5 h-5 text-green-600" />
							<span className="text-gray-700"><strong>50% Lower Bills</strong></span>
						</div>
						<div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
							<Smartphone className="w-5 h-5 text-blue-600" />
							<span className="text-gray-700"><strong>Remote Control</strong></span>
						</div>
						<div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
							<Clock className="w-5 h-5 text-purple-600" />
							<span className="text-gray-700"><strong>24/7 Optimization</strong></span>
						</div>
					</div>
				</header>

				{/* Main Control Card */}
				<div className="bg-white shadow-2xl rounded-3xl p-8 mb-16 flex flex-col items-center justify-center text-center border border-gray-200">
					<div className="flex items-center gap-4 mb-6">
						<Thermometer className="w-10 h-10 text-blue-600" />
						<h2 className="text-3xl font-semibold text-gray-800">
							Smart Thermostat Control
						</h2>
					</div>

					<div className="flex items-center gap-6 justify-center">
						<button
							onClick={decreaseTemp}
							className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-12 h-12 text-2xl font-bold transition disabled:opacity-50"
							disabled={!power}
						>
							−
						</button>
						<div>
							<p className="text-6xl font-extrabold text-blue-600">
								{temperature}°C
							</p>
							<p className="text-gray-500 mt-1">
								Current Temperature
							</p>
						</div>
						<button
							onClick={increaseTemp}
							className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-12 h-12 text-2xl font-bold transition disabled:opacity-50"
							disabled={!power}
						>
							+
						</button>
					</div>

					{/* Mode selector */}
					<div className="flex gap-4 mt-8 flex-wrap justify-center">
						{modes.map((m) => (
							<button
								key={m.label}
								onClick={() => setMode(m.label)}
								className={`flex items-center gap-2 px-6 py-3 rounded-full border transition ${
									mode === m.label
										? "bg-blue-600 text-white border-blue-600"
										: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100"
								}`}
								disabled={!power}
							>
								{m.icon}
								<span>{m.label}</span>
							</button>
						))}
					</div>

					{/* Power toggle */}
					<button
						onClick={togglePower}
						className={`mt-10 flex items-center gap-3 px-6 py-3 rounded-full text-lg font-medium transition ${
							power
								? "bg-green-500 hover:bg-green-600 text-white"
								: "bg-gray-400 hover:bg-gray-500 text-white"
						}`}
					>
						<Power className="w-5 h-5" />
						{power ? "Turn Off" : "Turn On"}
					</button>
				</div>

				{/* Features Section */}
				<section className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Advanced Climate Intelligence
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Technology that understands Ghana's unique climate and your personal comfort preferences
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

				{/* Energy Savings Stats */}
				<section className="mt-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
					<div className="absolute inset-0 opacity-10">
						<div className="absolute inset-0" style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
						}} />
					</div>

					<div className="relative z-10">
						<h2 className="text-4xl font-bold text-center mb-12">Real Savings, Real Comfort</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">50%</div>
								<div className="text-green-200">Lower Energy Bills</div>
							</div>
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">22°C</div>
								<div className="text-green-200">Perfect Temperature</div>
							</div>
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">1,800+</div>
								<div className="text-green-200">Homes Cooled</div>
							</div>
							<div className="text-center">
								<div className="text-5xl font-bold mb-2">GH₵4M+</div>
								<div className="text-green-200">Total Saved</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="mt-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
					<div className="absolute inset-0 opacity-20">
						<div className="absolute inset-0" style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
						}} />
					</div>

					<div className="relative z-10">
						<Snowflake className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Stop Sweating. Start Saving.
						</h2>
						<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
							Transform your home into a cool paradise while cutting your AC bills in half. Professional installation in 48 hours with lifetime support.
						</p>

						<div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>Free Installation</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>3-Year Warranty</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>Money-Back Guarantee</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								<span>ECG Certified</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}