<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Draft extends Model
{
    protected $fillable = [
        'user_id', 'title','subtitle','excerpt','content','category','tags','meta_title','meta_description','canonical_url','is_featured','status','published_at'
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];
}
