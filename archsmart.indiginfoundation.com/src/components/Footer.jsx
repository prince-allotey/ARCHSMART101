import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Footer() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I buy a property through ArchSmart?",
      answer: "Simply browse our verified listings, schedule a viewing with our agents, and we'll guide you through the entire process from negotiation to legal documentation. Our average transaction takes just 14 days from viewing to handover.",
    },
    {
      question: "Are all properties verified and legally documented?",
      answer: "Yes! Every property on ArchSmart undergoes thorough verification including land title searches, ownership confirmation, and legal documentation review. We only list properties with clean titles and proper documentation.",
    },
    {
      question: "What smart home services do you offer?",
      answer: "We provide complete smart home solutions including smart lighting, climate control, security systems, and home automation. Our packages include installation, setup, training, and lifetime technical support.",
    },
    {
      question: "Do you offer property management services?",
      answer: "Absolutely! We offer comprehensive property management including tenant screening, rent collection, maintenance, and regular inspections. First 6 months are free for all property purchases through ArchSmart.",
    },
    {
      question: "Can I rent properties through ArchSmart?",
      answer: "Yes! We have a wide selection of rental properties across Ghana. Browse our listings, schedule viewings, and our agents will help you secure the perfect rental with transparent terms and fair pricing.",
    },
    {
      question: "What are your agent commission rates?",
      answer: "Our commission rates are competitive and transparent. For buyers, we typically charge 5% of the property value. For sellers, rates range from 3-5% depending on the property type and location. Contact us for a detailed quote.",
    },
    {
      question: "How long does the property buying process take?",
      answer: "From viewing to key handover typically takes 14-21 days. This includes property selection, negotiation, legal documentation, payment processing, and final handover. We handle all the complex parts to ensure a smooth experience.",
    },
    {
      question: "Do you provide financing or mortgage assistance?",
      answer: "While we don't directly provide mortgages, we have partnerships with major banks in Ghana. Our agents can connect you with trusted financial institutions and help with the mortgage application process.",
    },
  ];

  const linkClass = ({ isActive }) =>
    `transition-colors ${
      isActive ? "text-amber-400 font-semibold" : "text-gray-300 hover:text-amber-400"
    }`;

  return (
    <footer className="bg-gray-900/95 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ArchSmart</h1>
                <p className="text-sm text-amber-400">GH</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Ghana's premier digital hub for real estate and smart living
              solutions. Transforming how Ghanaians discover, invest in, and
              experience modern properties.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://facebook.com/archsmartgh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/archsmartgh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/archsmartgh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/archsmartgh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/" className={linkClass} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/properties" className={linkClass}>
                  Properties
                </NavLink>
              </li>
              <li>
                <NavLink to="/smart-living" className={linkClass}>
                  Smart Living
                </NavLink>
              </li>
              <li>
                <NavLink to="/education" className={linkClass}>
                  Education Hub
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={linkClass}>
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={linkClass}>
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400">Service Rendering</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/services" className={linkClass}>
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/services/propertysales" className={linkClass}>
                  Property Sales
                </NavLink>
              </li>
              <li>
                <NavLink to="/services/propertyrentals" className={linkClass}>
                  Property Rentals
                </NavLink>
              </li>
              <li>
                <NavLink to="/services/smarthomeinstallation" className={linkClass}>
                  Smart Home Installation
                </NavLink>
              </li>
              <li>
                <NavLink to="/services/interiordesign" className={linkClass}>
                  Interior Design
                </NavLink>
              </li>
              <li>
                <NavLink to="/services/investmentconsulting" className={linkClass}>
                  Investment Consulting
                </NavLink>
              </li>
              <li>
                <NavLink to="/services/propertymanagements" className={linkClass}>
                  Property Management
                </NavLink>
              </li>
              <li>
                <NavLink to="/services/faq" className={linkClass}>
                  FAQ
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">123 Independence Avenue</p>
                  <p className="text-gray-300">Accra, Ghana</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-gray-300">+233 559 00 2698</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">archsmart.info@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 ArchSmart GH. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <NavLink to="/privacy-policy" className={linkClass}>
                Privacy Policy
              </NavLink>
              <NavLink to="/terms-of-service" className={linkClass}>
                Terms of Service
              </NavLink>
              <NavLink to="/cookie-policy" className={linkClass}>
                Cookie Policy
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
