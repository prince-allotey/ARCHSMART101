// src/api/config.js

/**
 * Determines the backend API base URL:
 * 1. Environment variable
 * 2. Infer from current frontend host
 * 3. Default production URL
 */
const inferBackendOrigin = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    const { protocol, host } = window.location;
    if (host.toLowerCase().endsWith('archsmart.indiginfoundation.com')) {
      return `${protocol}//archsmartadm.indiginfoundation.com`;
    }
  }

  return "https://archsmartadm.indiginfoundation.com";
};

// Full backend origin (CSRF, cookies, API)
export const BACKEND_ORIGIN = inferBackendOrigin();

// Public asset base URL (Laravel storage/public)
export const ASSET_BASE_URL = import.meta.env.VITE_ASSET_URL || `${BACKEND_ORIGIN}/storage`;

// Known public image folders
const KNOWN_FOLDERS = ['smartliving', 'blogs', 'services', 'properties', 'images', 'profile_pictures'];

// Normalize filenames by stripping query/hash
const normalize = (path) => path?.split('?')[0].split('#')[0].replace(/^\/+/, '');

// Map certain paths to frontend public images
const mapToPublicImages = (path) => {
  const trimmed = normalize(path);
  if (!trimmed) return null;
  // If it already starts with 'images/', don't prepend another '/images/'
  if (trimmed.startsWith('images/')) return `/${trimmed}`;
  const first = trimmed.split('/')[0];
  if (KNOWN_FOLDERS.includes(first)) return `/images/${trimmed}`;
  return null;
};

// Load optional JSON manifests for pre-built public images
let PUBLIC_BLOG_IMAGES = [];
let PUBLIC_PROPERTY_IMAGES = [];
let PUBLIC_PROFILE_IMAGES = [];

try { PUBLIC_BLOG_IMAGES = require('../data/publicBlogImages.json'); } catch {}
try { PUBLIC_PROPERTY_IMAGES = require('../data/publicPropertyImages.json'); } catch {}
try { PUBLIC_PROFILE_IMAGES = require('../data/publicProfileImages.json'); } catch {}

// Check if a filename exists in a manifest
const hasPublicImage = (filename, manifest) => {
  if (!filename) return false;
  try { return manifest.includes(normalize(filename)); } catch { return false; }
};

// Resolve asset URLs to backend storage or public images
export const assetUrl = (path) => {
  if (!path) return '';

  // Absolute URLs pass through (except for backend storage handling)
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path);
      if (url.origin === BACKEND_ORIGIN) {
        const after = url.pathname.replace(/^\/storage\//, '');
        if (after.startsWith('profile_pictures/')) {
          const filename = after.slice('profile_pictures/'.length);
          return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
        }
        if (after.startsWith('properties/')) {
          const filename = after.slice('properties/'.length);
          return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
        }
        if (after.startsWith('blogs/') || after.startsWith('blog/')) {
          const filename = after.replace(/^blogs?\//, '');
          return `${BACKEND_ORIGIN}/api/media/blogs/${filename}`;
        }
        if (after.startsWith('images/')) {
          return `${BACKEND_ORIGIN}/storage/${after}`;
        }
      }
    } catch {}
    return path;
  }

  // Map known frontend folders to /images/
  const publicPath = mapToPublicImages(path);
  if (publicPath) return publicPath;

  // Laravel storage paths - prioritize backend storage/images over local
  const trimmed = path.replace(/^\/+/, '');
  if (trimmed.startsWith('profile_pictures/')) {
    const filename = trimmed.slice('profile_pictures/'.length);
    return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
  }
  if (trimmed.startsWith('properties/')) {
    const filename = trimmed.slice('properties/'.length);
    return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
  }
  if (trimmed.startsWith('blogs/') || trimmed.startsWith('blog/')) {
    const filename = trimmed.replace(/^blogs?\//, '');
    return `${BACKEND_ORIGIN}/api/media/blogs/${filename}`;
  }
  if (trimmed.startsWith('smartliving/')) {
    const filename = trimmed.slice('smartliving/'.length);
    return `${BACKEND_ORIGIN}/images/smartliving/${filename}`;
  }
  if (trimmed.startsWith('services/')) {
    const filename = trimmed.slice('services/'.length);
    return `${BACKEND_ORIGIN}/storage/images/services/${filename}`;
  }

  // Default to backend storage
  return `${BACKEND_ORIGIN}/storage/${trimmed}`;
};

