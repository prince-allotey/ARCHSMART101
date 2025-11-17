<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BlogPost;
use App\Models\Property;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ImageRepairController extends Controller
{
    // Return list of blog posts whose image reference points to missing files
    // Generic missing media scanner. Query param `type` supports: blogs, properties, profile_pictures, services
    public function missingMedia(Request $request)
    {
        $type = $request->query('type', 'blogs');
        $missing = [];

        if ($type === 'blogs') {
            $posts = BlogPost::all();
            foreach ($posts as $post) {
                $img = $post->image;
                if (!$img) continue;
                $filename = $this->extractBlogFilename($img);
                if (!$filename) continue;
                $storagePath = 'blogs/' . $filename;
                $publicFallback = public_path('images/blogs/' . $filename);
                $existsInStorage = Storage::disk('public')->exists($storagePath);
                $existsInPublic = file_exists($publicFallback);
                if (! $existsInStorage && ! $existsInPublic) {
                    $missing[] = [
                        'id' => $post->id,
                        'title' => $post->title,
                        'image' => $post->image,
                        'expected_storage' => $storagePath,
                    ];
                }
            }
        } elseif ($type === 'properties') {
            $props = Property::all();
            foreach ($props as $p) {
                $images = $p->images ?? [];
                if (!is_array($images) || empty($images)) continue;
                $missingImages = [];
                foreach ($images as $idx => $img) {
                    $filename = $this->extractBlogFilename($img);
                    if (!$filename) continue;
                    $storagePath = 'properties/' . $filename;
                    $publicFallback = public_path('images/properties/' . $filename);
                    $existsInStorage = Storage::disk('public')->exists($storagePath);
                    $existsInPublic = file_exists($publicFallback);
                    if (! $existsInStorage && ! $existsInPublic) {
                        $missingImages[] = ['index' => $idx, 'image' => $img, 'expected_storage' => $storagePath];
                    }
                }
                if (!empty($missingImages)) {
                    $missing[] = ['id' => $p->id, 'title' => $p->title, 'missing_images' => $missingImages];
                }
            }
        } elseif ($type === 'profile_pictures') {
            $users = User::all();
            foreach ($users as $u) {
                $img = $u->profile_picture ?? null;
                if (!$img) continue;
                $filename = $this->extractBlogFilename($img);
                if (!$filename) continue;
                $storagePath = 'profile_pictures/' . $filename;
                $publicFallback = public_path('images/profile_pictures/' . $filename);
                $existsInStorage = Storage::disk('public')->exists($storagePath);
                $existsInPublic = file_exists($publicFallback);
                if (! $existsInStorage && ! $existsInPublic) {
                    $missing[] = ['id' => $u->id, 'title' => $u->name ?? $u->email, 'image' => $u->profile_picture, 'expected_storage' => $storagePath];
                }
            }
        } elseif ($type === 'services') {
            // If a `services` table exists, try to scan its `image` column (best-effort)
            if (Schema::hasTable('services')) {
                $rows = DB::table('services')->select('id', 'image', 'title')->get();
                foreach ($rows as $r) {
                    $img = $r->image ?? null;
                    if (!$img) continue;
                    $filename = $this->extractBlogFilename($img);
                    if (!$filename) continue;
                    $storagePath = 'services/' . $filename;
                    $publicFallback = public_path('images/services/' . $filename);
                    $existsInStorage = Storage::disk('public')->exists($storagePath);
                    $existsInPublic = file_exists($publicFallback);
                    if (! $existsInStorage && ! $existsInPublic) {
                        $missing[] = ['id' => $r->id, 'title' => $r->title ?? null, 'image' => $r->image, 'expected_storage' => $storagePath];
                    }
                }
            }
        }

        return response()->json(['missing' => $missing]);
    }

    // Repair missing images by setting them to a provided default (or null)
    public function repairMissingBlogImages(Request $request)
    {
        $default = $request->input('defaultImage', '/images/blogs/blog1.jpeg');
        // For backward compatibility keep previous behaviour when type not provided
        $type = $request->input('type', 'blogs');
        $repaired = 0;

        if ($type === 'blogs') {
            $posts = BlogPost::all();
            foreach ($posts as $post) {
                $img = $post->image;
                if (!$img) continue;
                $filename = $this->extractBlogFilename($img);
                if (!$filename) continue;
                $storagePath = 'blogs/' . $filename;
                $publicFallback = public_path('images/blogs/' . $filename);
                $existsInStorage = Storage::disk('public')->exists($storagePath);
                $existsInPublic = file_exists($publicFallback);
                if (! $existsInStorage && ! $existsInPublic) {
                    $post->image = $default;
                    $post->save();
                    $repaired++;
                }
            }
        } elseif ($type === 'properties') {
            $props = Property::all();
            foreach ($props as $p) {
                $images = $p->images ?? [];
                if (!is_array($images) || empty($images)) continue;
                $changed = false;
                foreach ($images as $idx => $img) {
                    $filename = $this->extractBlogFilename($img);
                    if (!$filename) continue;
                    $storagePath = 'properties/' . $filename;
                    $publicFallback = public_path('images/properties/' . $filename);
                    $existsInStorage = Storage::disk('public')->exists($storagePath);
                    $existsInPublic = file_exists($publicFallback);
                    if (! $existsInStorage && ! $existsInPublic) {
                        $images[$idx] = $default;
                        $changed = true;
                    }
                }
                if ($changed) { $p->images = array_values($images); $p->save(); $repaired++; }
            }
        } elseif ($type === 'profile_pictures') {
            $users = User::all();
            foreach ($users as $u) {
                $img = $u->profile_picture ?? null;
                if (!$img) continue;
                $filename = $this->extractBlogFilename($img);
                if (!$filename) continue;
                $storagePath = 'profile_pictures/' . $filename;
                $publicFallback = public_path('images/profile_pictures/' . $filename);
                $existsInStorage = Storage::disk('public')->exists($storagePath);
                $existsInPublic = file_exists($publicFallback);
                if (! $existsInStorage && ! $existsInPublic) {
                    $u->profile_picture = $default;
                    $u->save();
                    $repaired++;
                }
            }
        } elseif ($type === 'services') {
            if (Schema::hasTable('services')) {
                $rows = DB::table('services')->select('id', 'image')->get();
                foreach ($rows as $r) {
                    $img = $r->image ?? null;
                    if (!$img) continue;
                    $filename = $this->extractBlogFilename($img);
                    if (!$filename) continue;
                    $storagePath = 'services/' . $filename;
                    $publicFallback = public_path('images/services/' . $filename);
                    $existsInStorage = Storage::disk('public')->exists($storagePath);
                    $existsInPublic = file_exists($publicFallback);
                    if (! $existsInStorage && ! $existsInPublic) {
                        DB::table('services')->where('id', $r->id)->update(['image' => $default]);
                        $repaired++;
                    }
                }
            }
        }

        return response()->json(['repaired' => $repaired]);
    }

    // Repair a single post by id (set image to provided default or null)
    public function repairSingleBlogImage(Request $request, $id)
    {
        $default = $request->input('defaultImage', '/images/blogs/blog1.jpeg');
        $post = BlogPost::find($id);
        if (! $post) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $post->image = $default;
        $post->save();

        return response()->json(['repaired' => 1, 'id' => $post->id]);
    }

    // Generic single-item repair for different types
    public function repairSingleMedia(Request $request, $type, $id)
    {
        $default = $request->input('defaultImage', '/images/blogs/blog1.jpeg');
        // Support uploading a replacement file in this single-item repair endpoint.
        // If a file is provided, store it in the proper storage folder and update the DB
        // with the storage URL (Storage::url).
        $uploadedFile = $request->file('file');
        if ($type === 'blogs') {
            $post = BlogPost::find($id);
            if (! $post) return response()->json(['message' => 'Not found'], 404);
            if ($uploadedFile) {
                $path = $uploadedFile->store('blogs', 'public');
                $post->image = Storage::url($path);
            } else {
                $post->image = $default;
            }
            $post->save();
            return response()->json(['repaired' => 1, 'id' => $post->id]);
        }
        if ($type === 'properties') {
            $p = Property::find($id);
            if (! $p) return response()->json(['message' => 'Not found'], 404);
            $images = $p->images ?? [];
            if (is_array($images) && count($images) > 0) {
                // replace any missing entries with default
                foreach ($images as $i => $img) {
                    $filename = $this->extractBlogFilename($img);
                    $storagePath = $filename ? ('properties/' . $filename) : null;
                    $exists = $storagePath ? Storage::disk('public')->exists($storagePath) : true;
                    $publicFallback = $filename ? public_path('images/properties/' . $filename) : null;
                    if ($filename && ! $exists && ! file_exists($publicFallback)) {
                        $images[$i] = $default;
                    }
                }
                $p->images = array_values($images); $p->save();
            }
            // If a single file was uploaded and there were no images or we want to append,
            // store uploaded file as a new property image and save.
            if ($uploadedFile && !empty($uploadedFile->getClientOriginalName())) {
                $path = $uploadedFile->store('properties', 'public');
                $arr = $p->images ?? [];
                $arr[] = Storage::url($path);
                $p->images = $arr; $p->save();
            }
            return response()->json(['repaired' => 1, 'id' => $p->id]);
        }
        if ($type === 'profile_pictures') {
            $u = User::find($id);
            if (! $u) return response()->json(['message' => 'Not found'], 404);
            if ($uploadedFile) {
                $path = $uploadedFile->store('profile_pictures', 'public');
                $u->profile_picture = Storage::url($path);
            } else {
                $u->profile_picture = $default;
            }
            $u->save();
            return response()->json(['repaired' => 1, 'id' => $u->id]);
        }
        if ($type === 'services' && Schema::hasTable('services')) {
            $r = DB::table('services')->where('id', $id)->first();
            if (! $r) return response()->json(['message' => 'Not found'], 404);
            DB::table('services')->where('id', $id)->update(['image' => $default]);
            return response()->json(['repaired' => 1, 'id' => $id]);
        }
        return response()->json(['message' => 'Unsupported type'], 400);
    }

    // Helper: extract filename for blogs from various possible image formats
    private function extractBlogFilename($img)
    {
        if (!$img || !is_string($img)) return null;

        // If it's an absolute URL, try to pull trailing filename
        if (preg_match('#https?://#i', $img)) {
            // If contains /storage/ or /blogs/ try to find after blogs/
            if (preg_match('#/storage/.*/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
            if (preg_match('#/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
            // Fallback to basename
            return basename(parse_url($img, PHP_URL_PATH));
        }

        // root-relative storage path
        if (strpos($img, '/storage/') === 0) {
            if (preg_match('#/storage/.*/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
            if (preg_match('#/storage/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
        }

        // storage/... or blogs/... or blog/... or public/...
        $candidates = ['blogs/', '/blogs/', 'blog/', '/blog/', 'storage/blogs/', '/storage/blogs/'];
        foreach ($candidates as $prefix) {
            if (stripos($img, $prefix) === 0) {
                return ltrim(substr($img, strlen($prefix)), '/');
            }
        }

        // If the string ends with an image filename, return basename
        if (preg_match('#[\\w\\-]+\\.(jpg|jpeg|png|gif|webp)$#i', $img)) {
            return basename($img);
        }

        return null;
    }
}
