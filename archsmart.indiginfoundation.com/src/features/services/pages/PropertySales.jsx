import React from "react";
import { motion } from "framer-motion";
import { Home, Building2, TrendingUp, Handshake, MapPin, ShieldCheck } from "lucide-react";

export default function PropertySales() {
	const features = [
		{
			icon: <Home className="w-10 h-10 text-blue-600" />,
			title: "Wide Property Range",
			desc: "From cozy apartments to luxury villas — find your perfect match in our curated listings.",
		},
		{
			icon: <TrendingUp className="w-10 h-10 text-emerald-600" />,
			title: "Market Insights",
			desc: "Stay informed with the latest property trends, pricing, and investment opportunities.",
		},
		{
			icon: <Handshake className="w-10 h-10 text-amber-600" />,
			title: "Transparent Transactions",
			desc: "We ensure smooth and secure property deals, handling all paperwork and legalities for you.",
		},
		{
			icon: <Building2 className="w-10 h-10 text-indigo-600" />,
			title: "Commercial Expertise",
			desc: "Looking for office spaces or retail properties? Our team specializes in commercial sales.",
		},
		{
			icon: <MapPin className="w-10 h-10 text-rose-600" />,
			title: "Prime Locations",
			desc: "We focus on properties in high-demand, growth-oriented areas with strong future value.",
		},
		{
			icon: <ShieldCheck className="w-10 h-10 text-gray-700" />,
			title: "Trusted Service",
			desc: "With verified listings and professional consultants, you can buy with full confidence.",
		},
	];

	return (
		<div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
			{/* Hero Section */}
			<section className="py-24 px-6 lg:px-20 text-center">
				<motion.h1
					className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-600"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Find Your Dream Property
				</motion.h1>

				<motion.p
					className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					We connect buyers with exclusive residential and commercial properties across Ghana.
					Get expert guidance, in-depth market insights, and a seamless buying experience.
				</motion.p>
			</section>

			{/* Features Section */}
			<section className="py-20 px-6 lg:px-20">
				<h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
					Why Choose ArchSmart for Your Next Property
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
		</div>
	);
}