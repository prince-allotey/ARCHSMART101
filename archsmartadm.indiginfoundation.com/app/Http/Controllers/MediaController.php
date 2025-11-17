<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Serve files from storage/app/public for a limited set of folders.
     * This ensures requests go through Laravel (and CORS middleware) so the
     * browser receives appropriate CORS headers instead of opaque responses.
     *
     * Allowed folders: profile_pictures, properties, blogs, services, images
     */
    public function serve(Request $request, $folder, $filename)
    {
        $allowed = ['profile_pictures', 'properties', 'blogs', 'services', 'images'];
        if (!in_array($folder, $allowed, true)) {
            // Let the CORS middleware handle Access-Control headers.
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $filename = ltrim($filename, '/');
        $diskFolder = $folder;
        if ($folder === 'blogs' && !Storage::disk('public')->exists('blogs/' . $filename) && Storage::disk('public')->exists('blog/' . $filename)) {
            $diskFolder = 'blog';
        }
        $path = $diskFolder . '/' . $filename;

        // If the requested file exists in storage/app/public, serve it.
        if (Storage::disk('public')->exists($path)) {
            $fullPath = Storage::disk('public')->path($path);
            $headers = [
                'Cache-Control' => 'public, max-age=31536000',
            ];
            return response()->file($fullPath, $headers);
        }

        // Fallback: if a matching file exists under public/images/{folder}/{filename}, serve that
        $publicFallback = public_path("images/{$folder}/{$filename}");
        if (file_exists($publicFallback)) {
            $headers = [
                'Cache-Control' => 'public, max-age=31536000',
            ];
            return response()->file($publicFallback, $headers);
        }

        // If this is a blog image, return a lightweight placeholder SVG instead of JSON so
        // browsers receive a renderable asset instead of aborting the request.
        if ($folder === 'blogs') {
            $placeholder = public_path('images/placeholders/blog-missing.svg');
            if (file_exists($placeholder)) {
                $headers = ['Cache-Control' => 'public, max-age=600'];
                return response()->file($placeholder, $headers);
            }
        }

        // Not found — include CORS headers so callers (browsers) get the real status instead of opaque blocking
        // Let the CORS middleware add the appropriate headers for responses.
        return response()->json(['message' => 'Not found'], 404);
    }
}
