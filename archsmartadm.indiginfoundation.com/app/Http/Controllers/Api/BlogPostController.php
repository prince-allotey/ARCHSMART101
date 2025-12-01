<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\BlogPostPublished;
use App\Models\PushSubscription;
use Minishlink\WebPush\Subscription as WebPushSubscription;
use Minishlink\WebPush\WebPush;

class BlogPostController extends Controller
{
    /**
     * Admin: list all posts regardless of status
     * 
     * @OA\Get(
     *     path="/admin/blog-posts",
     *     tags={"Blog Posts", "Admin"},
     *     summary="Get all blog posts (Admin)",
     *     description="Retrieve all blog posts including drafts and published. Admin only.",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of all blog posts",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/BlogPost")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only")
     * )
     */
    public function adminIndex()
    {
        $posts = BlogPost::with('user:id,name')
            ->latest()
            ->get();
        return response()->json($posts);
    }

    /**
     * Get published blog posts
     * 
     * @OA\Get(
     *     path="/blog-posts",
     *     tags={"Blog Posts"},
     *     summary="Get published blog posts",
     *     description="Retrieve all published blog posts with author information",
     *     @OA\Response(
     *         response=200,
     *         description="List of published blog posts",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/BlogPost")
     *         )
     *     )
     * )
     */
    public function index()
    {
        // return published posts with author information
        $posts = BlogPost::with('user:id,name')
            ->where('status', 'published')
            ->latest()
            ->get();

        return response()->json($posts);
    }

    /**
     * Get blog post by slug
     * 
     * @OA\Get(
     *     path="/blog-posts/{slug}",
     *     tags={"Blog Posts"},
     *     summary="Get blog post by slug",
     *     description="Retrieve a single blog post by its slug or ID. Supports fuzzy matching for slugs.",
     *     @OA\Parameter(
     *         name="slug",
     *         in="path",
     *         required=true,
     *         description="Blog post slug or ID",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Blog post details",
     *         @OA\JsonContent(ref="#/components/schemas/BlogPost")
     *     ),
     *     @OA\Response(response=404, description="Blog post not found")
     * )
     */
    public function show($slug)
    {
        // Support fetching by slug (preferred) or numeric id (fallback).
        // Allow tolerant lookups so that URLs using the human-friendly
        // slug (without any unique suffix) can still resolve.
        if (is_numeric($slug)) {
            $post = BlogPost::findOrFail($slug);
            return response()->json($post);
        }

        // Normalize input: try decoded and slugified variants to be tolerant of
        // frontend-generated slugs that may omit uniqid suffixes or have
        // small formatting differences.
        $decoded = rawurldecode($slug);

        // 1) exact match (include author)
        $post = BlogPost::with('user:id,name')->where('slug', $decoded)->first();
        if ($post) {
            return response()->json($post);
        }

        // 1b) try the raw provided segment exactly (in case router decoded differently)
        $post = BlogPost::with('user:id,name')->where('slug', $slug)->first();
        if ($post) {
            return response()->json($post);
        }

        // 1c) try normalized slug (slugify input)
        $norm = Str::slug($decoded);
        if ($norm && $norm !== $decoded) {
            $post = BlogPost::with('user:id,name')->where('slug', $norm)->first();
            if ($post) {
                return response()->json($post);
            }
        }

        // 2) prefix match (covers slugs that have an appended uniqid like "my-title-5f2a3b")
        $post = BlogPost::with('user:id,name')
            ->where(function ($q) use ($slug) {
                $q->where('slug', 'like', $slug . '-%')
                    ->orWhere('slug', 'like', $slug . '%');
            })
            ->where('status', 'published')
            ->latest()
            ->first();

        if ($post) {
            return response()->json($post);
        }

        // 3) last-resort: try to find by id using the provided segment (may throw 404)
        $post = BlogPost::with('user:id,name')->findOrFail($slug);
        return response()->json($post);
    }

