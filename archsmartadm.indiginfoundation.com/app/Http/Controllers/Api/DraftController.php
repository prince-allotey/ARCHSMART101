<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Draft;
use Illuminate\Support\Facades\Auth;

class DraftController extends Controller
{
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

    public function show($id)
    {
        $d = Draft::findOrFail($id);
        return response()->json($d);
    }
}
