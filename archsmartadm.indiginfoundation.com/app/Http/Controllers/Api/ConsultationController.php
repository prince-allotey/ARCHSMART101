<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consultation;

class ConsultationController extends Controller
{
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
}
