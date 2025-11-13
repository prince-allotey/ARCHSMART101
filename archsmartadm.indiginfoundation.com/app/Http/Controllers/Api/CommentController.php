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
    public function index($postId)
    {
        $post = BlogPost::where('id', $postId)->orWhere('slug', $postId)->firstOrFail();
        $comments = Comment::where('post_id', $post->id)->orderBy('created_at', 'desc')->get();
        return response()->json($comments);
    }

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
