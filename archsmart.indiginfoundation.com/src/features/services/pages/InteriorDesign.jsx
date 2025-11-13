import React from "react";
import { Paintbrush, Lamp, Sofa, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function InteriorDesign() {
	const features = [
		{
			icon: <Paintbrush className="w-10 h-10 text-emerald-600" />,
			title: "Personalized Aesthetic",
			desc: "We create designs that reflect your unique personality and style preferences.",
		},
		{
			icon: <Lamp className="w-10 h-10 text-blue-600" />,
			title: "Smart Lighting Design",
			desc: "Enhance ambiance with automated, energy-efficient lighting solutions.",
		},
		{
			icon: <Sofa className="w-10 h-10 text-amber-600" />,
			title: "Comfort & Functionality",
			desc: "Every element is crafted to balance beauty with everyday practicality.",
		},
		{
			icon: <Sparkles className="w-10 h-10 text-pink-600" />,
			title: "Sustainable Materials",
			desc: "We source eco-friendly materials to ensure a greener, modern living environment.",
		},
	];

	return (
		<div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
			{/* Hero Section */}
			<section className="relative overflow-hidden py-24 px-6 lg:px-20 flex flex-col items-center text-center">
				<motion.h1
					className="text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Elevate Your Living with Modern Interior Design
				</motion.h1>

				<motion.p
					className="text-lg max-w-3xl text-gray-700 leading-relaxed"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					Our interior design services merge creativity, technology, and functionality to transform
					your home into a space that embodies elegance and comfort. Whether minimalist or luxurious,
					we tailor every detail to your lifestyle.
				</motion.p>
			</section>

			{/* Features Section */}
			<section className="py-16 px-6 lg:px-20">
				<h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
					Why Choose Our Interior Design Services?
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center"
							whileHover={{ scale: 1.05 }}
						>
							{feature.icon}
							<h3 className="mt-4 font-semibold text-lg text-gray-900">{feature.title}</h3>
							<p className="text-gray-600 mt-2">{feature.desc}</p>
						</motion.div>
					))}
				</div>
			</section>
		</div>
	);
}