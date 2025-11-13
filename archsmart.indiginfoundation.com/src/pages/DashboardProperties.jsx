import React, { useState, useEffect } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import TableCard from "../features/dashboard/components/TableCard";
import { Check, X, Pencil } from "lucide-react";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function DashboardProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // holds the property being edited
  const [saving, setSaving] = useState(false);

  const fetchProperties = async () => {
    try {
      // Use /api/properties/my for authenticated admins - returns all properties
      const response = await axios.get("/api/properties/my");
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApprove = async (property) => {
    try {
      await axios.post(`/api/properties/${property.id}/approve`);
      toast.success("Property approved");
      fetchProperties();
    } catch (error) {
      toast.error("Failed to approve property");
    }
  };

  const handleReject = async (property) => {
    try {
      await axios.post(`/api/properties/${property.id}/reject`);
      toast.success("Property rejected");
      fetchProperties();
    } catch (error) {
      toast.error("Failed to reject property");
    }
  };

  const openEdit = (row) => {
    const prop = properties.find((p) => p.id === row.id);
    if (!prop) return;
    // Initialize a shallow copy for editing
    setEditing({
      id: prop.id,
      title: prop.title || "",
      price: prop.price ?? "",
      location: prop.location || "",
      type: prop.type || "",
      bedrooms: prop.bedrooms ?? "",
      bathrooms: prop.bathrooms ?? "",
      size: prop.size ?? "",
      is_smart_home: !!prop.is_smart_home,
      description: prop.description || "",
    });
  };

  const closeEdit = () => setEditing(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing) return;
    try {
      setSaving(true);
      const payload = {
        title: editing.title,
        price: Number(editing.price) || 0,
        location: editing.location,
        type: editing.type,
        bedrooms: editing.bedrooms === "" ? null : Number(editing.bedrooms),
        bathrooms: editing.bathrooms === "" ? null : Number(editing.bathrooms),
        size: editing.size === "" ? null : Number(editing.size),
        is_smart_home: !!editing.is_smart_home,
        description: editing.description,
      };
      await axios.put(`/api/properties/${editing.id}`, payload);
      toast.success("Property updated");
      closeEdit();
      fetchProperties();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update property";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || ""}`}>
        {status}
      </span>
    );
  };

  const rows = properties.map((property) => ({
    id: property.id,
    cells: [
      property.title || "Untitled",
      `$${property.price?.toLocaleString() || "0"}`,
      property.location || "—",
      getStatusBadge(property.status),
      property.agent?.name || "Unknown",
    ],
  }));

  const actions = [
    {
      label: "Edit",
      icon: <Pencil className="w-4 h-4" />,
      variant: "primary",
      onClick: openEdit,
    },
    {
      label: "Approve",
      icon: <Check className="w-4 h-4" />,
      variant: "success",
      onClick: handleApprove,
    },
    {
      label: "Reject",
      icon: <X className="w-4 h-4" />,
      variant: "danger",
      onClick: handleReject,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all property listings</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : (
          <TableCard
            title="All Properties"
            subtitle={`${properties.length} total listings`}
            headers={["Title", "Price", "Location", "Status", "Agent"]}
            rows={rows}
            actions={actions}
          />
        )}
        {editing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit Property</h2>
                <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location (Address)</label>
                  <input
                    type="text"
                    value={editing.location}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <input
                    type="text"
                    value={editing.type}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input
                    type="number"
                    value={editing.bedrooms}
                    onChange={(e) => setEditing({ ...editing, bedrooms: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input
                    type="number"
                    value={editing.bathrooms}
                    onChange={(e) => setEditing({ ...editing, bathrooms: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size (sq ft)</label>
                  <input
                    type="number"
                    value={editing.size}
                    onChange={(e) => setEditing({ ...editing, size: e.target.value })}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    min={0}
                    step="0.01"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    id="isSmart"
                    type="checkbox"
                    checked={editing.is_smart_home}
                    onChange={(e) => setEditing({ ...editing, is_smart_home: e.target.checked })}
                  />
                  <label htmlFor="isSmart" className="text-sm text-gray-700">Smart Home</label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={4}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
