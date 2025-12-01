// src/api/property.js

import api from "./axios";

// Axios baseURL already includes /api

export const getAgentProperties = async () => {
  const response = await api.get("/api/properties/my");
  return response.data;
};

export const getProperty = async (id) => {
  const response = await api.get(`/api/properties/${id}`);
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await api.post("/api/properties", propertyData);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/api/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  await api.delete(`/api/properties/${id}`);
};
