import React, { useEffect, useState, useRef } from "react";
import api from "/src/api/axios";
import toast from "react-hot-toast";

const AdvertRequestsAdmin = () => {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/advert-requests");
        setAdverts(data);
      } catch (err) {
        toast.error("Failed to load advert requests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/advert-requests/${id}/status`, { status });
      toast.success(`Advert ${status}`);
      setAdverts(adverts => adverts.map(a => a.id === id ? { ...a, status } : a));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const markPaid = async (id, payment_method, payment_reference) => {
    try {
      await api.patch(`/api/advert-requests/${id}/mark-paid`, { payment_method, payment_reference });
      toast.success("Payment recorded");
      setAdverts(adverts => adverts.map(a => a.id === id ? { ...a, status: "paid", payment_method, payment_reference } : a));
    } catch {
      toast.error("Failed to record payment");
    }
  };

  // UI state for expand/collapse per card + payment form toggles (mobile-friendly)
  const [expanded, setExpanded] = useState({});
  const [showPaymentForm, setShowPaymentForm] = useState({});

  // refs used for animation & focus management
  const detailsRef = useRef({});
  const paymentRef = useRef({});
  const paymentInputRef = useRef({});

  // Focus management: when a details panel opens, focus the region; when payment opens, focus the payment input
  useEffect(() => {
    Object.keys(expanded).forEach(k => {
      if (expanded[k] && detailsRef.current[k]) {
        // brief timeout so transition has started and element exists in DOM
        setTimeout(() => {
          detailsRef.current[k].focus();
        }, 120);
      }
    });
  }, [expanded]);

  useEffect(() => {
    Object.keys(showPaymentForm).forEach(k => {
      if (showPaymentForm[k] && paymentInputRef.current[k]) {
        // small delay to allow the maxHeight transition to start
        setTimeout(() => {
          paymentInputRef.current[k].focus();
        }, 120);
      }
    });
  }, [showPaymentForm]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Advert Requests</h2>
      {adverts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No requests found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adverts.map(advert => (
            <div key={advert.id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between">
              <div>
                <div className="sm:flex sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between sm:block">
                      <h3 className="text-lg font-semibold text-gray-800">{advert.business_name}</h3>
                      {/* small toggle for mobile to expand details */}
                      <div className="sm:hidden">
                        <button
                          id={`toggle-details-${advert.id}`}
                          aria-expanded={!!expanded[advert.id]}
                          aria-controls={`details-${advert.id}-mobile`}
                          onClick={() => setExpanded(prev => ({ ...prev, [advert.id]: !prev[advert.id] }))}
                          className="text-xs text-gray-500 hover:text-gray-700 ml-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded px-1"
                        >
                          {expanded[advert.id] ? 'Hide' : 'Details'}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-2 sm:mt-1 line-clamp-3">{advert.advert_details}</div>
                  </div>

                  <div className="flex-shrink-0 text-right ml-2 mt-3 sm:mt-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${advert.status === "pending" ? "bg-yellow-100 text-yellow-800" : advert.status === "approved" ? "bg-green-100 text-green-800" : advert.status === "rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>{advert.status}</span>
                  </div>
                </div>

                {/* Expanded details — visible on larger screens or toggled on mobile */}
                {/* Desktop: always show details; Mobile: show only if expanded */}
                <div className="mt-3 text-sm text-gray-700 hidden sm:block" id={`details-${advert.id}`} aria-hidden={false}>
                  <div className="font-medium">Contact</div>
                  <div className="mt-1">{advert.contact_name}</div>
                  <div className="text-xs text-gray-500">{advert.contact_email} • {advert.contact_phone}</div>
                </div>

                {/* animated collapse for mobile details — always render content so we can animate smoothly */}
                <div
                  id={`details-${advert.id}-mobile`}
                  role="region"
                  aria-labelledby={`toggle-details-${advert.id}`}
                  className="sm:hidden overflow-hidden"
                  ref={el => { detailsRef.current[advert.id] = el }}
                  style={{
                    maxHeight: expanded[advert.id] ? `${detailsRef.current[advert.id]?.scrollHeight || 220}px` : '0px',
                    opacity: expanded[advert.id] ? 1 : 0,
                    transition: 'max-height 220ms ease, opacity 180ms ease'
                  }}
                >
                  <div tabIndex={-1} id={`contact-${advert.id}`} className="mt-3 text-sm text-gray-700">
                    <div className="font-medium">Contact</div>
                    <div className="mt-1">{advert.contact_name}</div>
                    <div className="text-xs text-gray-500">{advert.contact_email} • {advert.contact_phone}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {advert.status === "pending" && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button aria-label={`Approve ${advert.business_name}`} className="w-full sm:w-auto px-3 py-2 bg-green-600 text-white rounded text-sm font-semibold" onClick={() => updateStatus(advert.id, "approved")}>Approve</button>
                    <button aria-label={`Reject ${advert.business_name}`} className="w-full sm:w-auto px-3 py-2 bg-red-600 text-white rounded text-sm font-semibold" onClick={() => updateStatus(advert.id, "rejected")}>Reject</button>
                  </div>
                )}

                {advert.status === "approved" && (
                  <div className="mt-2">
                    {/* Mobile-friendly toggle for payment form */}
                      <div className="sm:hidden mb-2">
                        <button
                          id={`toggle-payment-${advert.id}`}
                          className="w-full px-3 py-2 rounded-md border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          onClick={() => setShowPaymentForm(prev => ({ ...prev, [advert.id]: !prev[advert.id] }))}
                          aria-expanded={!!showPaymentForm[advert.id]}
                          aria-controls={`payment-form-${advert.id}`}
                          aria-label={`Toggle payment form for ${advert.business_name}`}
                        >
                          {showPaymentForm[advert.id] ? 'Hide payment' : 'Mark Payment Received'}
                        </button>
                      </div>

                    <div
                      id={`payment-form-${advert.id}`}
                      className={`sm:block border rounded p-3 transition-all duration-200`}
                      ref={el => { paymentRef.current[advert.id] = el }}
                      style={{
                        maxHeight: (showPaymentForm[advert.id] || window.innerWidth >= 640) ? `${paymentRef.current[advert.id]?.scrollHeight || 420}px` : '0px',
                        opacity: (showPaymentForm[advert.id] || window.innerWidth >= 640) ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 220ms ease, opacity 160ms ease'
                      }}
                      aria-hidden={!showPaymentForm[advert.id] && window.innerWidth < 640}
                      role="region"
                      aria-labelledby={`toggle-payment-${advert.id}`}
                    > 
                      <form onSubmit={e => {
                        e.preventDefault();
                        const payment_method = e.target.payment_method.value;
                        const payment_reference = e.target.payment_reference.value;
                        markPaid(advert.id, payment_method, payment_reference);
                      }} className="flex flex-col gap-2">
                        <label className="sr-only" htmlFor={`payment-method-${advert.id}`}>Payment method</label>
                        <select id={`payment-method-${advert.id}`} name="payment_method" aria-label="Payment method" className="border rounded px-2 py-1 w-full text-sm" required ref={el => { paymentInputRef.current[advert.id] = el }}>
                          <option value="momo">MTN Mobile Money</option>
                          <option value="card">Card (Mastercard / Visa)</option>
                          <option value="manual">Manual</option>
                        </select>
                        <label className="sr-only" htmlFor={`payment-ref-${advert.id}`}>Payment reference</label>
                        <input id={`payment-ref-${advert.id}`} name="payment_reference" aria-label="Payment reference" placeholder="Payment Reference" className="border rounded px-2 py-1 text-sm" required />
                        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded w-full text-sm font-semibold">Mark Paid</button>
                      </form>
                    </div>
                  </div>
                )}

                {advert.status === "paid" && (
                  <div className="text-center text-green-700 font-bold mt-2">Paid</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertRequestsAdmin;
