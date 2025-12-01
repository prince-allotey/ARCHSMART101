import api from "./axios";

const API_URL = "/api";

// Backend routes use `blog-posts` prefix
export const fetchBlogs = async () => {
  const response = await api.get(`${API_URL}/blog-posts`);
  let data = response.data;
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.data)) {
    return data.data;
  } else {
    console.warn("/api/blog-posts did not return an array", data);
    return [];
  }
};

// Admin-only: fetch all posts (draft and published)
export const fetchBlogsAdmin = async () => {
  const response = await api.get(`${API_URL}/admin/blog-posts`);
  return response.data;
};

export const createBlog = async (blogData) => {
  // If a FormData is provided (file uploads), set proper headers.
  const config = blogData instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const response = await api.post(`${API_URL}/blog-posts`, blogData, config);
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  if (blogData instanceof FormData) {
    if (!blogData.has('_method')) blogData.append('_method', 'PUT');
    const response = await api.post(`${API_URL}/blog-posts/${id}`, blogData, { headers: { "Content-Type": "multipart/form-data" } });
    return response.data;
  }
  const response = await api.put(`${API_URL}/blog-posts/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id) => {
  await api.delete(`${API_URL}/blog-posts/${id}`);
};

export const fetchBlog = async (slug) => {
  const response = await api.get(`${API_URL}/blog-posts/${slug}`);
  return response.data;
};