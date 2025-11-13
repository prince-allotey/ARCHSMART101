// src/api/agentApi.js
import api from "./axios";

export const getAgentProperties = async () => {
  // Use authenticated 'my properties' endpoint which returns properties for the logged-in user
  const { data } = await api.get("/api/properties/my");
  return data;
};

export const deleteProperty = async (id) => {
  await api.delete(`/api/properties/${id}`);
};
