import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { resolveUploadedUrl, assetUrl } from '../../../api/config';
import PUBLIC_BLOG_IMAGES from '../../../data/publicBlogImages.json';
import { createBlog, updateBlog } from "../../../api/blogApi";
import toast from "react-hot-toast";
import { FileImage, Send, X } from "lucide-react";

export default function AdminBlogFormSimple({
  mode = "create",
  postId,
  initialData,
  onCreated,
  onSaved,
  onCancel,
}) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("real-estate");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState("published");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setExcerpt(initialData.excerpt || initialData.summary || "");
      setContent(initialData.content || "");
      setCategory(initialData.category || "real-estate");
      setStatus(initialData.status || "draft");
      if (initialData.image) {
        // Accept string paths, absolute URLs or objects with .url
        let raw = null;
        if (typeof initialData.image === 'string') raw = initialData.image;
        else if (typeof initialData.image === 'object' && initialData.image?.url) raw = initialData.image.url;

        // Resolve into an accessible URL (routes storage paths through media API when needed)
        const resolved = raw ? resolveUploadedUrl(raw) || assetUrl(raw) : null;

        // Append a simple cache-bust using updated_at/published_at if available so previews reflect recent changes
        const ts = initialData.updated_at || initialData.published_at || null;
        const finalUrl = resolved && ts ? `${resolved}${resolved.includes('?') ? '&' : '?'}t=${encodeURIComponent(ts)}` : resolved;

        // Verify the resolved URL is reachable (HEAD) — if backend file missing, fall back to frontend assetUrl()
        if (typeof window !== 'undefined' && finalUrl) {
          (async () => {
            try {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 3000);
              const resp = await fetch(finalUrl, {
                method: 'HEAD',
                mode: 'cors',
                credentials: 'include',
                signal: controller.signal,
              });
              clearTimeout(timeout);
              if (resp && resp.ok) {
                setImagePreview(finalUrl);
                return;
              }
            } catch (e) {
              // ignore and fallthrough to fallback below
            }
                // Fallback to frontend static asset URL (if available) or try the public images manifest
                let fallback = assetUrl(raw || '') || null;
                try {
                  const parts = (raw || '').toString().split('/');
                  const filename = parts[parts.length - 1] || raw;
                  const clean = filename.split('?')[0].split('#')[0];
                  if ((!fallback || fallback === '') && Array.isArray(PUBLIC_BLOG_IMAGES) && PUBLIC_BLOG_IMAGES.includes(clean)) {
                    fallback = `/images/blogs/${clean}`;
                  }
                } catch (err) {
                  // ignore
                }
                setImagePreview(fallback);
          })();
        } else {
          setImagePreview(finalUrl || null);
        }
      }
    }
  }, [mode, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim() || content === '<p><br></p>') return toast.error("Content is required");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("excerpt", excerpt);
      fd.append("content", content);
      fd.append("category", category);
      // Only allow setting status when creating a new post. For edits, do not force a publish
      // — leave status unchanged unless an explicit admin workflow sets it elsewhere.
      if (mode !== "edit") {
        fd.append("status", status);
      }
      if (imageFile) fd.append("image", imageFile);

      // Determine effective id to use for updates. Prefer explicit postId prop,
      // fall back to initialData.id (defensive for different payload shapes).
      const effectiveId = postId || initialData?.id || null;

      if (mode === "edit" && effectiveId) {
        await updateBlog(effectiveId, fd);
        toast.success("Blog updated");
        if (onSaved) onSaved();
      } else {
        const created = await createBlog(fd);
        toast.success("Blog post created");
        // Persist the created post briefly to sessionStorage so the frontend can
        // immediately show the uploaded image when navigating to the post page
        try {
          if (created && created.slug) {
            sessionStorage.setItem(`recentBlog:${created.slug}`, JSON.stringify(created));
            // Navigate to the created post immediately with router state so the
            // BlogPostPage can render the image immediately without requiring a reupload.
            try {
              navigate(`/blog/${created.slug}`, { state: { post: created } });
            } catch (e) {
              // ignore navigation errors
            }
          }
        } catch (err) {
          // ignore storage errors
        }
        setTitle("");
        setExcerpt("");
        setContent("");
        setCategory("real-estate");
        setImageFile(null);
        setImagePreview(null);
        setStatus("published");
        if (onCreated) onCreated(created);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || (mode === "edit" ? "Failed to update" : "Failed to create"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog post title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary (optional)"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="real-estate">Real Estate</option>
          <option value="smart-living">Smart Living</option>
          <option value="interior-design">Interior Design</option>
          <option value="investment">Investment</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileImage className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG/JPG/GIF up to 10MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        ) : (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
            <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your blog content here..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote", "code-block"],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        {mode === "edit" ? (
          <div className="text-sm text-gray-600">Current: <span className="font-medium">{status}</span></div>
        ) : (
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="draft"
                checked={status === "draft"}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Draft</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="published"
                checked={status === "published"}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Publish</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        {mode === "edit" && onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{mode === "edit" ? "Saving..." : "Posting..."}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{mode === "edit" ? "Save Changes" : status === "published" ? "Publish Post" : "Save Draft"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
