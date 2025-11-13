<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $limit = max(1, min(100, (int)$request->query('limit', 20)));
        $notifications = Notification::where('user_id', $user->id)
            ->orderByRaw('read_at IS NULL DESC')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
        return response()->json($notifications);
    }

    public function unreadCount()
    {
        $user = Auth::user();
        $count = Notification::where('user_id', $user->id)->whereNull('read_at')->count();
        return response()->json(['unread' => $count]);
    }

    public function markRead($id)
    {
        $user = Auth::user();
        $n = Notification::where('user_id', $user->id)->where('id', $id)->first();
        if (!$n) return response()->json(['message' => 'Not found'], 404);
        if (!$n->read_at) { $n->read_at = now(); $n->save(); }
        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllRead()
    {
        $user = Auth::user();
        Notification::where('user_id', $user->id)->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(['message' => 'All notifications marked as read']);
    }
}
