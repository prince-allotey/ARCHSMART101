import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../../../api/blogApi";
import { BACKEND_ORIGIN } from "../../../api/config";
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
    if (!src) return null;
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith("/storage") || src.startsWith("storage/") || src.startsWith("blog/")) {
      const path = src.startsWith("/") ? src : `/${src}`;
      return `${BACKEND_ORIGIN}${path}`;
    }
    return src;
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
          const normalized = data.map((p) => ({
            id: p.id ?? p._id,
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
                    src={resolveImageUrl(posts[0]?.image) || "/images/blogs/blog1.jpeg"}
                    alt={posts[0]?.title || "Featured post"}
                    className="w-full h-64 lg:h-full object-cover"
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
          {posts.slice(1).map((post) => (
            <div key={post.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={resolveImageUrl(post.image) || "/images/blogs/blog2.jpeg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
