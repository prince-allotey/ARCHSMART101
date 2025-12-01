<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\InquiryReceived;
use App\Mail\InquiryResponse;
use Illuminate\Support\Facades\Log;

class InquiryController extends Controller
{
    /**
     * Get all inquiries
     * 
     * @OA\Get(
     *     path="/inquiries",
     *     tags={"Inquiries"},
     *     summary="Get all inquiries",
     *     description="Retrieve paginated list of inquiries with optional filters. Authenticated users only.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         @OA\Schema(type="string", enum={"pending", "responded", "closed"})
     *     ),
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Filter by inquiry type",
     *         @OA\Schema(type="string", enum={"property-inquiry", "investment-consultation", "smart-home", "interior-design", "general"})
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search in name, email, subject, or message",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page",
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Paginated list of inquiries",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Inquiry")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request)
    {
        $query = Inquiry::with(['property', 'user'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->paginate($request->get('per_page', 15));

        return response()->json($inquiries);
    }

    /**
     * Submit new inquiry
     * 
     * @OA\Post(
     *     path="/inquiries",
     *     tags={"Inquiries"},
     *     summary="Submit a new inquiry",
     *     description="Submit a general or property-specific inquiry. Public endpoint.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "subject", "message", "type"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="phone", type="string", example="+1234567890"),
     *             @OA\Property(property="subject", type="string", example="Inquiry about property"),
     *             @OA\Property(property="message", type="string", example="I'm interested in this property..."),
     *             @OA\Property(property="type", type="string", enum={"property-inquiry", "investment-consultation", "smart-home", "interior-design", "general"}, example="property-inquiry"),
     *             @OA\Property(property="property_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Inquiry submitted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Inquiry submitted successfully. We will get back to you soon."),
     *             @OA\Property(property="inquiry", ref="#/components/schemas/Inquiry")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:property-inquiry,investment-consultation,smart-home,interior-design,general',
            'property_id' => 'nullable|exists:properties,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $inquiry = Inquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'type' => $request->type,
            'property_id' => $request->property_id,
            'user_id' => $request->user()?->id,
        ]);

        try {
            Mail::to(config('mail.admin_email', 'admin@archsmart.gh'))
                ->send(new InquiryReceived($inquiry));
        } catch (\Exception $e) {
            Log::error("Inquiry mail failed for inquiry ID {$inquiry->id}: {$e->getMessage()}");
        }

        return response()->json([
            'message' => 'Inquiry submitted successfully. We will get back to you soon.',
            'inquiry' => $inquiry
        ], Response::HTTP_CREATED);
    }

    /**
     * Get single inquiry
     * 
     * @OA\Get(
     *     path="/inquiries/{inquiry}",
     *     tags={"Inquiries"},
     *     summary="Get inquiry details",
     *     description="Retrieve details of a single inquiry",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="inquiry",
     *         in="path",
     *         required=true,
     *         description="Inquiry ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Inquiry details",
     *         @OA\JsonContent(
     *             @OA\Property(property="inquiry", ref="#/components/schemas/Inquiry")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Inquiry not found")
     * )
     */
    public function show(Inquiry $inquiry)
    {
        $inquiry->load(['property', 'user']);
        return response()->json(['inquiry' => $inquiry]);
    }

    /**
     * Update inquiry
     * 
     * @OA\Put(
     *     path="/inquiries/{inquiry}",
     *     tags={"Inquiries"},
     *     summary="Update inquiry status",
     *     description="Update inquiry status and add response message",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="inquiry",
     *         in="path",
     *         required=true,
     *         description="Inquiry ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", enum={"pending", "responded", "closed"}),
     *             @OA\Property(property="response_message", type="string", example="Thank you for your inquiry...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Inquiry updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Inquiry updated successfully"),
     *             @OA\Property(property="inquiry", ref="#/components/schemas/Inquiry")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Inquiry not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:pending,responded,closed',
            'response_message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $updateData = $request->only(['status', 'response_message']);

        if ($request->status === 'responded' && $inquiry->status !== 'responded') {
            $updateData['responded_at'] = now();
        }

        $inquiry->update($updateData);

        if ($request->filled('response_message')) {
            try {
                Mail::to($inquiry->email)->send(new InquiryResponse($inquiry));
            } catch (\Exception $e) {
                Log::error("Inquiry response mail failed for inquiry ID {$inquiry->id}: {$e->getMessage()}");
            }
        }

        return response()->json([
            'message' => 'Inquiry updated successfully',
            'inquiry' => $inquiry->load(['property', 'user'])
        ]);
    }

    /**
     * Delete inquiry
     * 
     * @OA\Delete(
     *     path="/inquiries/{inquiry}",
     *     tags={"Inquiries"},
     *     summary="Delete inquiry",
     *     description="Delete an inquiry",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="inquiry",
     *         in="path",
     *         required=true,
     *         description="Inquiry ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Inquiry deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Inquiry deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Inquiry not found")
     * )
     */
    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }

    /**
     * Get inquiry statistics
     * 
     * @OA\Get(
     *     path="/inquiries/statistics",
     *     tags={"Inquiries"},
     *     summary="Get inquiry statistics",
     *     description="Retrieve statistics about inquiries including counts by status and type",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Inquiry statistics",
     *         @OA\JsonContent(
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="pending", type="integer"),
     *             @OA\Property(property="responded", type="integer"),
     *             @OA\Property(property="closed", type="integer"),
     *             @OA\Property(property="by_type", type="object"),
     *             @OA\Property(property="recent", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function statistics()
    {
        $stats = [
            'total' => Inquiry::count(),
            'pending' => Inquiry::pending()->count(),
            'responded' => Inquiry::responded()->count(),
            'closed' => Inquiry::where('status', 'closed')->count(),
            'by_type' => Inquiry::selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
            'recent' => Inquiry::latest()->limit(5)->get(['id', 'name', 'subject', 'status', 'created_at']),
        ];

        return response()->json($stats);
    }

    public function propertyInquiry(Request $request, Property $property)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $inquiry = Inquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => "Inquiry about: {$property->title}",
            'message' => $request->message,
            'type' => 'property-inquiry',
            'property_id' => $property->id,
            'user_id' => $request->user()?->id,
        ]);

        try {
            if ($property->agent && $property->agent->email) {
                Mail::to($property->agent->email)
                    ->cc(config('mail.admin_email', 'admin@archsmart.gh'))
                    ->send(new InquiryReceived($inquiry));
            } else {
                Log::warning("Property {$property->id} has no agent email; inquiry ID {$inquiry->id} not sent.");
            }
        } catch (\Exception $e) {
            Log::error("Property inquiry mail failed for inquiry ID {$inquiry->id}: {$e->getMessage()}");
        }

        return response()->json([
            'message' => 'Property inquiry submitted successfully. The agent will contact you soon.',
            'inquiry' => $inquiry
        ], Response::HTTP_CREATED);
    }
}
