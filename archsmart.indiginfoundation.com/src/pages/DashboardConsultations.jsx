import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const statusBadge = {
  pending: "bg-yellow-100 text-yellow-800",
  responded: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};
const statusIcon = {
  pending: <Clock className="w-4 h-4" />,
  responded: <CheckCircle className="w-4 h-4" />,
  closed: <XCircle className="w-4 h-4" />,
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString();
};

export default function DashboardConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [selected, setSelected] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [statusSelection, setStatusSelection] = useState("pending");
  const [sending, setSending] = useState(false);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/consultations?limit=50");
      const data = Array.isArray(response?.data?.data) ? response.data.data : [];
      setConsultations(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      if (filters.search) {
        const value = filters.search.toLowerCase();
        return [item.name, item.email, item.phone, item.message]
          .filter(Boolean)
          .some((part) => part.toLowerCase().includes(value));
      }
      return true;
    });
  }, [consultations, filters]);

  const stats = useMemo(() => {
    const tally = { pending: 0, responded: 0, closed: 0 };
    consultations.forEach((item) => {
      if (item.status && tally[item.status] >= 0) {
        tally[item.status] += 1;
      }
    });
    return {
      ...tally,
      total: consultations.length,
    };
  }, [consultations]);

  const openModal = (item) => {
    setSelected(item);
    setReplyMessage(item.response_message || "");
    setStatusSelection(item.status || "pending");
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSending(true);
    try {
      const payload = {
        status: statusSelection,
        response_message: replyMessage.trim() || null,
      };
      const response = await api.put(`/api/consultations/${selected.id}`, payload);
      toast.success(response.data?.message || "Consultation updated");
      const updated = response.data?.data;
      if (updated) {
        setConsultations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setSelected(updated);
      }
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast.error("Failed to update consultation");
    } finally {
      setSending(false);
    }
  };

  const resetModal = () => {
    setSelected(null);
    setReplyMessage("");
    setStatusSelection("pending");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultation Requests</h1>
        <p className="text-sm text-gray-600">Reply to customers just like the inquiries dashboard.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">Responded</p>
            <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">Closed</p>
            <p className="text-2xl font-bold text-gray-700">{stats.closed}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" /> Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, phone"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" /> Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={fetchConsultations}
              className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Refresh list
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Loading consultations...
                  </td>
                </tr>
              ) : filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No consultations found.
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {item.email}
                      </div>
                      {item.phone && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {item.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {item.message || "No message provided."}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${statusBadge[item.status] || statusBadge.pending}`}>
                        {statusIcon[item.status] || statusIcon.pending}
                        {item.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(item)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> View / Reply
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Respond to {selected.name}</h2>
              <button onClick={resetModal} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{selected.email}</p>
              </div>
              {selected.phone && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900 font-medium">{selected.phone}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="text-gray-900 font-medium">{formatDateTime(selected.created_at)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Original Message</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">{selected.message || "No message provided."}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusSelection}
                  onChange={(e) => setStatusSelection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Message</label>
                <textarea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type a response that will be logged here."
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:cursor-wait disabled:bg-gray-400"
                >
                  {sending ? "Saving…" : "Save Response"}
                </button>
                <button
                  onClick={resetModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
