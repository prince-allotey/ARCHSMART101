<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Get user notifications
     * 
     * @OA\Get(
     *     path="/notifications",
     *     tags={"Notifications"},
     *     summary="Get user notifications",
     *     description="Retrieve list of notifications for authenticated user, sorted by unread first",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         description="Maximum number of results (1-100)",
     *         @OA\Schema(type="integer", default=20)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of notifications",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="user_id", type="integer"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="body", type="string"),
     *                 @OA\Property(property="data", type="object"),
     *                 @OA\Property(property="read_at", type="string", format="date-time", nullable=true),
     *                 @OA\Property(property="created_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
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

    /**
     * Get unread notification count
     * 
     * @OA\Get(
     *     path="/notifications/unread-count",
     *     tags={"Notifications"},
     *     summary="Get unread notification count",
     *     description="Retrieve count of unread notifications for authenticated user",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Unread count",
     *         @OA\JsonContent(
     *             @OA\Property(property="unread", type="integer", example=5)
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function unreadCount()
    {
        $user = Auth::user();
        $count = Notification::where('user_id', $user->id)->whereNull('read_at')->count();
        return response()->json(['unread' => $count]);
    }

    /**
     * Mark notification as read
     * 
     * @OA\Post(
     *     path="/notifications/{id}/read",
     *     tags={"Notifications"},
     *     summary="Mark notification as read",
     *     description="Mark a single notification as read",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Notification ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Notification marked as read",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Marked as read")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Notification not found")
     * )
     */
    public function markRead($id)
    {
        $user = Auth::user();
        $n = Notification::where('user_id', $user->id)->where('id', $id)->first();
        if (!$n) return response()->json(['message' => 'Not found'], 404);
        if (!$n->read_at) { $n->read_at = now(); $n->save(); }
        return response()->json(['message' => 'Marked as read']);
    }

    /**
     * Mark all notifications as read
     * 
     * @OA\Post(
     *     path="/notifications/read-all",
     *     tags={"Notifications"},
     *     summary="Mark all notifications as read",
     *     description="Mark all unread notifications as read for authenticated user",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="All notifications marked as read",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="All notifications marked as read")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function markAllRead()
    {
        $user = Auth::user();
        Notification::where('user_id', $user->id)->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(['message' => 'All notifications marked as read']);
    }
}
