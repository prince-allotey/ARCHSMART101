<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\BlogPost;
use App\Models\Property;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    /**
     * Return dashboard overview metrics.
     * Admins see system-wide stats.
     * Agents see their own property data.
     */
    public function overview(Request $request)
    {
        try {
            $user = $request->user();
            $ttl = 60; // cache duration in seconds

            // ✅ Agent view (personalized dashboard)
            if ($user && $user->role === 'agent') {
                $agentData = Cache::remember("agent_dashboard_{$user->id}", $ttl, function () use ($user) {
                    $properties = Property::where('agent_id', $user->id)
                        ->latest()
                        ->take(5)
                        ->get(['id', 'title', 'price', 'location', 'status', 'created_at', 'images']);
                    
                    // Append image URLs for each property
                    $properties->each(function ($property) {
                        $property->append('image_urls');
                    });

                    return [
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'role' => $user->role,
                        ],
                        'total_properties' => Property::where('agent_id', $user->id)->count(),
                        'recent_properties' => $properties,
                    ];
                });

                return response()->json($agentData, 200);
            }

            // ✅ Admin view (global overview)
            $overview = Cache::remember('dashboard_overview', $ttl, function () {
                $recentProperties = Property::latest()
                    ->take(5)
                    ->get(['id', 'title', 'price', 'location', 'status', 'created_at', 'images']);
                
                // Append image URLs for each property
                $recentProperties->each(function ($property) {
                    $property->append('image_urls');
                });

                return [
                    'totals' => [
                        'users' => User::count(),
                        'agents' => User::where('role', 'agent')->count(),
                        'admins' => User::where('role', 'admin')->count(),
                        'blog_posts' => BlogPost::count(),
                        'properties' => Property::count(),
                        'featured_properties' => Property::where('is_featured', true)->count(),
                    ],
                    'recent_properties' => $recentProperties,
                    'recent_blog_posts' => BlogPost::latest()
                        ->take(5)
                        ->get(['id', 'title', 'category', 'published_at']),
                ];
            });

            return response()->json($overview, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to load dashboard data',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
