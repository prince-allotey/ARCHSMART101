<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * 🧘 List all agents (pending and approved)
     * 
     * @OA\Get(
     *     path="/admin/agents",
     *     tags={"Admin"},
     *     summary="Get all agents (Admin only)",
     *     description="Retrieve list of all agents with their status and approval information",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of agents",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="is_approved", type="boolean"),
     *                 @OA\Property(property="created_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only")
     * )
     */
    public function index()
    {
        $agents = User::where('role', 'agent')
            ->select('id', 'name', 'email', 'status', 'is_approved', 'created_at')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($agents);
    }

    /**
     * 📋 List pending agents only
     * 
     * @OA\Get(
     *     path="/admin/agents/pending",
     *     tags={"Admin"},
     *     summary="Get pending agents (Admin only)",
     *     description="Retrieve list of agents awaiting approval",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of pending agents",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="is_approved", type="boolean"),
     *                 @OA\Property(property="created_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only")
     * )
     */
    public function listPendingAgents()
    {
        $agents = User::where('role', 'agent')
            ->where('is_approved', false)
            ->select('id', 'name', 'email', 'status', 'is_approved', 'created_at')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($agents);
    }

    /**
     * ✅ Approve an agent
     * 
     * @OA\Post(
     *     path="/admin/agents/{id}/approve",
     *     tags={"Admin"},
     *     summary="Approve an agent (Admin only)",
     *     description="Approve a pending agent registration",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Agent User ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Agent approved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Agent approved successfully"),
     *             @OA\Property(property="user", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(response=400, description="User is not an agent"),
     *     @OA\Response(response=403, description="Forbidden - Admin only"),
     *     @OA\Response(response=404, description="User not found")
     * )
     */
    public function approveAgent($id)
    {
        $user = User::findOrFail($id);

        if ($user->role !== 'agent') {
            return response()->json(['message' => 'User is not an agent'], 400);
        }

        $user->is_approved = true;
        $user->status = 'active';
        $user->save();

        return response()->json(['message' => 'Agent approved successfully', 'user' => $user]);
    }

    /**
     * 🚫 Suspend or deactivate an agent
     * 
     * @OA\Post(
     *     path="/admin/agents/{id}/suspend",
     *     tags={"Admin"},
     *     summary="Suspend an agent (Admin only)",
     *     description="Suspend or deactivate an agent account",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Agent User ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Agent suspended successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Agent suspended successfully"),
     *             @OA\Property(property="user", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(response=400, description="User is not an agent"),
     *     @OA\Response(response=403, description="Forbidden - Admin only"),
     *     @OA\Response(response=404, description="User not found")
     * )
     */
    public function suspendAgent($id)
    {
        $user = User::findOrFail($id);

        if ($user->role !== 'agent') {
            return response()->json(['message' => 'User is not an agent'], 400);
        }

        $user->is_approved = false;
        $user->status = 'suspended';
        $user->save();

        return response()->json(['message' => 'Agent suspended successfully', 'user' => $user]);
    }
}
