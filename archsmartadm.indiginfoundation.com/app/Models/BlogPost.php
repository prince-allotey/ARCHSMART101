<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'subtitle', 'slug', 'excerpt', 'summary', 'content',
        'category', 'tags', 'is_featured', 'status', 'published_at',
        'read_time', 'estimated_read_time', 'reading_level',
        'meta_title', 'meta_description', 'seo_keywords', 'canonical_url',
        'image', 'secondary_image', 'cover_image_alt', 'external_sources', 'layout'
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title) . '-' . uniqid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
