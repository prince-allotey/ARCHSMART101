<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\BlogPost;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Get comments for blog post
     * 
     * @OA\Get(
     *     path="/posts/{postId}/comments",
     *     tags={"Comments"},
     *     summary="Get blog post comments",
     *     description="Retrieve all comments for a specific blog post",
     *     @OA\Parameter(
     *         name="postId",
     *         in="path",
     *         required=true,
     *         description="Blog Post ID or slug",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of comments",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="post_id", type="integer"),
     *                 @OA\Property(property="user_id", type="integer", nullable=true),
     *                 @OA\Property(property="name", type="string", nullable=true),
     *                 @OA\Property(property="email", type="string", nullable=true),
     *                 @OA\Property(property="body", type="string"),
     *                 @OA\Property(property="created_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=404, description="Blog post not found")
     * )
     */
    public function index($postId)
    {
        $post = BlogPost::where('id', $postId)->orWhere('slug', $postId)->firstOrFail();
        $comments = Comment::where('post_id', $post->id)->orderBy('created_at', 'desc')->get();
        return response()->json($comments);
    }

    /**
     * Post a comment
     * 
     * @OA\Post(
     *     path="/posts/{postId}/comments",
     *     tags={"Comments"},
     *     summary="Post a comment",
     *     description="Add a comment to a blog post. Authenticated users auto-fill name/email.",
     *     @OA\Parameter(
     *         name="postId",
     *         in="path",
     *         required=true,
     *         description="Blog Post ID or slug",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"body"},
     *             @OA\Property(property="body", type="string", maxLength=2000, example="Great article!"),
     *             @OA\Property(property="name", type="string", maxLength=120, example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Comment posted",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="body", type="string"),
     *             @OA\Property(property="created_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Blog post not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request, $postId)
    {
        $post = BlogPost::where('id', $postId)->orWhere('slug', $postId)->firstOrFail();
        $v = Validator::make($request->all(), [
            'body' => 'required|string|max:2000',
            'name' => 'nullable|string|max:120',
            'email' => 'nullable|email',
        ]);
        if($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $data = $v->validated();
        $data['post_id'] = $post->id;
        if(Auth::check()) $data['user_id'] = Auth::id();

        $c = Comment::create($data);
        return response()->json($c, 201);
    }
}
