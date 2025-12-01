<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consultation;

class ConsultationController extends Controller
{
    /**
     * Get all consultations
     * 
     * @OA\Get(
     *     path="/consultations",
     *     tags={"Consultations"},
     *     summary="Get all consultations (Admin only)",
     *     description="Retrieve list of consultation requests with optional limit",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         description="Maximum number of results (1-25)",
     *         @OA\Schema(type="integer", default=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of consultations",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Consultation"))
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only")
     * )
     */
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

    /**
     * Book a consultation
     * 
     * @OA\Post(
     *     path="/consultations",
     *     tags={"Consultations"},
     *     summary="Book a consultation",
     *     description="Submit a consultation request. Public endpoint.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "phone"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="phone", type="string", example="+1234567890"),
     *             @OA\Property(property="message", type="string", example="I would like to schedule a consultation...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Consultation booked successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Consultation booked successfully!"),
     *             @OA\Property(property="data", ref="#/components/schemas/Consultation")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
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

    /**
     * Respond to consultation
     * 
     * @OA\Put(
     *     path="/consultations/{consultation}",
     *     tags={"Consultations"},
     *     summary="Respond to consultation (Admin only)",
     *     description="Update consultation status and add response message",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="consultation",
     *         in="path",
     *         required=true,
     *         description="Consultation ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"pending", "responded", "closed"}),
     *             @OA\Property(property="response_message", type="string", example="Thank you for your consultation request...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Consultation updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Consultation updated successfully!"),
     *             @OA\Property(property="data", ref="#/components/schemas/Consultation")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only"),
     *     @OA\Response(response=404, description="Consultation not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
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
