import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
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
        setPosts(Array.isArray(data) ? data : []);
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

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Existing Posts</h2>
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
