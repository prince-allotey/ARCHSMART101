import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../../../api/blogApi";
import { resolveUploadedUrl, assetUrl, BACKEND_ORIGIN } from "../../../api/config";
import PUBLIC_BLOG_IMAGES from "../../../data/publicBlogImages.json";
import { Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const getCategoryColor = (category) => {
    const colors = {
      "real-estate": "bg-blue-100 text-blue-700",
      "smart-living": "bg-emerald-100 text-emerald-700",
      "interior-design": "bg-purple-100 text-purple-700",
      investment: "bg-amber-100 text-amber-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const slugify = (s) =>
    s?.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const resolveImageUrl = (src) => {
    const url = resolveUploadedUrl(src) || null;
    if (!url) return null;
    // If the resolved URL points at backend storage or our media API, add a small cache-bust
    // so freshly uploaded images appear quickly during development / after updates.
    try {
      if (url.includes('/api/media/') || url.includes('/storage/')) {
        return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
      }
    } catch (e) {
      // ignore
    }
    return url;
  };

  // Pick the best image URL for a post:
  // 1. If the post references a filename that exists in the frontend public images manifest, prefer `/images/blogs/<file>` (fast, avoids backend 404s)
  // 2. Else use the resolved uploaded URL (may point at backend media API)
  // 3. Else pick a deterministic rotating fallback from the public images list
  const getImageForPost = (post, index = 0) => {
    try {
      const raw = post?.image || post?.cover_image || null;
      // If raw contains a filename, check manifest
      if (raw && typeof raw === 'string') {
        // extract filename portion (strip query/hash)
        const parts = raw.split('/');
        const last = parts[parts.length - 1] || raw;
        const filename = last.split('?')[0].split('#')[0];
        if (filename && PUBLIC_BLOG_IMAGES && PUBLIC_BLOG_IMAGES.includes(filename)) {
          return `/images/blogs/${filename}`;
        }
        // try resolving to backend/media URL or frontend mapping
        const resolved = resolveImageUrl(raw);
        if (resolved) return resolved;
      }

      // Deterministic rotating fallback using the public images manifest (or a sensible default)
      const fallbacks = (PUBLIC_BLOG_IMAGES && PUBLIC_BLOG_IMAGES.length > 0) ? PUBLIC_BLOG_IMAGES : ['blog1.jpeg'];
      const pick = fallbacks[index % fallbacks.length];
      return `/images/blogs/${pick}`;
    } catch (e) {
      return '/images/blogs/blog1.jpeg';
    }
  };

  const fallbackBlogImage = (key, offset = 1) => {
    // deterministic selection of fallback blog images (blog1..blog5)
    const choices = [1,2,3,4,5];
    let seed = 0;
    try {
      const s = (key || '').toString();
      for (let i = 0; i < s.length; i++) seed = (seed * 31 + s.charCodeAt(i)) >>> 0;
    } catch (e) { seed = Date.now(); }
    const idx = (seed + offset) % choices.length;
    return `/blogs/blog${choices[idx]}.jpeg`;
  };

  const isRepairedDefault = (originalSrc, resolvedUrl) => {
    // If a previous repair set the image to a generic default like '/images/blogs/blog1.jpeg',
    // treat it as "missing" so each post can pick a deterministic fallback instead of all
    // rendering the same static placeholder.
    try {
      if (!originalSrc && !resolvedUrl) return true;
      const check = (s) => (s || '').toString();
      const a = check(originalSrc).toLowerCase();
      const b = check(resolvedUrl).toLowerCase();
      if (a.includes('blog1.jpeg') || b.includes('blog1.jpeg')) return true;
      // also consider the canonical repaired path used by the repair tool
      if (a.includes('/images/blogs/') && a.endsWith('.jpeg') && a.includes('blog')) return true;
    } catch (e) {
      // ignore
    }
    return false;
  };

  const enhancedHandleImgError = (e, post, fallbackOffset = 1) => {
    try {
      const img = e.currentTarget;
      // prevent infinite loops
      const attempts = parseInt(img.dataset.attempts || '0', 10) + 1;
      img.dataset.attempts = attempts;

      // If we've tried enough, apply final fallback
      if (attempts > 3 || img.__fallbackApplied) {
        img.__fallbackApplied = true;
        img.src = assetUrl(fallbackBlogImage(post?.id || post?.slug || post?.title, fallbackOffset));
        return;
      }

      const current = (img.src || '').toString();
      const filename = current.split('/').pop().split('?')[0].split('#')[0];

      // Attempt 1: if a local public copy exists, use it
      if (attempts === 1) {
        if (filename && Array.isArray(PUBLIC_BLOG_IMAGES) && PUBLIC_BLOG_IMAGES.includes(filename)) {
          img.src = `/images/blogs/${filename}`;
          return;
        }
        // Try stripping to backend storage path
        if (current.includes('/api/media/') && filename) {
          img.src = `${BACKEND_ORIGIN}/storage/blogs/${filename}`;
          return;
        }
      }

      // Attempt 2: try backend media endpoint with cache-bust
      if (attempts === 2) {
        if (filename) {
          img.src = `${BACKEND_ORIGIN}/api/media/blogs/${filename}?t=${Date.now()}`;
          return;
        }
      }

      // Final attempt: fallback image from assets
      img.__fallbackApplied = true;
      img.src = assetUrl(fallbackBlogImage(post?.id || post?.slug || post?.title, fallbackOffset));
    } catch (err) {
      try { e.currentTarget.src = assetUrl(fallbackBlogImage(post?.id || post?.slug || post?.title, fallbackOffset)); } catch (_) {}
    }
  };

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchBlogs();
        if (mounted) {
          if (!Array.isArray(data)) {
            console.warn("/api/blog-posts did not return an array", data);
            setPosts([]);
            return;
          }
          const normalized = data.map((p, idx) => ({
            // Ensure a stable unique id for React keys — prefer id, then _id, blog_id, slug, or index
            id: p.id ?? p._id ?? p.blog_id ?? p.slug ?? `post-${idx}`,
            title: p.title ?? "",
            excerpt: p.excerpt ?? p.summary ?? "",
            content: p.content ?? "",
            category: p.category ?? "general",
            image: p.image ?? p.cover_image ?? null,
            author: p.user?.name ?? p.author ?? "",
            readTime: p.read_time ?? p.readTime ?? null,
            publishedAt: p.published_at ?? p.publishedAt ?? p.created_at ?? null,
            slug: p.slug ?? null,
          }));
          setPosts(normalized);
          if (normalized.length === 0) {
            console.info("BlogSection: No published posts returned from API.");
          }
        }
      } catch (err) {
        console.warn("Failed to load blogs from API:", err?.message || err);
        setPosts([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Insights</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, news, and expert insights in Ghana's real estate market
          </p>
        </div>

        {(!posts || posts.length === 0) && (
          <div className="mb-16 text-center bg-white rounded-xl border border-gray-200 p-10 text-gray-600">
            <p className="text-lg">No blog posts yet.</p>
            <p className="text-sm mt-2">Once an admin publishes a post, it will appear here.</p>
          </div>
        )}

        {posts.length > 0 && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                        <img
                          src={getImageForPost(posts[0], 1)}
                          alt={posts[0]?.title || "Featured post"}
                          className="w-full h-64 lg:h-full object-cover"
                          onError={(e) => enhancedHandleImgError(e, posts[0], 1)}
                        />
                </div>
                <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(posts[0].category)}`}>
                        {posts[0].category.replace('-', ' ')}
                      </span>
                      {posts[0].readTime && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {posts[0].readTime} min read
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{posts[0].title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-4">{posts[0].excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" /> {posts[0].author || "Unknown"}
                      <span>•</span>
                      <span>{formatDate(posts[0].publishedAt)}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      to={`/blog/${posts[0].slug || slugify(posts[0].title)}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, i) => (
            <div key={post.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-48 overflow-hidden">
                <img
                    src={getImageForPost(post, i+2)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => enhancedHandleImgError(e, post, i+2)}
                  />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category.replace('-', ' ')}
                  </span>
                  {post.readTime && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {post.readTime} min
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> {post.author || "Unknown"}
                  </span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/blog/${post.slug || slugify(post.title)}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
