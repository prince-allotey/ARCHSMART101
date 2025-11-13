import React, { useEffect, useState } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import api from "../api/axios";

export default function DashboardUser() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/api/properties");
        setProperties(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-sm text-gray-600">Quick view of available properties and account info.</p>
        </header>

        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Properties</h2>

          {loading ? (
            <div>Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-gray-500">No properties found.</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((p) => {
                const backendOrigin = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
                const firstImage = Array.isArray(p.image_urls) && p.image_urls.length ? p.image_urls[0] : (Array.isArray(p.images) ? p.images[0] : null);
                const resolveImage = () => {
                  if (!firstImage) return null;
                  if (/^https?:\/\//i.test(firstImage)) return firstImage;
                  if (firstImage.startsWith('/storage/')) return `${backendOrigin}${firstImage}`;
                  if (!firstImage.startsWith('/')) return `${backendOrigin}/storage/${firstImage}`;
                  return firstImage;
                };
                return (
                  <li key={p.id} className="border rounded p-4 bg-gray-50">
                    {resolveImage() && (
                      <img
                        src={resolveImage()}
                        alt={p.title}
                        className="w-full h-32 object-cover rounded mb-2"
                        onError={(e)=>{e.currentTarget.src='/images/properties/placeholder.jpg';}}
                      />
                    )}
                    <h3 className="font-semibold">{p.title || p.name || 'Unnamed'}</h3>
                    <p className="text-sm text-gray-600">{p.location || p.address || '—'}</p>
                    <p className="mt-2 text-indigo-600 font-semibold">GHS {p.price ? Number(p.price).toLocaleString() : '—'}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
