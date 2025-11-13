<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 
        'email', 
        'password', 
        'role',
        'is_agent',
        'is_approved',
        'is_admin',
        'profile_picture',
        'profile_photo',
        'phone',
        'bio',
        'company',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $appends = ['profile_picture_url'];

    // Accessor for profile picture URL
    public function getProfilePictureUrlAttribute()
    {
        if (!$this->profile_picture) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($this->profile_picture, 'http://') || str_starts_with($this->profile_picture, 'https://')) {
            return $this->profile_picture;
        }

        // If it starts with /storage, prepend backend URL
        if (str_starts_with($this->profile_picture, '/storage')) {
            return config('app.url') . $this->profile_picture;
        }

        // Otherwise, assume it's in storage/app/public
        return config('app.url') . '/storage/' . $this->profile_picture;
    }

    // relations
    public function blogPosts()
    {
        return $this->hasMany(BlogPost::class, 'author_id');
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'agent_id');
    }

    // favorites (if used)
    public function favorites()
    {
        return $this->belongsToMany(Property::class, 'favorites', 'user_id', 'property_id')->withTimestamps();
    }
}
