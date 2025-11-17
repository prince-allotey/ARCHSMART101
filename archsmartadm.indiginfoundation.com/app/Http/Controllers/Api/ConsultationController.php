<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consultation;

class ConsultationController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 10);
        $limit = max(1, min($limit, 25));

        $consultations = Consultation::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'total' => Consultation::count(),
            'data' => $consultations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'required|string|max:20',
            'message' => 'nullable|string',
        ]);

        $consultation = Consultation::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Consultation booked successfully!',
            'data' => $consultation
        ], 201);
    }

    public function respond(Request $request, Consultation $consultation)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,responded,closed'],
            'response_message' => 'nullable|string',
        ]);

        $consultation->update([
            'status' => $validated['status'],
            'response_message' => $validated['response_message'] ?? null,
            'responded_at' => $validated['status'] === 'pending' ? null : now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Consultation updated successfully!',
            'data' => $consultation->refresh(),
        ]);
    }
}
