import api from "./axios";

const API_URL = "/api";

export const getAgentProperties = async () => {
  const response = await api.get(`${API_URL}/agent/properties`);
  return response.data;
};

export const getProperty = async (id) => {
  const response = await api.get(`${API_URL}/properties/${id}`);
  return response.data;
};

export const createProperty = async (propertyData) => {
  // propertyData may be FormData or JSON
  const response = await api.post(`${API_URL}/properties`, propertyData);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`${API_URL}/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  await api.delete(`${API_URL}/properties/${id}`);
};
