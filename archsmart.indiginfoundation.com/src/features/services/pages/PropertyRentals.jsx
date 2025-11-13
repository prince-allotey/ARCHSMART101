import React from "react";
import { motion } from "framer-motion";
import { MapPin, Home, Wallet, KeyRound, ShieldCheck, Clock } from "lucide-react";

export default function PropertyRentals() {
	const features = [
		{
			icon: <MapPin className="w-10 h-10 text-blue-600" />,
			title: "Prime Locations",
			desc: "Choose from properties located in vibrant neighborhoods close to essential amenities.",
		},
		{
			icon: <Wallet className="w-10 h-10 text-emerald-600" />,
			title: "Affordable Pricing",
			desc: "Competitive rental rates with flexible payment plans that fit your lifestyle and budget.",
		},
		{
			icon: <KeyRound className="w-10 h-10 text-amber-600" />,
			title: "Move-In Ready Homes",
			desc: "All our listings are fully inspected, cleaned, and ready for immediate occupancy.",
		},
		{
			icon: <ShieldCheck className="w-10 h-10 text-rose-600" />,
			title: "Secure & Trusted",
			desc: "Verified properties and landlords ensure your peace of mind with every lease.",
		},
		{
			icon: <Home className="w-10 h-10 text-indigo-600" />,
			title: "Variety of Choices",
			desc: "From luxury apartments to family houses — find the perfect match for your needs.",
		},
		{
			icon: <Clock className="w-10 h-10 text-gray-700" />,
			title: "Flexible Terms",
			desc: "Short-term and long-term rental options that adapt to your schedule and plans.",
		},
	];

	return (
		<div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
			{/* Hero Section */}
			<section className="py-24 px-6 lg:px-20 text-center">
				<motion.h1
					className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Explore Premium Property Rentals
				</motion.h1>

				<motion.p
					className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					Find the perfect home or workspace to rent — with flexible terms,
					affordable pricing, and locations designed for comfort and convenience.
				</motion.p>
			</section>

			{/* Features Section */}
			<section className="py-20 px-6 lg:px-20">
				<h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
					Why Rent With Us
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