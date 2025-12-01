import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import { fetchBlog, fetchBlogs } from "../../../api/blogApi";
import { resolveUploadedUrl, assetUrl, BACKEND_ORIGIN } from "../../../api/config";
import PUBLIC_BLOG_IMAGES from "../../../data/publicBlogImages.json";
import { mockBlogPosts } from "../../../data/mockData";
import Comments from "../components/Comments";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showScroll, setShowScroll] = useState(false);

  const slugify = (s) => s?.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";

  const seedFrom = (str) => {
    if (!str) return 0;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h;
  };

  const generateEnriched = (p) => {
    const key = (p?.slug || p?.title || Math.random().toString()).toString();
    const seed = seedFrom(key);
    const pick = (arr) => arr[seed % arr.length];
    const introTemplates = [
      `In this article, we examine ${p.title} and what it signals for the property market today. We'll separate headline trends from long-term drivers so you can act with clarity.`,
      `${p.title} captures a shift many local experts have been tracking — here we unpack its practical meaning for buyers and investors across Ghana.`,
      `This deep-dive on ${p.title} combines on-the-ground observation with data-backed insight to help you understand the opportunities and risks.`
    ];
    const backgroundTemplates = [
      `Ghana's property sector has been evolving quickly; historical underinvestment in infrastructure is now being balanced by public and private initiatives, creating new pockets of demand.`,
      `Over the past five years, technology and urban migration have reshaped demand patterns. The examples highlighted in this post reflect those broader changes.`,
      `The interplay between local buyer preferences and international capital is increasingly important — understanding how these forces combine is key to smart decision-making.`
    ];
    const implicationTemplates = [
      `For homeowners, the main implication is to prioritise long-run value: proximity to jobs, resilience to climate impacts, and solid title documentation.`,
      `For investors, focus on areas where infrastructure projects, not shortlived hype, are driving traffic and rental demand.`,
      `Developers and agents should place more emphasis on transparency and after-sales service to build trust and reduce transaction friction.`
    ];
    const adviceTemplates = [
      `Do independent title checks and engage a local lawyer early in any transaction.`,
      `Model your cashflow conservatively and stress-test any yield assumptions against vacancy and maintenance scenarios.`,
      `Leverage local market data and on-the-ground agents — numbers alone rarely tell the whole story.`
    ];
    const closingTemplates = [
      `We hope this article helps you make more informed property choices. Use these takeaways as a checklist when evaluating opportunities.`,
      `Careful, patient analysis combined with the right local partners will typically outperform rushed speculation.`,
      `Market cycles create both risk and opportunity — the best results come from disciplined, well-sourced decisions.`
    ];
    return { introduction: pick(introTemplates), background: pick(backgroundTemplates), implications: pick(implicationTemplates), advice: pick(adviceTemplates), closing: pick(closingTemplates) };
  };

  const enriched = React.useMemo(() => (post ? generateEnriched(post) : null), [post]);

  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true); setError(null);
      // If the router passed an initial post via location.state, use it immediately
      try {
        const initial = location?.state?.post || null;
        if (initial) {
          setPost(initial);
        } else {
          // Check sessionStorage for a recently created post (helps immediately show uploaded images)
          try {
            const cached = sessionStorage.getItem(`recentBlog:${slug}`);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed && parsed.slug === slug) setPost(parsed);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {}
      try {
        const data = await fetchBlog(slug);
        if (!mounted) return;
        setPost(data);
        // Clear any cached recentBlog for this slug — backend is authoritative now
        try { sessionStorage.removeItem(`recentBlog:${slug}`); } catch (e) {}
      } catch (err) {
        // Build a richer error object for the UI to display diagnostics
  const attemptedUrl = `${BACKEND_ORIGIN}/api/blog-posts/${slug}`;
        const status = err?.response?.status;
        const body = err?.response?.data;
        const found = mockBlogPosts.find((b) => { const s = b.slug || slugify(b.title) || `mock-${b.id}`; return s === slug; });
        if (found) {
          setPost(found);
        } else {
          setError({ message: status ? `Request failed with status ${status}` : 'Post not found', attemptedUrl, status, body });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    (async () => { try { const all = await fetchBlogs(); if (!all || !Array.isArray(all)) return; const rel = all.filter((p) => (p.slug || p.id) !== slug).slice(0, 4); setRelated(rel); } catch (e) {} })();
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    if (!post?.content) { setToc([]); return; }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, "text/html");
      const headings = Array.from(doc.querySelectorAll("h2, h3")).map((h) => ({ id: h.id || (h.textContent || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), text: h.textContent, level: h.tagName, })).slice(0, 20);
      setToc(headings);
    } catch { setToc([]); }
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
      setShowScroll(scrollTop > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fallbackContent = `<h2>Exploring Ghana’s Evolving Property Landscape</h2><p>The Ghanaian real estate market has experienced a remarkable transformation over the past decade...</p>`;
  const displayContent = post?.content || fallbackContent;

  const resolveImageUrl = (src) => resolveUploadedUrl(src) || null;

  const getImageForPost = (p) => {
    try {
      const raw = p?.image || p?.cover_image || null;
      if (!raw) return assetUrl(fallbackBlogImage(p.id || p.slug || p.title, 1));
      const resolved = resolveUploadedUrl(raw) || assetUrl(raw) || null;
      if (!resolved) return assetUrl(fallbackBlogImage(p.id || p.slug || p.title, 1));
      const ts = p.updated_at ? new Date(p.updated_at).getTime() : (p.published_at ? new Date(p.published_at).getTime() : Date.now());
      // if the resolved URL points at backend media/storage, add small cache-bust
      if (resolved.includes('/api/media/') || resolved.includes('/storage/') || resolved.includes('/api/')) {
        return `${resolved}${resolved.includes('?') ? '&' : '?'}t=${ts}`;
      }
      return resolved;
    } catch (e) {
      return assetUrl(fallbackBlogImage(p.id || p.slug || p.title, 1));
    }
  };

  const enhancedBlogImgError = (e, p) => {
    try {
      const img = e.currentTarget;
      const attempts = parseInt(img.dataset.attempts || '0', 10) + 1;
      img.dataset.attempts = attempts;
      if (attempts > 3 || img.__fallbackApplied) {
        img.__fallbackApplied = true;
        img.src = assetUrl(fallbackBlogImage(p.id || p.slug || p.title, 1));
        return;
      }
      const current = (img.src || '').toString();
      const filename = current.split('/').pop().split('?')[0].split('#')[0];
      if (attempts === 1) {
        const filename = current.split('/').pop().split('?')[0].split('#')[0];
        if (filename && Array.isArray(PUBLIC_BLOG_IMAGES) && PUBLIC_BLOG_IMAGES.includes(filename)) {
          img.src = resolveUploadedUrl(`blogs/${filename}`);
          return;
        }
        if (current.includes('/api/media/') && filename) {
          img.src = `${BACKEND_ORIGIN}/storage/blogs/${filename}`;
          return;
        }
      }
      if (attempts === 2) {
        if (filename) {
          img.src = `${BACKEND_ORIGIN}/api/media/blogs/${filename}?t=${Date.now()}`;
          return;
        }
      }
      img.__fallbackApplied = true;
      img.src = assetUrl(fallbackBlogImage(p.id || p.slug || p.title, 1));
    } catch (err) {
      try { e.currentTarget.src = assetUrl(fallbackBlogImage(p.id || p.slug || p.title, 1)); } catch (_) {}
    }
  };

  const fallbackBlogImage = (key, offset = 1) => {
    const choices = [1,2,3,4,5];
    let seed = 0;
    try {
      const s = (key || '').toString();
      for (let i = 0; i < s.length; i++) seed = (seed * 31 + s.charCodeAt(i)) >>> 0;
    } catch (e) { seed = Date.now(); }
    const idx = (seed + offset) % choices.length;
    return resolveUploadedUrl(`blogs/blog${choices[idx]}.jpeg`);
  };

  const isRepairedDefault = (originalSrc, resolvedUrl) => {
    try {
      if (!originalSrc && !resolvedUrl) return true;
      const a = (originalSrc || '').toString().toLowerCase();
      const b = (resolvedUrl || '').toString().toLowerCase();
      if (a.includes('blog1.jpeg') || b.includes('blog1.jpeg')) return true;
    } catch (e) {}
    return false;
  };

  if (loading) return <div className="py-40 text-center text-gray-500">Loading...</div>;
  if (error) {
    // Render either a simple string error or a richer diagnostic object
    if (typeof error === 'string') {
      return <div className="py-40 text-center text-gray-500">{error}</div>;
    }
    return (
      <div className="py-20 max-w-3xl mx-auto text-sm text-gray-700 bg-red-50 border border-red-100 rounded-md p-6">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Blog post could not be loaded</h3>
        <p className="mb-2">{error.message || 'Post not found'}</p>
        {error.attemptedUrl && (
          <p className="mb-2">
            Attempted API URL: <a className="text-blue-600 underline" href={error.attemptedUrl} target="_blank" rel="noreferrer">{error.attemptedUrl}</a>
          </p>
        )}
        {error.status && <p className="mb-2">HTTP status: <strong>{error.status}</strong></p>}
        {error.body && (
          <div className="mb-2 text-xs text-gray-600">
            <div className="font-medium">Response body:</div>
            <pre className="whitespace-pre-wrap max-h-40 overflow-auto text-xs">{typeof error.body === 'string' ? error.body : JSON.stringify(error.body, null, 2)}</pre>
          </div>
        )}
        <div className="mt-4 text-xs text-gray-600">
          <div>If this is a 404, confirm the blog slug exists in the backend or use the admin to create the post.</div>
          <div>If the backend is unreachable, ensure <code className="bg-gray-100 px-1 rounded">VITE_BACKEND_URL</code> / <code className="bg-gray-100 px-1 rounded">BACKEND_ORIGIN</code> is correct.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 fixed top-0 left-0 w-full z-40" style={{ width: `${progress}%` }} />
      <article className="max-w-5xl mx-auto px-4 lg:px-0 py-16">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap text-xs text-gray-500">
            <span>{post.category || 'general'}</span>
            <span>• {new Date(post.created_at || post.published_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">{post.title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl">{post.excerpt}</p>
        </header>
        {post.image && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow">
            <img
              src={getImageForPost(post)}
              alt={post.title}
              className="w-full h-[420px] object-cover"
              onError={(e) => { try { if (!e.currentTarget.__fallbackApplied) { e.currentTarget.__fallbackApplied = true; e.currentTarget.src = assetUrl(fallbackBlogImage(post.id || post.slug || post.title, 1)); } } catch(_) { e.currentTarget.src = assetUrl(fallbackBlogImage(post.id || post.slug || post.title, 1)); } }}
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: displayContent }} />
        {enriched && (
          <section className="mt-12 border-t pt-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Context</h2>
              <p className="text-gray-700 leading-relaxed">{enriched.background}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Implications</h2>
              <p className="text-gray-700 leading-relaxed">{enriched.implications}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Advice</h2>
              <p className="text-gray-700 leading-relaxed">{enriched.advice}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-100">
              <p className="text-gray-800 font-medium">{enriched.closing}</p>
            </div>
          </section>
        )}
        <div className="mt-16"><Comments postId={post.id} /></div>
      </article>
    </div>
  );
}
