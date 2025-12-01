<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\PropertyApproved;
use App\Models\PushSubscription;
use App\Models\Notification;
use Minishlink\WebPush\Subscription as WebPushSubscription;
use Minishlink\WebPush\WebPush;

class PropertyController extends Controller
{
    /**
     * 🏡 Public: Get all approved properties
     * 
     * @OA\Get(
     *     path="/properties",
     *     tags={"Properties"},
     *     summary="Get all approved properties",
     *     description="Retrieve list of all approved properties with agent information",
     *     @OA\Response(
     *         response=200,
     *         description="List of approved properties",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Property")
     *         )
     *     )
     * )
     */
    public function index()
    {
        $properties = Property::where('status', 'approved')
            ->with('agent:id,name,email')
            ->latest()
            ->get();

        // Append image URLs for each property
        $properties->each(function ($property) {
            $property->append('image_urls');
        });

        return response()->json($properties);
    }

    /**
     * ⭐ Public: Get featured properties
     * 
     * @OA\Get(
     *     path="/properties/featured",
     *     tags={"Properties"},
     *     summary="Get featured properties",
     *     description="Retrieve up to 6 featured approved properties",
     *     @OA\Response(
     *         response=200,
     *         description="List of featured properties",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Property")
     *         )
     *     )
     * )
     */
    public function featured()
    {
        $featured = Property::where('is_featured', true)
            ->where('status', 'approved')
            ->latest()
            ->take(6)
            ->get();

        // Append image URLs for each property
        $featured->each(function ($property) {
            $property->append('image_urls');
        });

        return response()->json($featured);
    }