    /**
     * Create new blog post
     * 
     * @OA\Post(
     *     path="/blog-posts",
     *     tags={"Blog Posts"},
     *     summary="Create new blog post",
     *     description="Create a new blog post. Authenticated users can create posts.",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"title", "content", "status"},
     *                 @OA\Property(property="title", type="string", example="10 Tips for Home Buyers"),
     *                 @OA\Property(property="subtitle", type="string", example="A comprehensive guide"),
     *                 @OA\Property(property="excerpt", type="string", example="Learn essential tips..."),
     *                 @OA\Property(property="summary", type="string", example="Detailed summary of the post"),
     *                 @OA\Property(property="content", type="string", example="<p>Full content with HTML...</p>"),
     *                 @OA\Property(property="category", type="string", example="real-estate"),
     *                 @OA\Property(property="status", type="string", enum={"draft", "published"}, example="published"),
     *                 @OA\Property(property="meta_title", type="string", example="SEO Title"),
     *                 @OA\Property(property="meta_description", type="string", example="SEO Description"),
     *                 @OA\Property(property="canonical_url", type="string", example="https://example.com/blog/post"),
     *                 @OA\Property(property="seo_keywords", type="string", example="real estate, tips, buying"),
     *                 @OA\Property(property="is_featured", type="boolean", example=false),
     *                 @OA\Property(property="cover_image_alt", type="string", example="Beautiful home"),
     *                 @OA\Property(property="estimated_read_time", type="integer", example=5),
     *                 @OA\Property(property="reading_level", type="string", example="beginner"),
     *                 @OA\Property(property="layout", type="string", example="standard"),
     *                 @OA\Property(property="tags", type="string", example="real-estate,tips"),
     *                 @OA\Property(property="image", type="string", format="binary"),
     *                 @OA\Property(property="secondary_image", type="string", format="binary")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Blog post created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/BlogPost")
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'summary' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'category' => 'nullable|string',
            'status' => 'in:draft,published',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|url',
            'seo_keywords' => 'nullable',
            'is_featured' => 'boolean',
            'image' => 'nullable|image|max:4096',
            'secondary_image' => 'nullable|image|max:4096',
            'cover_image_alt' => 'nullable|string|max:255',
            'external_sources' => 'nullable|string',
            'estimated_read_time' => 'nullable|integer',
            'reading_level' => 'nullable|string',
            'layout' => 'nullable|string',
            'tags' => 'nullable',
        ]);

        $user = Auth::user();
        $post = new BlogPost($validated);
        $post->user_id = $user->id;

        // Generate a readable slug. Prefer provided slug, otherwise try base slug
        // and only append a uniqid when there's a collision.
        $base = Str::slug($post->title ?: 'post');
        $desired = $request->input('slug') ? Str::slug($request->input('slug')) : $base;
        $slug = $desired;
        if (BlogPost::where('slug', $slug)->exists()) {
            $slug = $base . '-' . uniqid();
            while (BlogPost::where('slug', $slug)->exists()) {
                $slug = $base . '-' . uniqid();
            }
        }
        $post->slug = $slug;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blog', 'public');
            $post->image = Storage::url($path);
        }

        if ($request->hasFile('secondary_image')) {
            $path = $request->file('secondary_image')->store('blog', 'public');
            $post->secondary_image = Storage::url($path);
        }

        // Tags may be sent as JSON string (from FormData) or as array
        $tags = $request->input('tags');
        if ($tags) {
            if (is_string($tags)) {
                $decoded = json_decode($tags, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $post->tags = $decoded;
                } else {
                    // Fallback: comma or pipe separated values
                    $parts = preg_split('/[\s,|]+/u', $tags, -1, PREG_SPLIT_NO_EMPTY);
                    if ($parts && count($parts)) {
                        $post->tags = array_values(array_unique(array_map(fn($t) => strtolower(trim($t)), $parts)));
                    }
                }
            } elseif (is_array($tags)) {
                $post->tags = $tags;
            }
        }

        // Additional meta fields
        if ($request->filled('meta_title')) $post->meta_title = $request->input('meta_title');
        if ($request->filled('meta_description')) $post->meta_description = $request->input('meta_description');
        if ($request->filled('canonical_url')) $post->canonical_url = $request->input('canonical_url');
        if ($request->filled('seo_keywords')) $post->seo_keywords = $request->input('seo_keywords');
        if ($request->filled('subtitle')) $post->subtitle = $request->input('subtitle');
        if ($request->filled('summary')) $post->summary = $request->input('summary');
        if ($request->filled('cover_image_alt')) $post->cover_image_alt = $request->input('cover_image_alt');
        if ($request->filled('external_sources')) $post->external_sources = $request->input('external_sources');
        if ($request->filled('estimated_read_time')) $post->estimated_read_time = (int) $request->input('estimated_read_time');
        if ($request->filled('reading_level')) $post->reading_level = $request->input('reading_level');
        if ($request->filled('layout')) $post->layout = $request->input('layout');

        if ($post->status === 'published') {
            $post->published_at = now();
        }

    $post->read_time = round(str_word_count($post->content) / 200);
        $wasPublished = $post->status === 'published' && !$post->exists; // just for clarity, but exists will be false earlier
        $post->save();

        // Notify author if published
        if ($post->status === 'published') {
            try {
                $post->loadMissing('user:id,name,email');
                if ($post->user && $post->user->email) {
                    Mail::to($post->user->email)->queue(new BlogPostPublished($post));
                }
                // Broadcast push notification to all subscribers
                $this->broadcastPush('New Blog Post', $post->title, [ 'url' => url('/blog/' . $post->slug) ]);
            } catch (\Throwable $e) {
                // ignore mail failures
            }
        }

        return response()->json($post, 201);
    }

    /**
     * Update blog post
     * 
     * @OA\Put(
     *     path="/blog-posts/{blogPost}",
     *     tags={"Blog Posts"},
     *     summary="Update blog post",
     *     description="Update an existing blog post. Authors can update their own posts, admins can update any post.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="blogPost",
     *         in="path",
     *         required=true,
     *         description="Blog Post ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated Title"),
     *             @OA\Property(property="subtitle", type="string", example="Updated subtitle"),
     *             @OA\Property(property="content", type="string", example="<p>Updated content...</p>"),
     *             @OA\Property(property="status", type="string", enum={"draft", "published"}),
     *             @OA\Property(property="category", type="string", example="real-estate"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="string"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Blog post updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/BlogPost")
     *     ),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Blog post not found")
     * )
     */
    public function update(Request $request, BlogPost $blogPost)
    {
        $user = Auth::user();

        if ($blogPost->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'summary' => 'nullable|string|max:1000',
            'content' => 'sometimes|string',
            'category' => 'nullable|string',
            'status' => 'in:draft,published',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|url',
            'seo_keywords' => 'nullable',
            'is_featured' => 'boolean',
            'image' => 'nullable|image|max:4096',
            'secondary_image' => 'nullable|image|max:4096',
            'cover_image_alt' => 'nullable|string|max:255',
            'external_sources' => 'nullable|string',
            'estimated_read_time' => 'nullable|integer',
            'reading_level' => 'nullable|string',
            'layout' => 'nullable|string',
            'tags' => 'nullable',
        ]);

