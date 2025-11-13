import React from "react";
import { motion } from "framer-motion";
import { Home, Users, Wrench, DollarSign, ClipboardList, ShieldCheck } from "lucide-react";

export default function PropertyManagements() {
	const services = [
		{
			icon: <Home className="w-10 h-10 text-blue-600" />,
			title: "Property Maintenance",
			desc: "Regular inspections, cleaning, and repairs to keep your property in excellent condition year-round.",
		},
		{
			icon: <Users className="w-10 h-10 text-emerald-600" />,
			title: "Tenant Relations",
			desc: "We handle all tenant interactions — from onboarding to issue resolution — ensuring satisfaction and retention.",
		},
		{
			icon: <DollarSign className="w-10 h-10 text-yellow-500" />,
			title: "Rent Collection",
			desc: "Streamlined rent collection systems and automated payment reminders to maintain consistent cash flow.",
		},
		{
			icon: <Wrench className="w-10 h-10 text-gray-700" />,
			title: "Maintenance Coordination",
			desc: "We work with trusted vendors and contractors to handle all maintenance requests promptly.",
		},
		{
			icon: <ClipboardList className="w-10 h-10 text-indigo-600" />,
			title: "Financial Reporting",
			desc: "Detailed financial statements and performance reports to keep you informed about your property’s ROI.",
		},
		{
			icon: <ShieldCheck className="w-10 h-10 text-rose-600" />,
			title: "Legal & Compliance",
			desc: "We manage lease agreements, compliance with housing laws, and dispute resolutions professionally.",
		},
	];

	return (
		<div className="bg-gradient-to-b from-gray-50 to-white text-gray-800">
			{/* Hero Section */}
			<section className="py-24 px-6 lg:px-20 text-center">
				<motion.h1
					className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-600"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Property Management
				</motion.h1>
				<motion.p
					className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					We provide comprehensive property management solutions — from maintenance and tenant relations
					to financial oversight — ensuring your real estate assets perform at their best.
				</motion.p>
			</section>

			{/* Key Services */}
			<section className="py-20 px-6 lg:px-20">
				<h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
					Our Property Management Services
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
					{services.map((item, i) => (
						<motion.div
							key={i}
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