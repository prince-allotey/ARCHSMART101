<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'title',
        'slug',
        'description',
        'location',
        'price',
        'bedrooms',
        'bathrooms',
        'size',
        'type',
        'images',
        'is_featured',
        'is_smart_home',
        'status',
        'agent_name',
        'agent_phone',
        'agent_email',
    ];

    protected $casts = [
        'images' => 'array',
        'is_featured' => 'boolean',
        'is_smart_home' => 'boolean',
    ];

    // Don't append image_urls by default to improve performance
    // protected $appends = ['image_urls'];

    protected static function booted()
    {
        static::creating(function ($property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->title . '-' . uniqid());
            }
        });
    }

    // Accessor to return full image URLs
    public function getImageUrlsAttribute()
    {
        if (!$this->images || !is_array($this->images)) {
            return [];
        }

        return array_map(function ($path) {
            // If path already contains http, return as is
            if (str_starts_with($path, 'http')) {
                return $path;
            }
            
            // If path starts with /storage, prepend backend URL
            if (str_starts_with($path, '/storage/')) {
                return config('app.url') . $path;
            }
            
            // If path starts with storage/, prepend backend URL
            if (str_starts_with($path, 'storage/')) {
                return config('app.url') . '/' . $path;
            }
            
            // Otherwise, assume it's relative path like 'properties/xyz.jpg'
            // Prepend /storage/ to match Laravel's storage:link structure
            return config('app.url') . '/storage/' . $path;
        }, $this->images);
    }

    // 🔗 Relationship: Property belongs to an Agent (User)
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}
