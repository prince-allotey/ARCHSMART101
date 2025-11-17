// src/api/config.js

// Derive sensible runtime defaults when env vars are missing (e.g., on cPanel)
const inferBackendOrigin = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') {
    const { protocol } = window.location;
    const host = window.location.host;
    // If frontend is archsmart.indiginfoundation.com, backend is archsmartadm.indiginfoundation.com
    if (/archsmart\.indiginfoundation\.com$/i.test(host)) {
      return `${protocol}//archsmartadm.indiginfoundation.com`;
    }
  }
  return "http://localhost:8000";
};

// ✅ Full backend origin (for CSRF, cookies, etc.)
export const BACKEND_ORIGIN = inferBackendOrigin();

// ✅ Public asset base (Laravel: storage/app/public -> public/storage)
export const ASSET_BASE_URL = (import.meta.env.VITE_ASSET_URL) || `${BACKEND_ORIGIN}/storage`;

// Load a small manifest of images that live in the frontend `public/images/blogs` folder.
// If a blog image exists in the frontend public folder we prefer serving it directly
// from `/images/blogs/...` to avoid unnecessary requests to the backend media API and
// to prevent 404s when the backend storage is out-of-sync in development.
let PUBLIC_BLOG_IMAGES = [];
try {
  // Vite supports importing JSON files; this file is generated from the repo's public folder.
  // If it doesn't exist, we silently fall back to an empty list.
  // Note: keep path relative to this file: src/api -> ../data/publicBlogImages.json
  // We wrap in try/catch so code stays robust if the JSON isn't present.
  // (The JSON file will be created in the repo to list existing public blog images.)
  // dynamic import via require-like syntax is avoided to keep bundlers happy; static import
  // would also work but we want the surrounding try/catch here.
  // Use `await import` isn't allowed at top-level in this file, so we use a synchronous approach
  // by attempting to read the JSON via a static inline require-like reference which Vite handles.
  // The following works with Vite: import.meta.glob or static JSON import — we'll use static import
  // by requiring the path; if the environment doesn't support it, the try/catch prevents a crash.
  // IMPORTANT: keep this `require` guarded.
  PUBLIC_BLOG_IMAGES = require('../data/publicBlogImages.json');
} catch (e) {
  PUBLIC_BLOG_IMAGES = [];
}

let PUBLIC_PROPERTY_IMAGES = [];
try {
  PUBLIC_PROPERTY_IMAGES = require('../data/publicPropertyImages.json');
} catch (e) {
  PUBLIC_PROPERTY_IMAGES = [];
}

let PUBLIC_PROFILE_IMAGES = [];
try {
  PUBLIC_PROFILE_IMAGES = require('../data/publicProfileImages.json');
} catch (e) {
  PUBLIC_PROFILE_IMAGES = [];
}

const hasPublicBlogImage = (filename) => {
  if (!filename) return false;
  try {
    const f = filename.split('?')[0].split('#')[0];
    return PUBLIC_BLOG_IMAGES.includes(f);
  } catch (e) {
    return false;
  }
};

const hasPublicPropertyImage = (filename) => {
  if (!filename) return false;
  try {
    const f = filename.split('?')[0].split('#')[0];
    return PUBLIC_PROPERTY_IMAGES.includes(f);
  } catch (e) {
    return false;
  }
};

const hasPublicProfileImage = (filename) => {
  if (!filename) return false;
  try {
    const f = filename.split('?')[0].split('#')[0];
    return PUBLIC_PROFILE_IMAGES.includes(f);
  } catch (e) {
    return false;
  }
};

