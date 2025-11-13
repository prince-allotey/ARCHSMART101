import React, { useState } from "react";

export default function AuthForm({ title, fields, onSubmit, submitText, redirectText, redirectLink, initialValues }) {
  const initialData = fields.reduce((acc, field) => { acc[field.name] = ""; return acc; }, {});
  const [formData, setFormData] = useState({ ...initialData, ...(initialValues || {}) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setMessage(null); setLoading(true);
    try { await onSubmit(formData); } catch (err) { setError(err.message || "Something went wrong"); } finally { setLoading(false); }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          {fields.map((field) => field.type === "select" ? (
            <select key={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {field.placeholder && <option value="">{field.placeholder}</option>}
              {field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ) : (
            <input key={field.name} type={field.type || "text"} name={field.name} placeholder={field.placeholder || field.label} value={formData[field.name]} onChange={handleChange} className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          ))}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mt-4">
          {loading ? "Please wait..." : submitText}
        </button>
        {redirectText && redirectLink && (
          <p className="text-center text-sm mt-4 text-gray-600">{redirectText} <a href={redirectLink} className="text-blue-600 hover:underline">{redirectLink}</a></p>
        )}
      </form>
    </div>
  );
}
