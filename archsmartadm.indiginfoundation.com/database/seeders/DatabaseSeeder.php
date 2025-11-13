<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\BlogPost;
use App\Models\Property;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin (safety: prevent duplicate admins)
        $existingAdmin = User::where('role', 'admin')->first();
        if ($existingAdmin) {
            // Normalize to desired canonical email if different
            if ($existingAdmin->email !== 'admin@gmail.com') {
                $existingAdmin->email = 'admin@gmail.com';
                $existingAdmin->save();
            }
            $admin = $existingAdmin; // reuse existing
        } else {
            $admin = User::create([
                'name' => 'Admin User',
                'email' => 'admin@gmail.com',
                'role' => 'admin',
                'password' => Hash::make('password'),
            ]);
        }

        // Agent (idempotent by email)
        $agent = User::where('email', 'agent@example.com')->first();
        if (!$agent) {
            $agent = User::create([
                'name' => 'Agent One',
                'email' => 'agent@example.com',
                'role' => 'agent',
                'password' => Hash::make('password'),
            ]);
        }

        // Sample blog
        BlogPost::create([
            'user_id' => $admin->id,
            'title' => 'Smart Home Technology Trends in Ghana 2025',
            'excerpt' => 'Discover the latest smart home innovations transforming Ghanaian properties and how they add value to your investment.',
            'content' => 'Smart home technology is revolutionizing the Ghanaian real estate market. From automated lighting systems to advanced security features, modern properties are becoming more efficient, secure, and comfortable than ever before...',
            'category' => 'smart-living',
            'status' => 'published',
            'is_featured' => true,
            'published_at' => now()->subDays(2),
            'read_time' => 5,
            'meta_title' => 'Smart Home Technology Trends in Ghana 2025',
            'meta_description' => 'Explore the latest smart home innovations transforming Ghanaian properties in 2025.',
            'tags' => ['smart home','technology','ghana','real estate'],
            'slug' => Str::slug('Smart Home Technology Trends in Ghana 2025') . '-' . Str::random(5),
        ]);

        // Pending property (agent-created -> should appear in admin approvals)
        Property::create([
            'agent_id' => $agent->id,
            'title' => 'Luxury Smart Villa in East Legon',
            'slug' => Str::slug('Luxury Smart Villa in East Legon') . '-' . Str::random(6),
            'location' => 'East Legon, Accra',
            'price' => 1250000,
            'bedrooms' => 5,
            'bathrooms' => 6,
            'size' => 520,
            'type' => 'Villa',
            'images' => ['/images/properties/villa1.webp'],
            'is_featured' => true,
            'status' => 'pending',
        ]);

        // Approved property (visible publicly)
        Property::create([
            'agent_id' => $agent->id,
            'title' => 'Modern Apartment in Cantonments',
            'slug' => Str::slug('Modern Apartment in Cantonments') . '-' . Str::random(6),
            'location' => 'Cantonments, Accra',
            'price' => 450000,
            'bedrooms' => 3,
            'bathrooms' => 3,
            'size' => 210,
            'type' => 'Apartment',
            'images' => ['/images/properties/apartment1.webp'],
            'is_featured' => false,
            'status' => 'approved',
        ]);
    }
}
