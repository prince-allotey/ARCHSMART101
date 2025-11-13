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

    public function show(Inquiry $inquiry)
    {
        $inquiry->load(['property', 'user']);
        return response()->json(['inquiry' => $inquiry]);
    }

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

    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }

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
