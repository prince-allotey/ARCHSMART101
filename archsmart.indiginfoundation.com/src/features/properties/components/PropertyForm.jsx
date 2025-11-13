import React from "react";

const PropertyForm = ({ formData, setFormData, onSubmit, buttonLabel }) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <input
      type="text"
      placeholder="Title"
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
      required
    />
    <input
      type="text"
      placeholder="Location"
      value={formData.location}
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
      required
    />
    <input
      type="number"
      placeholder="Price"
      value={formData.price}
      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
      required
    />
    <input
      type="text"
      placeholder="Type (e.g. House, Land, Apartment)"
      value={formData.type}
      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
      required
    />
    <textarea
      placeholder="Description"
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
      rows={3}
    ></textarea>

    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
    >
      {buttonLabel}
    </button>
  </form>
);

export default PropertyForm;
