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
     * 
     * @OA\Get(
     *     path="/dashboard/overview",
     *     tags={"Dashboard"},
     *     summary="Get dashboard overview",
     *     description="Retrieve dashboard metrics. Admins see system-wide statistics, agents see their own property data.",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard overview data",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="totals",
     *                 type="object",
     *                 @OA\Property(property="users", type="integer"),
     *                 @OA\Property(property="agents", type="integer"),
     *                 @OA\Property(property="admins", type="integer"),
     *                 @OA\Property(property="blog_posts", type="integer"),
     *                 @OA\Property(property="properties", type="integer"),
     *                 @OA\Property(property="featured_properties", type="integer")
     *             ),
     *             @OA\Property(property="recent_properties", type="array", @OA\Items(ref="#/components/schemas/Property")),
     *             @OA\Property(property="recent_blog_posts", type="array", @OA\Items(ref="#/components/schemas/BlogPost"))
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