        // If title changed and no slug provided explicitly, regenerate slug
        $titleBefore = $blogPost->title;
        $blogPost->update($validated);

        if (!$request->filled('slug') && $request->filled('title') && $request->input('title') !== $titleBefore) {
            $base = Str::slug($blogPost->title ?: 'post');
            $slug = $base;
            if (BlogPost::where('slug', $slug)->where('id', '!=', $blogPost->id)->exists()) {
                $slug = $base . '-' . uniqid();
                while (BlogPost::where('slug', $slug)->where('id', '!=', $blogPost->id)->exists()) {
                    $slug = $base . '-' . uniqid();
                }
            }
            $blogPost->slug = $slug;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blog', 'public');
            $blogPost->image = Storage::url($path);
        }

        if ($request->hasFile('secondary_image')) {
            $path = $request->file('secondary_image')->store('blog', 'public');
            $blogPost->secondary_image = Storage::url($path);
        }

        // If tags sent as JSON string
        $tags = $request->input('tags');
        if ($tags) {
            if (is_string($tags)) {
                $decoded = json_decode($tags, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $blogPost->tags = $decoded;
                } else {
                    $parts = preg_split('/[\s,|]+/u', $tags, -1, PREG_SPLIT_NO_EMPTY);
                    if ($parts && count($parts)) {
                        $blogPost->tags = array_values(array_unique(array_map(fn($t) => strtolower(trim($t)), $parts)));
                    }
                }
            } elseif (is_array($tags)) {
                $blogPost->tags = $tags;
            }
        }

