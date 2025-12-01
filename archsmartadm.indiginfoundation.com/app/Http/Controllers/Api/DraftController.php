<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Draft;
use Illuminate\Support\Facades\Auth;

class DraftController extends Controller
{
    /**
     * Save or update draft
     * 
     * @OA\Post(
     *     path="/drafts",
     *     tags={"Drafts"},
     *     summary="Save blog post draft",
     *     description="Create or update a blog post draft for autosave functionality",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="Draft ID to update (optional)"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="subtitle", type="string"),
     *             @OA\Property(property="excerpt", type="string"),
     *             @OA\Property(property="content", type="string"),
     *             @OA\Property(property="category", type="string"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="meta_title", type="string"),
     *             @OA\Property(property="meta_description", type="string"),
     *             @OA\Property(property="canonical_url", type="string"),
     *             @OA\Property(property="is_featured", type="boolean"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="published_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Draft saved",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="user_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->only(['title','subtitle','excerpt','content','category','tags','meta_title','meta_description','canonical_url','is_featured','status','published_at']);
        if($request->has('tags') && is_string($request->tags)){
            $decoded = json_decode($request->tags, true);
            if(is_array($decoded)) $data['tags'] = $decoded;
        }
        $data['user_id'] = Auth::id();

        // if id exists, update
        if($request->input('id')){
            $d = Draft::find($request->input('id'));
            if($d){ $d->update($data); return response()->json($d); }
        }

        $d = Draft::create($data);
        return response()->json($d);
    }

    /**
     * Get draft by ID
     * 
     * @OA\Get(
     *     path="/drafts/{id}",
     *     tags={"Drafts"},
     *     summary="Get draft by ID",
     *     description="Retrieve a saved blog post draft",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Draft ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Draft details",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="content", type="string"),
     *             @OA\Property(property="user_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Draft not found")
     * )
     */
    public function show($id)
    {
        $d = Draft::findOrFail($id);
        return response()->json($d);
    }
}
