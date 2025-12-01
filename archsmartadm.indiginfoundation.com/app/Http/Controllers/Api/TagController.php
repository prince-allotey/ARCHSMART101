<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BlogPost;

class TagController extends Controller
{
    /**
     * Get blog post tags
     * 
     * @OA\Get(
     *     path="/tags",
     *     tags={"Tags"},
     *     summary="Get blog post tags",
     *     description="Retrieve unique tags from all blog posts, with optional search filter",
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Search query for tags",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of tags",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="string"),
     *             example={"real-estate", "tips", "buying", "selling"}
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        // aggregate tags from blog_posts.tags JSON column
        $q = $request->get('q');
        $all = BlogPost::whereNotNull('tags')->pluck('tags')->flatten()->filter()->values()->all();
        $unique = array_values(array_unique($all));
        if($q){
            $unique = array_values(array_filter($unique, fn($t)=> stripos($t, $q) !== false));
        }
        return response()->json(array_slice($unique, 0, 20));
    }
}