const preferPublicOrMedia = (folder, filename, manifest) => {
  const normalized = normalize(filename);
  if (!normalized) return '';
  // Always use backend storage/images now
  const mediaPath = `${BACKEND_ORIGIN}/api/media/${folder}/${normalized}`;
  return mediaPath;
};

const handleStoragePath = (path) => {
  const trimmed = normalize(path);
  if (!trimmed) return `${BACKEND_ORIGIN}/storage`;
  if (trimmed.startsWith('profile_pictures/')) {
    const filename = trimmed.slice('profile_pictures/'.length);
    return preferPublicOrMedia('profile_pictures', filename, PUBLIC_PROFILE_IMAGES);
  }
  if (trimmed.startsWith('properties/')) {
    const filename = trimmed.slice('properties/'.length);
    return preferPublicOrMedia('properties', filename, PUBLIC_PROPERTY_IMAGES);
  }
  if (trimmed.startsWith('blog/') || trimmed.startsWith('blogs/')) {
    const filename = trimmed.replace(/^blogs?\//, '');
    return preferPublicOrMedia('blogs', filename, PUBLIC_BLOG_IMAGES);
  }
  return `${BACKEND_ORIGIN}/storage/${trimmed}`;
};

export const resolveUploadedUrl = (input) => {
  if (!input) return '';
  if (typeof input !== 'string') return input;
  const src = input.trim();

  // First check if it's already an absolute backend URL
  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src);
      if (url.origin === BACKEND_ORIGIN) {
        if (url.pathname.startsWith('/storage/')) {
          return handleStoragePath(url.pathname.slice('/storage/'.length));
        }
      }
    } catch {}
    return src;
  }

  // Handle storage paths - route to backend
  if (src.startsWith('/storage/')) {
    return handleStoragePath(src.slice('/storage/'.length));
  }
  if (src.startsWith('storage/')) {
    return handleStoragePath(src.slice('storage/'.length));
  }
  if (src.startsWith('public/')) {
    return `${BACKEND_ORIGIN}/storage/${normalize(src).replace(/^public\//, '')}`;
  }
  if (src.startsWith('/public/')) {
    return `${BACKEND_ORIGIN}/storage/${normalize(src).replace(/^\/public\//, '')}`;
  }

  const trimmed = normalize(src);
  
  // Route all folder paths to backend storage/images
  if (trimmed.startsWith('profile_pictures/')) {
    const filename = trimmed.slice('profile_pictures/'.length);
    return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
  }
  if (trimmed.startsWith('properties/')) {
    const filename = trimmed.slice('properties/'.length);
    return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
  }
  if (trimmed.startsWith('blogs/') || trimmed.startsWith('blog/')) {
    const filename = trimmed.replace(/^blogs?\//, '');
    return `${BACKEND_ORIGIN}/api/media/blogs/${filename}`;
  }
  if (trimmed.startsWith('smartliving/')) {
    const filename = trimmed.slice('smartliving/'.length);
    return `${BACKEND_ORIGIN}/storage/images/smartliving/${filename}`;
  }
  if (trimmed.startsWith('services/')) {
    const filename = trimmed.slice('services/'.length);
    return `${BACKEND_ORIGIN}/storage/images/services/${filename}`;
  }
  if (trimmed.startsWith('images/')) {
    return `${BACKEND_ORIGIN}/storage/${trimmed}`;
  }

  if (src.startsWith('/')) {
    return `${BACKEND_ORIGIN}${src}`;
  }

  return `${BACKEND_ORIGIN}/storage/${trimmed}`;
};

// Base URL for Laravel API
export const API_BASE_URL = import.meta.env.VITE_API_URL || BACKEND_ORIGIN;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    USER: "/user",
  },
  PROPERTIES: {
    LIST: "/properties",
    CREATE: "/properties",
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
  },
  BLOGS: {
    LIST: "/blog-posts",
    CREATE: "/blog-posts",
    UPDATE: (id) => `/blog-posts/${id}`,
    DELETE: (id) => `/blog-posts/${id}`,
  },
};
