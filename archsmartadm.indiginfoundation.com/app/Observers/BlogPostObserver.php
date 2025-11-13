<?php

namespace App\Observers;

use App\Models\BlogPost;
use Illuminate\Support\Str;

class BlogPostObserver
{
    public function creating(BlogPost $post)
    {
        // ensure slug is present and unique
        $base = Str::slug($post->title ?: 'post');
        $slug = $post->slug ? Str::slug($post->slug) : $base;
        if (BlogPost::where('slug', $slug)->exists()) {
            $slug = $base . '-' . uniqid();
            while (BlogPost::where('slug', $slug)->exists()) {
                $slug = $base . '-' . uniqid();
            }
        }
        $post->slug = $slug;
    }

    public function updating(BlogPost $post)
    {
        // regenerate slug when title changes and slug not explicitly provided
        if ($post->isDirty('title') && !$post->isDirty('slug')) {
            $base = Str::slug($post->title ?: 'post');
            $slug = $base;
            if (BlogPost::where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
                $slug = $base . '-' . uniqid();
                while (BlogPost::where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
                    $slug = $base . '-' . uniqid();
                }
            }
            $post->slug = $slug;
        }
    }
}
