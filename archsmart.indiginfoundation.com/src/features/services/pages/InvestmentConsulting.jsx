import React from "react";
import { LineChart, Briefcase, TrendingUp, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { assetUrl } from "../../../api/config";

export default function InvestmentConsulting() {
	const features = [
		{
			icon: <LineChart className="w-10 h-10 text-emerald-600" />,
			title: "Market Intelligence",
			desc: "Stay ahead with in-depth property analytics and data-backed investment forecasting.",
		},
		{
			icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
			title: "ROI Optimization",
			desc: "We identify opportunities with the best growth potential and guide you to maximize returns.",
		},
		{
			icon: <Briefcase className="w-10 h-10 text-amber-600" />,
			title: "Portfolio Management",
			desc: "Diversify and balance your property portfolio for long-term profitability and security.",
		},
		{
			icon: <ShieldCheck className="w-10 h-10 text-indigo-600" />,
			title: "Risk Mitigation",
			desc: "Our consultants assess risks and implement strategies to safeguard your investments.",
		},
	];

	return (
		<div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
			{/* Hero Section */}
			<section className="relative py-24 px-6 lg:px-20 text-center">
				<motion.h1
					className="text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Smart Investment Consulting
				</motion.h1>

				<motion.p
					className="text-lg max-w-3xl mx-auto text-gray-700 leading-relaxed"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					We empower investors to make informed real estate decisions through data-driven strategies,
					market analytics, and personalized consulting — ensuring sustainable growth and high ROI.
				</motion.p>
			</section>

			{/* Features Section */}
			<section className="py-20 px-6 lg:px-20">
				<h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
					Our Investment Expertise
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
					{features.map((item, index) => (
						<motion.div
							key={index}
							className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 text-center flex flex-col items-center"
							whileHover={{ scale: 1.05 }}
						>
							{item.icon}
							<h3 className="mt-4 font-semibold text-lg text-gray-900">{item.title}</h3>
							<p className="text-gray-600 mt-2">{item.desc}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* Global Reach Section */}
			<section className="py-16 px-6 lg:px-20 bg-gray-100 rounded-t-3xl">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					<motion.img
							src={assetUrl("/services/global-investment-opportunity.jpg")}
						alt="Global Investment Network"
						className="rounded-2xl shadow-lg w-full object-cover"
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8 }}
					/>

					<motion.div
						initial={{ opacity: 0, x: 40 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h3 className="text-3xl font-bold mb-4 text-gray-900 flex items-center space-x-2">
							<Globe className="text-emerald-600 w-7 h-7" />
							<span>Global Investment Reach</span>
						</h3>
						<p className="text-gray-700 leading-relaxed">
							Partner with our international network of analysts and real estate professionals. Gain
							access to emerging markets, exclusive listings, and cross-border investment insights.
						</p>
						<ul className="mt-6 space-y-2 text-gray-600 list-disc list-inside">
							<li>Access to global property databases</li>
							<li>Personalized investment roadmaps</li>
							<li>End-to-end acquisition support</li>
						</ul>
					</motion.div>
				</div>
			</section>
		</div>
	);
}