    /**
     * 🔍 Show single property
     * 
     * @OA\Get(
     *     path="/properties/{property}",
     *     tags={"Properties"},
     *     summary="Get single property details",
     *     description="Retrieve details of a single approved property with agent information",
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         required=true,
     *         description="Property ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Property details",
     *         @OA\JsonContent(ref="#/components/schemas/Property")
     *     ),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function show(Property $property)
    {
        // Only show approved properties on public route
        if ($property->status !== 'approved') {
            return response()->json(['message' => 'Property not found'], 404);
        }
        
        $property->load('agent:id,name,email,phone,bio');
        $property->append('image_urls');
        return response()->json($property);
    }

    /**
     * 🔍 View property (authenticated - can view own pending properties)
     * 
     * @OA\Get(
     *     path="/properties/{property}/view",
     *     tags={"Properties"},
     *     summary="View property (authenticated)",
     *     description="Authenticated users can view approved properties or their own pending properties. Admins can view all properties.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         required=true,
     *         description="Property ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Property details",
     *         @OA\JsonContent(ref="#/components/schemas/Property")
     *     ),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function viewProperty(Property $property)
    {
        $user = Auth::user();
        
        // Allow if property is approved (anyone authenticated can view)
        if ($property->status === 'approved') {
            $property->load('agent:id,name,email,phone,bio');
            $property->append('image_urls');
            return response()->json($property);
        }
        
        // Allow if user is admin
        if ($user->role === 'admin') {
            $property->load('agent:id,name,email,phone,bio');
            $property->append('image_urls');
            return response()->json($property);
        }
        
        // Allow if user is the agent who owns this property
        if ($property->agent_id == $user->id) {
            $property->load('agent:id,name,email,phone,bio');
            $property->append('image_urls');
            return response()->json($property);
        }
        
        return response()->json(['message' => 'You do not have permission to view this property'], 403);
    }

    /**
     * 🧑‍💼 Agent or Admin: Get own properties
     * 
     * @OA\Get(
     *     path="/properties/my",
     *     tags={"Properties"},
     *     summary="Get my properties",
     *     description="Get all properties for the authenticated user. Admins see all properties, agents see only their own.",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of user's properties",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Property")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function myProperties()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $properties = Property::with('agent:id,name,email')
                ->latest()
                ->get();
        } else {
            $properties = Property::where('agent_id', $user->id)
                ->latest()
                ->get();
        }

        // Append image URLs for each property
        $properties->each(function ($property) {
            $property->append('image_urls');
        });

        return response()->json($properties);
    }

    /**
     * ➕ Create new property (Agent or Admin)
     * 
     * @OA\Post(
     *     path="/properties",
     *     tags={"Properties"},
     *     summary="Create new property",
     *     description="Create a new property listing. Agents create pending properties, admins create approved properties.",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"title", "location", "price", "description"},
     *                 @OA\Property(property="title", type="string", example="Luxury Villa"),
     *                 @OA\Property(property="location", type="string", example="123 Main St, City"),
     *                 @OA\Property(property="address", type="string", example="123 Main St, City"),
     *                 @OA\Property(property="price", type="number", example=500000),
     *                 @OA\Property(property="bedrooms", type="integer", example=5),
     *                 @OA\Property(property="bathrooms", type="integer", example=3),
     *                 @OA\Property(property="size", type="number", example=3500),
     *                 @OA\Property(property="type", type="string", example="villa"),
     *                 @OA\Property(property="is_smart_home", type="boolean", example=false),
     *                 @OA\Property(property="description", type="string", example="Beautiful villa with pool"),
     *                 @OA\Property(property="agent_name", type="string", example="John Doe"),
     *                 @OA\Property(property="agent_phone", type="string", example="+1234567890"),
     *                 @OA\Property(property="agent_email", type="string", example="agent@example.com"),
     *                 @OA\Property(
     *                     property="images",
     *                     type="array",
     *                     @OA\Items(type="string", format="binary")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Property created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Property created successfully."),
     *             @OA\Property(property="property", ref="#/components/schemas/Property")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            // Accept either `location` or `address` for backward compatibility with frontend
            'location'    => 'required_without:address|string|max:255',
            'address'     => 'required_without:location|string|max:255',
            'price'       => 'required|numeric|min:0',
            'bedrooms'    => 'nullable|integer|min:0',
            'bathrooms'   => 'nullable|integer|min:0',
            'size'        => 'nullable|numeric|min:0',
            'type'        => 'nullable|string|max:100',
            'is_smart_home' => 'nullable|boolean',
            'images.*'    => 'nullable|image|max:4096',
            'description' => 'required|string',
            'agent_name'  => 'nullable|string|max:255',
            'agent_phone' => 'nullable|string|max:50',
            'agent_email' => 'nullable|email|max:255',
        ]);

        // Normalize: if frontend sent `address` but not `location`, map it to `location`
        if (empty($validated['location']) && !empty($validated['address'])) {
            $validated['location'] = $validated['address'];
            // optional: unset address so model doesn't try to fill a non-existing column
            unset($validated['address']);
        }

    $user = Auth::user();

    $property = new Property($validated);
        $property->agent_id = $user->id;
        $property->slug = Str::slug($validated['title'] . '-' . uniqid());
        $property->is_smart_home = $request->input('is_smart_home', false);

        $property->status = ($user->role === 'admin') ? 'approved' : 'pending';
        $property->save();

        // Notify admins when an agent creates a property (pending approval)
        try {
            if ($user->role !== 'admin') {
                $adminUsers = \App\Models\User::where('role', 'admin')->get(['id']);
                foreach ($adminUsers as $admin) {
                    Notification::create([
                        'user_id' => $admin->id,
                        'title'   => 'New property awaiting approval',
                        'body'    => $validated['title'] ?? 'A new property has been submitted.',
                        'data'    => [
                            'type' => 'property_created',
                            'property_id' => $property->id,
                            'agent_id' => $user->id,
                        ],
                    ]);
                }
                // Optional: push broadcast to admins
                $this->broadcastPush('New Property Pending', 'A new property requires approval', [
                    'route' => '/dashboard/properties?filter=pending'
                ]);
            }
        } catch (\Throwable $e) {
            // do not block flow on notification failure
            \Log::warning('Failed to create admin notifications', ['error' => $e->getMessage()]);
        }

        // Upload images
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                // Store and save only the relative path (e.g., 'properties/xyz.jpg')
                $path = $image->store('properties', 'public');
                $imagePaths[] = $path;
            }
            $property->images = $imagePaths;
            $property->save();
        }

        return response()->json([
            'message' => 'Property created successfully.',
            'property' => $property,
        ], 201);
    }

    /**
     * ✏️ Update property
     * 
     * @OA\Put(
     *     path="/properties/{id}",
     *     tags={"Properties"},
     *     summary="Update property",
     *     description="Update an existing property. Agents can update their own properties, admins can update any property.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Property ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated Villa"),
     *             @OA\Property(property="location", type="string", example="456 Updated St"),
     *             @OA\Property(property="price", type="number", example=550000),
     *             @OA\Property(property="bedrooms", type="integer", example=6),
     *             @OA\Property(property="bathrooms", type="integer", example=4),
     *             @OA\Property(property="size", type="number", example=4000),
     *             @OA\Property(property="type", type="string", example="villa"),
     *             @OA\Property(property="is_smart_home", type="boolean", example=true),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="status", type="string", enum={"pending", "approved", "rejected"}, description="Admin only")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Property updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Property updated successfully."),
     *             @OA\Property(property="property", ref="#/components/schemas/Property")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        $user = Auth::user();

        if ($property->agent_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            // Accept either `location` or `address` when updating
            'location'    => 'sometimes|string|max:255',
            'address'     => 'sometimes|string|max:255',
            'price'       => 'sometimes|numeric|min:0',
            'bedrooms'    => 'nullable|integer|min:0',
            'bathrooms'   => 'nullable|integer|min:0',
            'size'        => 'nullable|numeric|min:0',
            'type'        => 'nullable|string|max:100',
            'is_smart_home' => 'nullable|boolean',
            'description' => 'nullable|string',
            'images.*'    => 'nullable|image|max:4096',
            // Admin can optionally adjust status
            'status'      => 'sometimes|in:pending,approved,rejected',
        ]);

        // Normalize address -> location on update as well
        if (empty($validated['location']) && !empty($validated['address'])) {
            $validated['location'] = $validated['address'];
            unset($validated['address']);
        }

        // Prevent non-admin users from changing status even if passed
        if ($user->role !== 'admin') {
            unset($validated['status']);
        }

        $property->update($validated);

        // If admin set status=approved here, mimic approval side-effects (email + push) minimally
        if ($user->role === 'admin' && isset($validated['status']) && $validated['status'] === 'approved' && $property->wasChanged('status')) {
            try {
                $property->loadMissing('agent:id,name,email');
                if ($property->agent && $property->agent->email) {
                    Mail::to($property->agent->email)->queue(new PropertyApproved($property));
                }
            } catch (\Throwable $e) {
                \Log::warning('Failed to send approval email on inline update', ['error' => $e->getMessage()]);
            }
        }
        
        // Update is_smart_home if provided
        if ($request->has('is_smart_home')) {
            $property->is_smart_home = $request->input('is_smart_home', false);
            $property->save();
        }

        // Replace or append images
        if ($request->hasFile('images')) {
            $newUrls = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');
                $newUrls[] = Storage::url($path);
            }
            $property->images = array_merge($property->images ?? [], $newUrls);
            $property->save();
        }

        return response()->json(['message' => 'Property updated successfully.', 'property' => $property]);
    }

    /**
     * 🗑️ Delete property
     * 
     * @OA\Delete(
     *     path="/properties/{id}",
     *     tags={"Properties"},
     *     summary="Delete property",
     *     description="Delete a property. Agents can delete their own properties, admins can delete any property.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Property ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Property deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Property deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function destroy($id)
    {
        $property = Property::findOrFail($id);
        $user = Auth::user();

        if ($property->agent_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (is_array($property->images)) {
            foreach ($property->images as $url) {
                $path = str_replace('/storage/', '', $url);
                Storage::disk('public')->delete($path);
            }
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }

    /**
     * ✅ Approve property
     * 
     * @OA\Post(
     *     path="/properties/{id}/approve",
     *     tags={"Properties"},
     *     summary="Approve property (Admin only)",
     *     description="Approve a pending property listing. Sends notification to the agent.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Property ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Property approved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Property approved successfully."),
     *             @OA\Property(property="property", ref="#/components/schemas/Property")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function approve($id)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $property = Property::find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        try {
            $property->status = 'approved';
            $saved = $property->save();
            
            if (!$saved) {
                return response()->json(['message' => 'Failed to save property status'], 500);
            }
            
            // Reload to confirm
            $property->refresh();
            
            // Send email notification to the agent
            try {
                $property->loadMissing('agent:id,name,email');
                if ($property->agent && $property->agent->email) {
                    Mail::to($property->agent->email)->queue(new PropertyApproved($property));
                }
            } catch (\Throwable $e) {
                // Swallow email errors to not block approval action
                \Log::warning('Failed to send approval email', ['error' => $e->getMessage()]);
            }
            
            // Create in-app notification for the agent
            try {
                if ($property->agent_id) {
                    Notification::create([
                        'user_id' => $property->agent_id,
                        'title'   => 'Your property was approved',
                        'body'    => $property->title ?? 'Property approved',
                        'data'    => [
                            'type' => 'property_approved',
                            'property_id' => $property->id,
                        ],
                    ]);
                    // Optional: push broadcast to agent's devices
                    $this->broadcastPush('Property Approved', 'Your listing is now live', [
                        'property_id' => $property->id,
                    ]);
                }
            } catch (\Throwable $e) {
                \Log::warning('Failed to create agent notification', ['error' => $e->getMessage()]);
            }

            return response()->json([
                'message' => 'Property approved successfully.',
                'property' => $property
            ]);
        } catch (\Exception $e) {
            \Log::error('Property approval failed', [
                'property_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['message' => 'Failed to approve property: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 🚫 Reject property
     * 
     * @OA\Post(
     *     path="/properties/{id}/reject",
     *     tags={"Properties"},
     *     summary="Reject property (Admin only)",
     *     description="Reject a pending property listing",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Property ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Property rejected successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Property rejected successfully."),
     *             @OA\Property(property="property", ref="#/components/schemas/Property")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function reject($id)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $property = Property::find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        $property->status = 'rejected';
        $property->save();

        return response()->json(['message' => 'Property rejected successfully.', 'property' => $property]);
    }

    /**
     * ⏳ Pending properties (Admin only)
     * 
     * @OA\Get(
     *     path="/properties/pending",
     *     tags={"Properties"},
     *     summary="Get pending properties (Admin only)",
     *     description="Retrieve all properties awaiting approval",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of pending properties",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Property")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin only")
     * )
     */
    public function pending()
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pending = Property::where('status', 'pending')
            ->with('agent:id,name,email')
            ->latest()
            ->get();

