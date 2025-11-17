import React, { useState } from 'react';
import {
  Home,
  Key,
  Zap,
  Palette,
  TrendingUp,
  Settings,
  ArrowRight,
  CheckCircle,
  Star,
  X
} from 'lucide-react';
import api from '../../../api/axios';

const propertySalesImg = '/images/services/property-sales-1.jpg';
const propertyRentalsImg = '/images/services/property-rentals.jpg';
const smartHomeImg = '/images/services/smart-home-installation-1.jpg';
const interiorDesignImg = '/images/services/interior-design-1.webp';
const investmentConsultingImg = '/images/services/investment-consulting-1.webp';
const propertyManagementImg = '/images/services/property-management-1.jpg';

const ServicesSection = () => {
  const [activeService, setActiveService] = useState('property-sales');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const services = [
    {
      id: 'property-sales',
      title: 'Property Sales',
      icon: Home,
      shortDescription: 'Expert guidance for buying and selling properties across Ghana',
      fullDescription:
        "Our property sales service connects buyers and sellers with expert guidance throughout the entire transaction process. We specialize in residential, commercial, and land sales across Ghana's major cities.",
      features: [
        'Market analysis and property valuation',
        'Professional property photography and marketing',
        'Buyer and seller representation',
        'Legal documentation assistance',
        'Negotiation and closing support',
        'Post-sale follow-up services'
      ],
      benefits: [
        'Access to exclusive property listings',
        'Expert market knowledge and insights',
        'Streamlined buying/selling process',
        'Legal compliance assurance',
        'Maximum return on investment'
      ],
      process: [
        'Initial consultation and needs assessment',
        'Property search or listing preparation',
        'Market analysis and pricing strategy',
        'Marketing and showing coordination',
        'Offer negotiation and acceptance',
        'Legal documentation and closing'
      ],
      pricing: 'Commission-based: 5-7% of property value',
      image: propertySalesImg
    },
    {
      id: 'property-rentals',
      title: 'Property Rentals',
      icon: Key,
      shortDescription: 'Comprehensive rental services for landlords and tenants',
      fullDescription:
        'We provide end-to-end rental services including tenant screening, lease management, and property maintenance coordination. Our service ensures smooth rental experiences for both landlords and tenants.',
      features: [
        'Tenant screening and background checks',
        'Lease agreement preparation and management',
        'Rent collection and financial reporting',
        'Property maintenance coordination',
        'Tenant relations and conflict resolution',
        'Legal compliance and documentation'
      ],
      benefits: [
        'Reliable tenant placement',
        'Consistent rental income',
        'Professional property management',
        'Legal protection and compliance',
        'Reduced vacancy periods'
      ],
      process: [
        'Property assessment and rental pricing',
        'Marketing and tenant attraction',
        'Tenant screening and selection',
        'Lease preparation and signing',
        'Move-in coordination and inspection',
        'Ongoing management and support'
      ],
      pricing: '10-15% of monthly rental income',
      image: propertyRentalsImg
    },
    {
      id: 'smart-home-installation',
      title: 'Smart Home Installation',
      icon: Zap,
      shortDescription: 'Transform your property with cutting-edge smart home technology',
      fullDescription:
        'Our smart home installation service brings modern automation to your property. From lighting and security systems to climate control and entertainment, we create intelligent living spaces.',
      features: [
        'Smart lighting and electrical systems',
        'Home security and surveillance setup',
        'Climate control and HVAC automation',
        'Entertainment system integration',
        'Voice control and mobile app setup',
        'Energy monitoring and optimization'
      ],
      benefits: [
        'Increased property value',
        'Enhanced security and safety',
        'Energy efficiency and cost savings',
        'Convenience and comfort',
        'Remote monitoring and control'
      ],
      process: [
        'Home assessment and consultation',
        'Custom smart home design',
        'Equipment procurement and planning',
        'Professional installation and setup',
        'System testing and optimization',
        'Training and ongoing support'
      ],
      pricing: 'Starting from ₵15,000 for basic packages',
      image: smartHomeImg
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      icon: Palette,
      shortDescription:
        'Professional interior design blending modern aesthetics with Ghanaian culture',
      fullDescription:
        'Our interior design service creates beautiful, functional spaces that reflect your personality while incorporating modern design trends and traditional Ghanaian elements.',
      features: [
        'Space planning and layout design',
        'Color scheme and material selection',
        'Furniture and decor sourcing',
        'Lighting design and installation',
        'Custom millwork and built-ins',
        'Project management and coordination'
      ],
      benefits: [
        'Personalized design solutions',
        'Increased property value',
        'Optimized space utilization',
        'Professional project management',
        'Access to exclusive furnishings'
      ],
      process: [
        'Initial consultation and brief',
        'Space measurement and analysis',
        'Concept development and presentation',
        'Design refinement and approval',
        'Procurement and installation',
        'Final styling and handover'
      ],
      pricing: '₵500-₵1,500 per square meter',
      image: interiorDesignImg
    },
    {
      id: 'investment-consulting',
      title: 'Investment Consulting',
      icon: TrendingUp,
      shortDescription: 'Strategic real estate investment advice for maximum returns',
      fullDescription:
        'Our investment consulting service provides expert guidance on real estate investment opportunities, market analysis, and portfolio optimization to help you build wealth through property.',
      features: [
        'Market research and analysis',
        'Investment opportunity identification',
        'Financial modeling and ROI analysis',
        'Risk assessment and mitigation',
        'Portfolio diversification strategies',
        'Exit strategy planning'
      ],
      benefits: [
        'Data-driven investment decisions',
        'Maximized return on investment',
        'Risk mitigation strategies',
        'Market timing optimization',
        'Long-term wealth building'
      ],
      process: [
        'Investment goals assessment',
        'Market analysis and research',
        'Opportunity identification',
        'Financial analysis and modeling',
        'Investment strategy development',
        'Implementation and monitoring'
      ],
      pricing: '₵2,000-₵5,000 per consultation',
      image: investmentConsultingImg
    },
    {
      id: 'property-management',
      title: 'Property Management',
      icon: Settings,
      shortDescription:
        'Complete property management solutions for property owners',
      fullDescription:
        'Our comprehensive property management service handles all aspects of property ownership, from tenant management to maintenance coordination, ensuring your investment performs optimally.',
      features: [
        'Tenant acquisition and screening',
        'Rent collection and accounting',
        'Property maintenance and repairs',
        'Financial reporting and analysis',
        'Legal compliance management',
        '24/7 emergency response'
      ],
      benefits: [
        'Passive income generation',
        'Professional tenant relations',
        'Property value preservation',
        'Legal compliance assurance',
        'Stress-free ownership experience'
      ],
      process: [
        'Property assessment and setup',
        'Marketing and tenant placement',
        'Lease management and collection',
        'Maintenance and repair coordination',
        'Financial reporting and analysis',
        'Ongoing optimization and support'
      ],
      pricing: '8-12% of gross rental income',
      image: propertyManagementImg
    }
  ];

  const activeServiceData = services.find(service => service.id === activeService);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await api.post('/api/consultations', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Consultation submit failed:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive real estate and smart living solutions tailored for the Ghanaian market
          </p>
        </div>

        {/* Service Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {services.map(service => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  activeService === service.id
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm font-medium">{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Service */}
        {activeServiceData && (
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="lg:flex">
              <div className="lg:w-1/2">
                <img
                  src={activeServiceData.image}
                  alt={activeServiceData.title}
                  className="w-full h-64 lg:h-full object-cover"
                  onError={(e) => { e.currentTarget.src = smartHomeImg; }}
                />
              </div>

              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <activeServiceData.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {activeServiceData.title}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {activeServiceData.pricing}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {activeServiceData.fullDescription}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 lg:p-12">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                    Features
                  </h4>
                  <ul className="space-y-2">
                    {activeServiceData.features.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-2" />
                    Benefits
                  </h4>
                  <ul className="space-y-2">
                    {activeServiceData.benefits.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
                        <span className="text-gray-600">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <ArrowRight className="h-5 w-5 text-blue-500 mr-2" />
                    Process
                  </h4>
                  <ol className="space-y-2">
                    {activeServiceData.process.map((p, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {i + 1}
                        </div>
                        <span className="text-gray-600">{p}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Contact our expert team today to discuss your specific needs and get a customized solution for your property requirements.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Schedule Consultation
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Schedule a Consultation
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>

              {status === 'success' && (
                <p className="text-green-600 text-center mt-4">
                  ✅ Consultation request submitted successfully!
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-center mt-4">
                  ❌ Failed to submit request. Please try again.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Properties Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">200+</div>
            <div className="text-gray-600">Smart Homes Installed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">1,000+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">10+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
