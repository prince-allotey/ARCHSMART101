<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdvertRequest;

class AdvertRequestController extends Controller
{
    // Submit a new advert request
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'business_category' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:50',
            'website_url' => 'nullable|url',
            'advert_details' => 'required|string',
            'target_audience' => 'required|string|in:buyers,sellers,renters,investors,all',
            'duration_months' => 'required|integer|in:1,3,6,12',
            'budget' => 'nullable|numeric|min:0',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('advert-logos', 'public');
            $validated['logo_path'] = $logoPath;
        }

        $advert = AdvertRequest::create($validated);
        return response()->json(['message' => 'Request submitted', 'advert' => $advert], 201);
    }

    // List all advert requests (admin only)
    public function index()
    {
        $adverts = AdvertRequest::orderByDesc('created_at')->get();
        return response()->json($adverts);
    }

    // Approve or reject an advert request (admin only)
    public function updateStatus(Request $request, $id)
    {
        $advert = AdvertRequest::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);
        $advert->status = $validated['status'];
        $advert->save();
        return response()->json(['message' => 'Status updated', 'advert' => $advert]);
    }

    // Mark as paid (admin only)
    public function markPaid(Request $request, $id)
    {
        $advert = AdvertRequest::findOrFail($id);
        $validated = $request->validate([
            'payment_method' => 'required|string',
            'payment_reference' => 'required|string',
        ]);
        $advert->status = 'paid';
        $advert->payment_method = $validated['payment_method'];
        $advert->payment_reference = $validated['payment_reference'];
        $advert->save();
        return response()->json(['message' => 'Payment recorded', 'advert' => $advert]);
    }
}