        // Append image URLs for each property
        $pending->each(function ($property) {
            $property->append('image_urls');
        });

        return response()->json($pending);
    }

    /**
     * 🟢 Approved properties (Public)
     * 
     * @OA\Get(
     *     path="/properties/approved",
     *     tags={"Properties"},
     *     summary="Get approved properties",
     *     description="Retrieve all approved properties with agent information",
     *     @OA\Response(
     *         response=200,
     *         description="List of approved properties",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Property")
     *         )
     *     )
     * )
     */
    public function approved()
    {
        $approved = Property::where('status', 'approved')
            ->with('agent:id,name,email')
            ->latest()
            ->get();

        // Append image URLs for each property
        $approved->each(function ($property) {
            $property->append('image_urls');
        });

        return response()->json($approved);
    }

    /**
     * 🧑‍💼 Get all approved properties by a specific agent (Public)
     * 
     * @OA\Get(
     *     path="/properties/agent/{agentId}",
     *     tags={"Properties"},
     *     summary="Get properties by agent",
     *     description="Retrieve all approved properties listed by a specific agent",
     *     @OA\Parameter(
     *         name="agentId",
     *         in="path",
     *         required=true,
     *         description="Agent User ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of agent's properties",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Property")
     *         )
     *     )
     * )
     */
    public function byAgent($agentId)
    {
        $properties = Property::where('agent_id', $agentId)
            ->where('status', 'approved')
            ->with('agent:id,name,email,phone,bio')
            ->latest()
            ->get();

        // Append image URLs for each property
        $properties->each(function ($property) {
            $property->append('image_urls');
        });

        return response()->json($properties);
    }

    /**
     * Broadcast push notification utility (DRY similar to BlogPostController).
     */
    protected function broadcastPush(string $title, string $body, array $data = []): void
    {
        try {
            $auth = [
                'VAPID' => [
                    'subject' => config('push.vapid.subject'),
                    'publicKey' => config('push.vapid.public'),
                    'privateKey' => config('push.vapid.private'),
                ],
            ];
            if (!$auth['VAPID']['publicKey'] || !$auth['VAPID']['privateKey']) return;
            $webPush = new WebPush($auth);
            $payload = json_encode([
                'title' => $title,
                'body' => $body,
                'data' => $data,
            ]);
            PushSubscription::chunk(100, function ($subs) use ($webPush, $payload) {
                foreach ($subs as $sub) {
                    $webPush->queueNotification(WebPushSubscription::create([
                        'endpoint' => $sub->endpoint,
                        'publicKey' => $sub->p256dh,
                        'authToken' => $sub->auth,
                        'contentEncoding' => 'aes128gcm',
                    ]), $payload);
                }
                $webPush->flush();
            });
        } catch (\Throwable $e) {
            // ignore push failures
        }
    }
}
