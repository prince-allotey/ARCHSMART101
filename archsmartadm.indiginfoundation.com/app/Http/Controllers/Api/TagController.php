<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BlogPost;

class TagController extends Controller
{
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
