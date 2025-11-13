import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from 'react-hot-toast'

export default function AdminApprovals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/properties/pending");
      setItems(data || []);
      setUnauthorized(false);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setUnauthorized(true);
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/properties/${id}/approve`);
      fetch();
    } catch (err) {
      console.error(err);
      toast.error('Approve failed')
    }
  };

  if (loading) return <div>Loading pending properties...</div>;

  if (unauthorized) {
    return <div className="text-gray-500">Admin approval requires admin access.</div>;
  }

  if (items.length === 0) return <div className="text-gray-500">No pending properties.</div>;

  return (
    <div className="space-y-4">
      {items.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.location || p.address || '—'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleApprove(p.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
