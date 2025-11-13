import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const faqItems = [
  {
    question: "How do I request a service from ArchSmart?",
    answer: "Browse our service categories (e.g. Smart Home Installation, Interior Design) and use the contact form or direct email to request a quote. We respond within 2 business hours.",
  },
  {
    question: "Do you offer bundled smart living packages?",
    answer: "Yes. We provide tiered bundles (Starter, Advanced, Premium) that combine lighting, security, climate control, and automation. Each includes installation, configuration, and onboarding.",
  },
  {
    question: "Can services be financed?",
    answer: "We partner with local financial institutions for large installations. Financing options depend on project scope. Ask our support team for current financing partners.",
  },
  {
    question: "What is the typical installation timeline?",
    answer: "Standard smart home installations take 3-5 days after site assessment. Larger custom builds may extend to 2-3 weeks depending on complexity.",
  },
  {
    question: "Do you provide maintenance after installation?",
    answer: "All installations include 12 months of proactive maintenance and lifetime remote support. Extended on-site support plans are available.",
  },
  {
    question: "How secure are your smart systems?",
    answer: "We implement encrypted device communication, role-based access, and optional multi-factor authentication for control dashboards.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-4">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <span className="text-amber-500 font-semibold text-sm">Service FAQ</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Service Questions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Answers to common questions about our professional property and smart living services.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {faqItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="text-lg font-semibold text-gray-900 pr-4">{item.question}</span>
              {openIndex === idx ? (
                <ChevronUp className="w-6 h-6 text-amber-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-6">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Need more details?</h3>
        <p className="text-gray-700 mb-6">Our service specialists can tailor solutions to your exact property goals. Reach out for a custom proposal.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:archsmart.info@gmail.com"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-center"
          >
            Email Our Team
          </a>
          <a
            href="tel:+233559002698"
            className="px-6 py-3 bg-gray-900 text-amber-400 border-2 border-amber-500 rounded-lg font-semibold hover:bg-gray-800 transition-all text-center"
          >
            Call +233 559 0026 98
          </a>
        </div>
      </div>
    </div>
  );
}