// ✅ Resolve asset URLs to backend storage (legacy /images prefix removed)
// Rules:
// 1. Absolute http(s) URLs are returned unchanged
// 2. Paths beginning with /storage/ are already public (symlink) => prefix BACKEND_ORIGIN
// 3. Any other root-relative path (/properties/xyz.jpg) assumed inside storage/app/public
export const assetUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return path;
  // Absolute URLs pass through
  if (/^https?:\/\//i.test(path)) {
    // If the absolute URL points at the backend's /storage/*, route known folders
    // via the API media endpoints so requests go through Laravel and receive CORS headers.
    try {
      const url = new URL(path);
      const base = `${url.protocol}//${url.host}`;
      if (base === BACKEND_ORIGIN || path.startsWith(BACKEND_ORIGIN)) {
        const storageIndex = path.indexOf('/storage/');
        if (storageIndex !== -1) {
          const after = path.slice(storageIndex + '/storage/'.length);
          if (after.startsWith('profile_pictures/')) {
            const filename = after.slice('profile_pictures/'.length);
            if (hasPublicProfileImage(filename)) return `/images/profile_pictures/${filename}`;
            return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
          }
          if (after.startsWith('properties/')) {
            const filename = after.slice('properties/'.length);
            if (hasPublicPropertyImage(filename)) return `/images/properties/${filename}`;
            return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
          }
          if (after.startsWith('blog/') || after.startsWith('blogs/')) {
            const filename = after.replace(/^blogs?\//, '');
            // Prefer frontend public images when present to avoid backend 404s.
            if (hasPublicBlogImage(filename)) return `/images/blogs/${filename}`;
            // Serve blog images through media API so CORS headers are applied
            return `${BACKEND_ORIGIN}/api/media/blogs/${filename}`;
          }
        }
      }
    } catch (e) {
      // ignore URL parsing errors and fall back to returning the absolute path
    }
    return path;
  }

  // Keep frontend-rooted static assets (e.g. `/images/...`, `/smartliving/...`) as-is so
  // the dev server / frontend can serve legacy static files from `public/`.
  if (path.startsWith('/')) {
    // If the path explicitly targets Laravel's public storage symlink, prefer routing
    // certain folders through the API media endpoint so CORS is applied.
    if (path.startsWith('/storage/') || path.startsWith('/uploads/')) {
      // profile pictures and property images are routed via the media API
      if (path.includes('/profile_pictures/')) {
        const parts = path.split('/profile_pictures/');
        const filename = parts[1] || '';
        if (hasPublicProfileImage(filename)) return `/images/profile_pictures/${filename}`;
        return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
      }
      if (path.includes('/properties/')) {
        const parts = path.split('/properties/');
        const filename = parts[1] || '';
        if (hasPublicPropertyImage(filename)) return `/images/properties/${filename}`;
        return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
      }
      return `${BACKEND_ORIGIN}${path}`;
    }
    // Map known frontend public image folders to the `public/images` directory
    // so `/smartliving/foo.jpg` -> `/images/smartliving/foo.jpg` where files live
    const knownFrontFolders = ['smartliving', 'blogs', 'services', 'properties', 'images', 'profile_pictures'];
    const withoutLead = path.replace(/^\//, '');
    const firstSegment = withoutLead.split('/')[0];
    // if someone requested a common placeholder filename that doesn't exist yet,
    // map it to an available fallback image so cards don't break.
    if (withoutLead === 'properties/placeholder.jpg' || withoutLead === 'properties/placeholder.png') {
      return '/images/properties/1.jpg';
    }

    if (knownFrontFolders.includes(firstSegment)) {
      return `/images/${withoutLead}`;
    }
    // For other root-relative paths, return as-is (frontend public)
    return path;
  }

  // Non-root-relative paths (e.g. 'properties/foo.jpg' or 'blogs/foo.jpg') are treated as
  // Non-root-relative paths (e.g. 'properties/foo.jpg' or 'blogs/foo.jpg')
  // If they reference known frontend folders, map to `public/images` too.
  const trimmed = path.replace(/^\/+/, '');
  const firstSegment = trimmed.split('/')[0];
  const knownFrontFolders = ['smartliving', 'blogs', 'services', 'properties', 'images', 'profile_pictures'];
  if (knownFrontFolders.includes(firstSegment)) {
    return `/images/${trimmed}`;
  }
  // otherwise assume it's a backend storage path
  return `${BACKEND_ORIGIN}/storage/${trimmed}`;
};

// ✅ Normalize any uploaded/storage path from API into a full accessible URL
// Handles common Laravel return values: 
// - '/storage/...', 'storage/...', 'public/...', 'blogs/...', 'blog_images/...', 'profile_pictures/...', 'properties/...', 'uploads/...'
export const resolveUploadedUrl = (input) => {
  if (!input) return '';
  if (typeof input !== 'string') return input;
  const src = input.trim();
  // If it's an absolute URL, try to rewrite backend storage URLs to the media API
  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src);
      const base = `${url.protocol}//${url.host}`;
      if (base === BACKEND_ORIGIN || src.startsWith(BACKEND_ORIGIN)) {
        const storageIndex = src.indexOf('/storage/');
        if (storageIndex !== -1) {
          const after = src.slice(storageIndex + '/storage/'.length);
          if (after.startsWith('profile_pictures/')) {
            const filename = after.slice('profile_pictures/'.length);
            if (hasPublicProfileImage(filename)) return `/images/profile_pictures/${filename}`;
            return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
          }
          if (after.startsWith('properties/')) {
            const filename = after.slice('properties/'.length);
            if (hasPublicPropertyImage(filename)) return `/images/properties/${filename}`;
            return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
          }
        }
      }
    } catch (e) {
      // fallthrough and return absolute src unchanged
    }
    return src;
  }

  // Already public storage path
  // Already public storage path
  if (src.startsWith('/storage/')) {
    // map profile pictures and properties to API route so CORS middleware runs (avoids opaque responses)
    if (src.includes('/profile_pictures/')) {
      const parts = src.split('/profile_pictures/');
      const filename = parts[1] || '';
      if (hasPublicProfileImage(filename)) return `/images/profile_pictures/${filename}`;
      return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
    }
    if (src.includes('/properties/')) {
      const parts = src.split('/properties/');
      const filename = parts[1] || '';
      if (hasPublicPropertyImage(filename)) return `/images/properties/${filename}`;
      return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
    }
    if (src.includes('/blog/') || src.includes('/blogs/')) {
      const parts = src.split(/\/blog(?:s)?\//);
      const filename = parts[1] || '';
      if (hasPublicBlogImage(filename)) return `/images/blogs/${filename}`;
      return `${BACKEND_ORIGIN}/api/media/blogs/${filename}`;
    }
    return `${BACKEND_ORIGIN}${src}`;
  }
  if (src.startsWith('storage/')) {
    if (src.includes('profile_pictures/')) {
      const parts = src.split('profile_pictures/');
      const filename = parts[1] || '';
      if (hasPublicProfileImage(filename)) return `/images/profile_pictures/${filename}`;
      return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
    }
    if (src.includes('properties/')) {
      const parts = src.split('properties/');
      const filename = parts[1] || '';
      if (hasPublicPropertyImage(filename)) return `/images/properties/${filename}`;
      return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
    }
    if (src.includes('blog/') || src.includes('blogs/')) {
      const parts = src.split(/blog(?:s)?\//);
      const filename = parts[1] || '';
      if (hasPublicBlogImage(filename)) return `/images/blogs/${filename}`;
      return `${BACKEND_ORIGIN}/api/media/blogs/${filename}`;
    }
    return `${BACKEND_ORIGIN}/${src}`;
  }

  // Laravel stored path on 'public' disk => map to /storage
  if (src.startsWith('public/')) {
    return `${BACKEND_ORIGIN}/storage/${src.slice('public/'.length)}`;
  }
  if (src.startsWith('/public/')) {
    return `${BACKEND_ORIGIN}/storage/${src.slice('/public/'.length)}`;
  }

  // Known upload folders in storage/app/public
  const storageRoots = ['blogs/', '/blogs/', 'blog/', '/blog/', 'blog_images/', '/blog_images/', 'profile_pictures/', '/profile_pictures/', 'properties/', '/properties/'];
  for (const root of storageRoots) {
    if (src.startsWith(root)) {
      const trimmed = src.replace(/^\//, '');
      // Route profile pictures and properties via API media endpoint
      if (trimmed.startsWith('profile_pictures/')) {
        const filename = trimmed.slice('profile_pictures/'.length);
        if (hasPublicProfileImage(filename)) return `/images/profile_pictures/${filename}`;
        return `${BACKEND_ORIGIN}/api/media/profile_pictures/${filename}`;
      }
      if (trimmed.startsWith('properties/')) {
        const filename = trimmed.slice('properties/'.length);
        if (hasPublicPropertyImage(filename)) return `/images/properties/${filename}`;
        return `${BACKEND_ORIGIN}/api/media/properties/${filename}`;
      }
      if (trimmed.startsWith('blog/') || trimmed.startsWith('blogs/')) {
        const filename = trimmed.replace(/^blogs?\//, '');
        if (hasPublicBlogImage(filename)) return `/images/blogs/${filename}`;
        return `${BACKEND_ORIGIN}/api/media/blogs/${filename}`;
      }
      return `${BACKEND_ORIGIN}/storage/${trimmed}`;
    }
  }

  // Public/uploads directly under Laravel public dir
  if (src.startsWith('/uploads/')) return `${BACKEND_ORIGIN}${src}`;

  // If it's a fully root-relative path (e.g. '/something.jpg') map to backend origin
  if (src.startsWith('/')) return `${BACKEND_ORIGIN}${src}`;

  // Fallback: assume it's a storage path relative to storage/app/public
  const trimmed = src.replace(/^\/+/, '');
  return `${BACKEND_ORIGIN}/storage/${trimmed}`;
};

// ✅ Base URL for your Laravel backend API
export const API_BASE_URL = (import.meta.env.VITE_API_URL) || `${BACKEND_ORIGIN}/api`;

// ✅ API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    USER: "/auth/user",
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
