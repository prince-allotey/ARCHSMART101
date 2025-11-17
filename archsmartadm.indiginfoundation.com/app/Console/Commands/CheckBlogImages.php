<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;

class CheckBlogImages extends Command
{
    protected $signature = 'check:blog-images {--repair : Replace missing images with default /images/blogs/blog1.jpeg}';
    protected $description = 'Scan blog posts and report image references that point to missing files in storage or public images';

    public function handle()
    {
        $this->info('Scanning blog posts for missing images...');
        $posts = BlogPost::all();
        $missing = [];

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

        if (empty($missing)) {
            $this->info('No missing images found.');
            return 0;
        }

        $this->table(['id','title','image','expected_storage'], $missing);

        if ($this->option('repair')) {
            $this->info('Repairing missing images by setting to /images/blogs/blog1.jpeg');
            $count = 0;
            foreach ($missing as $m) {
                $p = BlogPost::find($m['id']);
                if ($p) { $p->image = '/images/blogs/blog1.jpeg'; $p->save(); $count++; }
            }
            $this->info("Repaired {$count} posts.");
        }

        return 0;
    }

    private function extractBlogFilename($img)
    {
        if (!$img || !is_string($img)) return null;
        if (preg_match('#https?://#i', $img)) {
            if (preg_match('#/storage/.*/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
            if (preg_match('#/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
            return basename(parse_url($img, PHP_URL_PATH));
        }
        if (strpos($img, '/storage/') === 0) {
            if (preg_match('#/storage/.*/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
            if (preg_match('#/storage/blogs/(.+)$#i', $img, $m)) return ltrim($m[1], '/');
        }
        $candidates = ['blogs/', '/blogs/', 'blog/', '/blog/', 'storage/blogs/', '/storage/blogs/'];
        foreach ($candidates as $prefix) {
            if (stripos($img, $prefix) === 0) {
                return ltrim(substr($img, strlen($prefix)), '/');
            }
        }
        if (preg_match('#[\\w\\-]+\\.(jpg|jpeg|png|gif|webp)$#i', $img)) {
            return basename($img);
        }
        return null;
    }
}
