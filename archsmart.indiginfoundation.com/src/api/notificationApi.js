import api from "./axios";

export const getNotifications = async (limit = 20) => {
  const res = await api.get(`/api/notifications?limit=${limit}`);
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get(`/api/notifications/unread-count`);
  return res.data?.unread ?? 0;
};

export const markRead = async (id) => {
  await api.post(`/api/notifications/${id}/read`);
};

export const markAllRead = async () => {
  await api.post(`/api/notifications/read-all`);
};