        if ($request->filled('meta_title')) $blogPost->meta_title = $request->input('meta_title');
        if ($request->filled('meta_description')) $blogPost->meta_description = $request->input('meta_description');
        if ($request->filled('canonical_url')) $blogPost->canonical_url = $request->input('canonical_url');
        if ($request->filled('seo_keywords')) $blogPost->seo_keywords = $request->input('seo_keywords');
        if ($request->filled('subtitle')) $blogPost->subtitle = $request->input('subtitle');
        if ($request->filled('summary')) $blogPost->summary = $request->input('summary');
        if ($request->filled('cover_image_alt')) $blogPost->cover_image_alt = $request->input('cover_image_alt');
        if ($request->filled('external_sources')) $blogPost->external_sources = $request->input('external_sources');
        if ($request->filled('estimated_read_time')) $blogPost->estimated_read_time = (int) $request->input('estimated_read_time');
        if ($request->filled('reading_level')) $blogPost->reading_level = $request->input('reading_level');
        if ($request->filled('layout')) $blogPost->layout = $request->input('layout');

        $prevStatus = $blogPost->status;
        $blogPost->save();

        // If status toggled to published, set published_at and send mail
        if ($blogPost->status === 'published' && $prevStatus !== 'published') {
            if (!$blogPost->published_at) {
                $blogPost->published_at = now();
                $blogPost->save();
            }
            try {
                $blogPost->loadMissing('user:id,name,email');
                if ($blogPost->user && $blogPost->user->email) {
                    Mail::to($blogPost->user->email)->queue(new BlogPostPublished($blogPost));
                }
                $this->broadcastPush('Blog Post Published', $blogPost->title, [ 'url' => url('/blog/' . $blogPost->slug) ]);
            } catch (\Throwable $e) {
                // ignore mail failures
            }
        }
        return response()->json($blogPost);
    }

    /**
     * Delete blog post
     * 
     * @OA\Delete(
     *     path="/blog-posts/{blogPost}",
     *     tags={"Blog Posts"},
     *     summary="Delete blog post",
     *     description="Delete a blog post. Authors can delete their own posts, admins can delete any post.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="blogPost",
     *         in="path",
     *         required=true,
     *         description="Blog Post ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Blog post deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Blog post not found")
     * )
     */
    public function destroy(BlogPost $blogPost)
    {
        $user = Auth::user();
        if ($blogPost->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($blogPost->image) {
            $path = str_replace('/storage/', '', $blogPost->image);
            Storage::disk('public')->delete($path);
        }

        $blogPost->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
    /**
     * Send a push notification to all stored subscriptions.
     */
    protected function broadcastPush(string $title, string $body, array $data = []): void
    {
        try {
            $auth = [
                'VAPID' => [
                    'subject' => config('push.vapid.subject'),
                    'publicKey' => config('push.vapid.public'),
                    'privateKey' => config('push.vapid.private'),
                ],
            ];
            if (!$auth['VAPID']['publicKey'] || !$auth['VAPID']['privateKey']) return; // keys not set
            $webPush = new WebPush($auth);
            $payload = json_encode([
                'title' => $title,
                'body' => $body,
                'data' => $data,
            ]);
            PushSubscription::chunk(100, function ($subs) use ($webPush, $payload) {
                foreach ($subs as $sub) {
                    $webPush->queueNotification(WebPushSubscription::create([
                        'endpoint' => $sub->endpoint,
                        'publicKey' => $sub->p256dh,
                        'authToken' => $sub->auth,
                        'contentEncoding' => 'aes128gcm',
                    ]), $payload);
                }
                $webPush->flush();
            });
        } catch (\Throwable $e) {
            // silently ignore push errors
        }
    }
}
