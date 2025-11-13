<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * 🧾 List all agents (pending and approved)
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
     * ✅ Approve an agent
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
