import React, { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Eye, Send, CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function DashboardInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    search: "",
  });

  useEffect(() => {
    fetchInquiries();
  }, [filters]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.type) params.append("type", filters.type);
      if (filters.search) params.append("search", filters.search);

      const response = await api.get(`/api/inquiries?${params.toString()}`);
      setInquiries(response.data.data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setSendingReply(true);
    try {
      const response = await api.put(`/api/inquiries/${selectedInquiry.id}`, {
        status: "responded",
        response_message: replyMessage,
      });

      toast.success("Reply sent successfully!");
      setReplyMessage("");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await api.put(`/api/inquiries/${inquiryId}`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      responded: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return badges[status] || badges.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      responded: <CheckCircle className="w-4 h-4" />,
      closed: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || icons.pending;
  };

  const getTypeBadge = (type) => {
    const badges = {
      "property-inquiry": "bg-blue-100 text-blue-800",
      "investment-consultation": "bg-purple-100 text-purple-800",
      "smart-home": "bg-green-100 text-green-800",
      "interior-design": "bg-pink-100 text-pink-800",
      general: "bg-gray-100 text-gray-800",
    };
    return badges[type] || badges.general;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Inquiries</h1>
        <p className="text-gray-600">Manage and respond to customer messages</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search inquiries..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="property-inquiry">Property Inquiry</option>
              <option value="investment-consultation">Investment Consultation</option>
              <option value="smart-home">Smart Home</option>
              <option value="interior-design">Interior Design</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: "", type: "", search: "" })}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-800">
                {inquiries.filter((i) => i.status === "pending").length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Responded</p>
              <p className="text-3xl font-bold text-green-800">
                {inquiries.filter((i) => i.status === "responded").length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Closed</p>
              <p className="text-3xl font-bold text-gray-800">
                {inquiries.filter((i) => i.status === "closed").length}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-gray-500" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-3xl font-bold text-blue-800">{inquiries.length}</p>
            </div>
            <Mail className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No inquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {inquiry.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{inquiry.subject}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{inquiry.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(
                          inquiry.type
                        )}`}
                      >
                        {inquiry.type.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          inquiry.status
                        )}`}
                      >
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        {inquiry.status === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setReplyMessage("");
                            }}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <Send className="w-4 h-4" />
                            Reply
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View/Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
                <button
                  onClick={() => {
                    setSelectedInquiry(null);
                    setReplyMessage("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                    selectedInquiry.status
                  )}`}
                >
                  {getStatusIcon(selectedInquiry.status)}
                  {selectedInquiry.status}
                </span>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(
                    selectedInquiry.type
                  )}`}
                >
                  {selectedInquiry.type.replace("-", " ")}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Customer Info */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <strong className="text-gray-700">Name:</strong>
                    <span className="text-gray-900">{selectedInquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <strong className="text-gray-700">Email:</strong>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <strong className="text-gray-700">Phone:</strong>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <strong className="text-gray-700">Date:</strong>
                    <span className="text-gray-900">
                      {new Date(selectedInquiry.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject & Message */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Subject</h3>
                <p className="text-gray-900 font-medium">{selectedInquiry.subject}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Previous Response */}
              {selectedInquiry.response_message && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Response</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedInquiry.response_message}
                    </p>
                    {selectedInquiry.responded_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Sent on {new Date(selectedInquiry.responded_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              {selectedInquiry.status !== "closed" && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {selectedInquiry.status === "responded" ? "Send Another Reply" : "Send Reply"}
                  </h3>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyMessage.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {sendingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h3>
                <div className="flex gap-2">
                  {selectedInquiry.status !== "pending" && (
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, "pending")}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      Mark as Pending
                    </button>
                  )}
                  {selectedInquiry.status !== "responded" && (
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, "responded")}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Mark as Responded
                    </button>
                  )}
                  {selectedInquiry.status !== "closed" && (
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, "closed")}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close Inquiry
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
