import React from 'react';
import AdvertRequestForm from '../components/AdvertRequestForm';
import { toast } from 'react-hot-toast';

const AdvertRequestPage = () => {
  const handleSubmitted = () => {
    // Could redirect or show success message
    toast.success('Your advert request has been submitted! We will review it shortly.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-pink-500 shadow-2xl p-10 sm:p-14 lg:p-20 mb-12">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-gradient-to-r from-black/10 via-transparent to-black/10" aria-hidden />
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-white z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">Showcase your brand to thousands of property shoppers</h1>
              <p className="mt-4 max-w-2xl text-lg sm:text-xl text-indigo-100/90">Advertise with ArchSmart and place your business where decision-makers look for homes — premium placements, verified leads, and measurable results.</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <a href="#request-form" className="inline-flex items-center gap-3 bg-white text-indigo-700 font-semibold px-5 py-3 rounded-full shadow hover:opacity-95 transition">Get Started <span className="text-sm text-indigo-400">(Free review)</span></a>
                <a href="#pricing" className="inline-flex items-center gap-3 border border-white/20 text-white/90 px-4 py-3 rounded-full hover:opacity-95 transition">See packages</a>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg">
                <div className="bg-white/10 rounded-lg p-3 text-sm">
                  <div className="font-bold text-lg">50k+</div>
                  <div className="text-xs text-indigo-100/80">Monthly visitors</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-sm">
                  <div className="font-bold text-lg">500+</div>
                  <div className="text-xs text-indigo-100/80">Active advertisers</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-sm">
                  <div className="font-bold text-lg">95%</div>
                  <div className="text-xs text-indigo-100/80">Satisfaction</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-sm">
                  <div className="font-bold text-lg">24h</div>
                  <div className="text-xs text-indigo-100/80">Review window</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative z-10">
              {/* card container (form) */}
              <div id="request-form" className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl ring-1 ring-black/5 border border-white/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white rounded-xl flex items-center justify-center font-bold">AS</div>
                  <div>
                    <div className="text-sm text-gray-500">Advertise on</div>
                    <div className="font-semibold text-gray-900">ArchSmart — Premium placement</div>
                  </div>
                </div>

                {/* integrated form component */}
                <AdvertRequestForm onSubmitted={handleSubmitted} />

                <p className="text-xs text-gray-400 mt-4">Your details are safe. We review all submissions & notify you via email.</p>
              </div>

              {/* decorative illustration */}
              <div className="mt-6 hidden lg:flex items-center justify-center pointer-events-none" aria-hidden>
                <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="20" width="204" height="108" rx="16" fill="rgba(255,255,255,0.08)" />
                  <g transform="translate(18,32)">
                    <rect x="0" y="0" width="120" height="28" rx="6" fill="#fff" opacity="0.15" />
                    <rect x="0" y="40" width="160" height="16" rx="6" fill="#fff" opacity="0.12" />
                    <rect x="0" y="64" width="80" height="16" rx="6" fill="#fff" opacity="0.12" />
                  </g>
                  <circle cx="166" cy="48" r="28" fill="#fff" opacity="0.08" />
                  <path d="M38 116c18-14 40-14 58 0" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* FEATURES */}
        <section className="mb-12 grid md:grid-cols-3 gap-6 items-start">
          <article className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Premium Placements</h3>
            <p className="mt-2 text-sm text-gray-600">Top-of-the-feed, homepage feature slots and targeted banner zones for higher visibility.</p>
          </article>

          <article className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Audience Targeting</h3>
            <p className="mt-2 text-sm text-gray-600">We help you reach property buyers and renters using our category and location filters.</p>
          </article>

          <article className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Reporting & Support</h3>
            <p className="mt-2 text-sm text-gray-600">Get weekly performance metrics, lead details and priority support during campaigns.</p>
          </article>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="text-gray-600 mt-2">Choose a plan that fits your budget — discounts available for longer campaigns.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border border-gray-100 shadow-lg text-center">
              <div className="text-sm text-gray-500">Starter</div>
              <div className="text-3xl font-extrabold text-indigo-700 mt-3">Ghs 8,000</div>
              <div className="text-sm text-gray-500 mt-2">1 month • Standard placement</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Homepage exposure</li>
                <li>Basic analytics</li>
                <li>1 creative slot</li>
              </ul>
              <div className="mt-6">
                <a href="#request-form" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold">Request</a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-700 to-fuchsia-600 text-white p-6 rounded-3xl border border-transparent shadow-2xl text-center transform scale-105">
              <div className="text-sm opacity-80">Most popular</div>
              <div className="text-3xl font-extrabold mt-3">Ghs 25,000</div>
              <div className="text-sm opacity-90 mt-2">3 months • Premium placement</div>
              <ul className="mt-4 space-y-2 text-sm opacity-90">
                <li>High-priority feed placements</li>
                <li>Enhanced analytics</li>
                <li>2 creatives + A/B tests</li>
              </ul>
              <div className="mt-6">
                <a href="#request-form" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-indigo-700 font-semibold">Get started</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg text-center">
              <div className="text-sm text-gray-500">Enterprise</div>
              <div className="text-3xl font-extrabold text-indigo-700 mt-3">Custom</div>
              <div className="text-sm text-gray-500 mt-2">6–12 months • Bespoke campaigns</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Managed campaigns</li>
                <li>Dedicated account manager</li>
                <li>Priority support & custom creatives</li>
              </ul>
              <div className="mt-6">
                <a href="#request-form" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold">Contact sales</a>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST + TESTIMONIALS */}
        <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Trusted by businesses across the country</h3>
              <p className="mt-2 text-sm text-gray-600">See why agencies, developers and service providers choose ArchSmart for consistent lead flow.</p>
            </div>

            <div className="flex gap-6 items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">500+</div>
                <div className="text-xs text-gray-500">Active advertisers</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">50k+</div>
                <div className="text-xs text-gray-500">Monthly visitors</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">95%</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">Ready to start? Submit your advert request and we’ll respond within 24 hours.</p>
          <div className="mt-4">
            <a href="#request-form" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-700 text-white font-semibold shadow-lg">Create a request</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdvertRequestPage;