import React, { useEffect, useMemo, useState } from 'react'
import api from '../../../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../../contexts/AuthContext'

const MAX_LEN = 2000
const MIN_LEN = 3

export default function Comments({ postId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // form state
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [errors, setErrors] = useState({})

  useEffect(() => { fetchComments() }, [postId])

  async function fetchComments() {
    try {
      setLoading(true)
      const r = await api.get(`/api/posts/${postId}/comments`)
      setComments(Array.isArray(r.data) ? r.data : [])
    } catch (e) {
      // silent fail is fine for comments
    } finally { setLoading(false) }
  }

  const remaining = useMemo(() => Math.max(0, MAX_LEN - (text?.length || 0)), [text])

  function validate() {
    const errs = {}
    const trimmed = (text || '').trim()
    if (!trimmed) errs.body = 'Please enter a comment'
    else if (trimmed.length < MIN_LEN) errs.body = `Comment must be at least ${MIN_LEN} characters`
    else if (trimmed.length > MAX_LEN) errs.body = `Comment must be less than ${MAX_LEN} characters`
    if (!user) {
      // optional but validate if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
    }
    if (website) errs.spam = 'Spam detected'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function submit() {
    if (!validate()) { toast.error('Fix form errors and try again'); return }
    try {
      setSubmitting(true)
      const payload = { body: text }
      if (!user) { if (name) payload.name = name; if (email) payload.email = email }
      const r = await api.post(`/api/posts/${postId}/comments`, payload)
      const created = r.data || { body: text, created_at: new Date().toISOString() }
      // Ensure basic fields for optimistic UI
      created.name = created.name || user?.name || name || 'You'
      created.id = created.id || `tmp-${Date.now()}`
      setComments((prev) => [created, ...prev])
      setText('')
      if (!user) { setName(''); setEmail('') }
      toast.success('Comment posted')
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.errors?.body?.[0] || 'Failed to post comment'
      toast.error(msg)
    } finally { setSubmitting(false) }
  }

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault(); submit();
    }
  }

  return (
    <section className="mt-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Comments</h3>

      {/* form */}
      <div className="mb-8 rounded-2xl border border-gray-200 p-4 sm:p-6 bg-white shadow-sm">
        {!user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            {/* honeypot */}
            <input type="text" value={website} onChange={(e)=> setWebsite(e.target.value)} className="hidden" tabIndex={-1} aria-hidden="true" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={4}
            maxLength={MAX_LEN + 5}
            className={`w-full rounded-xl border px-3 py-3 focus:outline-none focus:ring-2 ${errors.body ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
            placeholder="Write something helpful..."
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            {errors.body ? (
              <span className="text-red-600">{errors.body}</span>
            ) : (
              <span className="text-gray-500">Be respectful and on-topic. Ctrl/⌘ + Enter to submit.</span>
            )}
            <span className={`ml-2 ${remaining < 50 ? 'text-amber-600' : 'text-gray-400'}`}>{remaining}/{MAX_LEN}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={submit}
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
          {!user && (
            <span className="text-xs text-gray-500">Posting as guest. You can optionally provide a name/email.</span>
          )}
        </div>
      </div>

      {/* list */}
      <div className="space-y-4">
        {loading && <div className="text-gray-500">Loading comments…</div>}
        {!loading && comments.length === 0 && (
          <div className="text-gray-500">No comments yet. Be the first to share your thoughts.</div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            {/* avatar */}
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
              {(c.name || 'G').slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 rounded-xl border border-gray-200 p-3 bg-white">
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-900">{c.name || 'Guest'}</span>
                <span className="mx-2">•</span>
                <span>{c.created_at ? new Date(c.created_at).toLocaleString() : 'just now'}</span>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap">{c.body}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
