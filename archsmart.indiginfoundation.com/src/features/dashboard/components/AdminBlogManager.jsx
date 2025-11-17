import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { resolveUploadedUrl, assetUrl } from '../../../api/config';
import AdminBlogFormSimple from './AdminBlogFormSimple';
import toast from 'react-hot-toast';

export default function AdminBlogManager() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/blog-posts');
        // Normalize posts so consumers can rely on `.id`
        const list = Array.isArray(data) ? data.map(p => ({
          ...p,
          id: p.id ?? p._id ?? p.blog_id ?? null,
        })) : [];
        setPosts(list);
      } catch (e) {
        toast.error('Failed to load posts');
      }
    };
    load();
  }, [refresh]);

  const startEdit = (post) => setEditing(post);
  const cancelEdit = () => setEditing(null);

  const remove = async (post) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/blog-posts/${post.id}`);
      toast.success('Deleted');
      setRefresh(r => r + 1);
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  // Scan backend for posts with missing image files
  const [missing, setMissing] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [selectedType, setSelectedType] = useState('blogs');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [replacementUrl, setReplacementUrl] = useState('');
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState('');

  const scanMissing = async () => {
    setScanning(true);
    try {
      const { data } = await api.get(`/api/admin/missing-media?type=${encodeURIComponent(selectedType)}`);
      setMissing(Array.isArray(data.missing) ? data.missing : []);
      if (!data.missing || data.missing.length === 0) toast.success('No missing images found');
    } catch (e) {
      toast.error('Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const repairMissing = async () => {
    if (!window.confirm('Replace missing images with default placeholder?')) return;
    try {
      const { data } = await api.post('/api/admin/repair-missing-media', { defaultImage: '/images/blogs/blog1.jpeg', type: selectedType });
      toast.success(`Repaired ${data.repaired} items`);
      setRefresh(r => r + 1);
      setMissing([]);
    } catch (e) {
      toast.error('Repair failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Post' : 'Create Post'}</h2>
        <AdminBlogFormSimple
          mode={editing ? 'edit' : 'create'}
          postId={editing?.id}
          initialData={editing}
          onCreated={() => setRefresh(r => r + 1)}
          onSaved={() => { setEditing(null); setRefresh(r => r + 1); }}
          onCancel={cancelEdit}
        />
      </div>

      {/* Replacement modal (simple) */}
      {modalOpen && modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-3">Replace image for: {modalItem.title || modalItem.id}</h3>
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-1">Current:</div>
              <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                <img src={resolveUploadedUrl(modalItem.image) || assetUrl(modalItem.image)} alt="current" className="w-full h-full object-cover" />
              </div>
            </div>
            <label className="text-xs text-gray-600">Replacement image URL or path (or upload a file)</label>
            <input value={replacementUrl} onChange={(e) => setReplacementUrl(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
            <div className="text-xs text-gray-500 mb-2">Or upload a file to store it in backend storage:</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                setReplacementFile(f || null);
                setReplacementPreview(f ? URL.createObjectURL(f) : '');
                // clear replacementUrl when a file is chosen
                if (f) setReplacementUrl('');
              }}
              className="w-full mb-3"
            />
            {replacementPreview && (
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">Preview:</div>
                <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <img src={replacementPreview} alt="preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => { setModalOpen(false); setModalItem(null); }} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={async () => {
                try {
                  const type = selectedType;
                  const id = modalItem.id;
                  // If a file is selected, send multipart FormData so backend can store it
                  if (replacementFile) {
                    const fd = new FormData();
                    fd.append('file', replacementFile);
                    // optional fallback defaultImage
                    if (replacementUrl) fd.append('defaultImage', replacementUrl);
                    await api.post(`/api/admin/repair-missing-media/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, fd, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    });
                  } else {
                    await api.post(`/api/admin/repair-missing-media/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, { defaultImage: replacementUrl || '/images/blogs/blog1.jpeg' });
                  }
                  toast.success('Replaced');
                  setMissing(prev => prev.filter(x => x.id !== modalItem.id));
                  setRefresh(r => r + 1);
                } catch (e) {
                  console.error(e);
                  toast.error('Replace failed');
                } finally {
                  setModalOpen(false); setModalItem(null); setReplacementFile(null); setReplacementPreview(''); setReplacementUrl('');
                }
              }} className="px-3 py-1 bg-blue-600 text-white rounded">Replace</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Existing Posts</h2>
          <div className="flex items-center gap-2">
            <button onClick={scanMissing} className="px-3 py-1 text-xs bg-yellow-500 text-white rounded">{scanning ? 'Scanning...' : 'Scan Missing Images'}</button>
            <button onClick={repairMissing} className="px-3 py-1 text-xs bg-green-600 text-white rounded">Repair Missing</button>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm">Type:</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-2 py-1 border rounded">
            <option value="blogs">Blogs</option>
            <option value="properties">Properties</option>
            <option value="profile_pictures">Profile Pictures</option>
            <option value="services">Services</option>
          </select>
          <button onClick={scanMissing} className="px-3 py-1 text-xs bg-yellow-500 text-white rounded">{scanning ? 'Scanning...' : 'Scan Missing'}</button>
          <button onClick={repairMissing} className="px-3 py-1 text-xs bg-green-600 text-white rounded">Repair Missing</button>
        </div>

        {missing && missing.length > 0 && (
          <div className="mb-4 border p-3 rounded bg-yellow-50">
            <p className="text-sm font-medium mb-2">Missing images found ({missing.length}):</p>
            <ul className="text-xs">
              {missing.map(m => (
                <li key={m.id} className="flex items-center gap-3 py-1">
                  <div className="w-12 h-8 bg-gray-100 rounded overflow-hidden">
                    <img src={resolveUploadedUrl(m.image) || assetUrl(m.image)} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{m.title || 'Untitled'}</div>
                    <div className="text-gray-500">{m.image}</div>
                <div className="mt-1">
                  <button
                    onClick={() => {
                      // open modal with item and selected type
                      setModalItem(m);
                      setReplacementUrl('/images/blogs/blog1.jpeg');
                      setModalOpen(true);
                    }}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                  >Replace</button>
                </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {posts.length === 0 && <p className="text-sm text-gray-500">No posts yet.</p>}
        <ul className="divide-y divide-gray-200">
          {posts.map(p => (
            <li key={p.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.title || 'Untitled'}</p>
                <p className="text-xs text-gray-500">{p.status} • {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded">Edit</button>
                <button onClick={() => remove(p)} className="px-3 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
