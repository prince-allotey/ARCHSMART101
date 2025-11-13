Dashboard features: backend expectations
=====================================

This project includes three dashboards (user, agent, admin). The frontend components assume the following API endpoints exist on your Laravel backend. Adjust the endpoints or update these components if your backend uses different routes.

Properties
- POST /api/properties
  - Accepts either JSON or multipart/form-data. When sending images, the frontend submits FormData with fields:
    - title
    - address
    - price
    - images[] (one or more image files)
  - Returns created property object (including `id`).

- GET /api/properties
  - Returns a list of public/approved properties for listing in the user dashboard.

- GET /api/properties/{id}
  - Returns a single property (already used elsewhere in the app).

Agent-specific
- GET /api/properties/agent  (used by agent dashboard list)
  - Returns properties belonging to the authenticated agent.

- DELETE /api/properties/{id}
  - Deletes a property (agent or admin allowed depending on backend rules).

Admin-specific
- GET /api/properties/pending
  - Returns properties awaiting admin approval. frontend expects an array of property objects.

- POST /api/properties/{id}/approve
  - Marks the property approved. Adjust to PATCH /api/properties/{id} with { approved: true } if your backend uses that instead.

Blogs
- POST /api/blogs
  - Expects JSON with:
    - title: string
    - content: string (HTML produced by React Quill)

Notes & tips
- FormData: The property form now sends a FormData instance. Ensure your Laravel controller uses `$request->file('images')` and `Storage::putFile` or similar.
- CSRF & Auth: The frontend uses `src/api/axios.js` with withCredentials set; make sure Sanctum/session or token auth is configured correctly.
- Rich text sanitation: Because admins can submit HTML, sanitize on the backend (e.g., using HTMLPurifier or Laravel packages) before saving/rendering.

If you want, I can also:
- Add image upload progress UI.
- Embed image uploads directly into blog content (React Quill image handler + upload endpoint).
- Create backend controller stubs (Laravel) for these endpoints.
