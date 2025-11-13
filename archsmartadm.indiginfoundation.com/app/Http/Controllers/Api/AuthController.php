<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     * 
     * @OA\Post(
     *     path="/register",
     *     tags={"Authentication"},
     *     summary="Register a new user",
     *     description="Create a new user account with specified role (admin, agent, or user)",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password", "password_confirmation", "role"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123"),
     *             @OA\Property(property="role", type="string", enum={"admin", "agent", "user"}, example="user")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Registration successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="🎉 Registration successful!"),
     *             @OA\Property(property="user", ref="#/components/schemas/User"),
     *             @OA\Property(property="token", type="string", example="1|abcdef123456..."),
     *             @OA\Property(property="token_type", type="string", example="Bearer")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,agent,user',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_agent' => $validated['role'] === 'agent',
            'is_admin' => $validated['role'] === 'admin',
            'is_approved' => $validated['role'] === 'admin', // admins auto-approved
        ]);

        // If the request expects JSON (API client), return token payload and clear session cookies.
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            $token = $user->createToken('api-token')->plainTextToken;
            $payload = [
                'message' => '🎉 Registration successful!',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ];

            try {
                if (session()->isStarted()) {
                    session()->invalidate();
                    session()->regenerateToken();
                }
            } catch (\Throwable $e) {
                // ignore
            }

            return response()->json($payload)
                ->header('Authorization', 'Bearer ' . $token)
                ->withCookie(Cookie::forget('laravel_session'))
                ->withCookie(Cookie::forget('XSRF-TOKEN'));
        }

        // Otherwise assume a web (stateful) client: authenticate into session and return 204 per tests.
        Auth::login($user);
        return response()->noContent();
    }

    /**
     * Login user
     * 
     * @OA\Post(
     *     path="/login",
     *     tags={"Authentication"},
     *     summary="Login user",
     *     description="Authenticate user and get access token",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="admin@gmail.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="✅ Login successful!"),
     *             @OA\Property(property="user", ref="#/components/schemas/User"),
     *             @OA\Property(property="token", type="string", example="2|xyz789..."),
     *             @OA\Property(property="token_type", type="string", example="Bearer")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Invalid credentials")
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['❌ Invalid credentials.'],
            ]);
        }

        Auth::login($user);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // If request wants JSON, issue token and return payload
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            $token = $user->createToken('api-token')->plainTextToken;
            $payload = [
                'message' => '✅ Login successful!',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ];

            try {
                if (session()->isStarted()) {
                    session()->invalidate();
                    session()->regenerateToken();
                }
            } catch (\Throwable $e) {
                // ignore
            }

            return response()->json($payload)
                ->header('Authorization', 'Bearer ' . $token)
                ->withCookie(Cookie::forget('laravel_session'))
                ->withCookie(Cookie::forget('XSRF-TOKEN'));
        }

        // stateful web client — keep session auth and return 204 per tests
        return response()->noContent();
    }

    /**
     * Logout user
     * 
     * @OA\Post(
     *     path="/logout",
     *     tags={"Authentication"},
     *     summary="Logout user",
     *     description="Revoke current access token",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="👋 Logged out successfully")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function logout(Request $request)
    {
        // If using token-based auth, revoke the current access token
        if ($request->user()) {
            $token = $request->user()->currentAccessToken();
            if ($token) {
                $token->delete();
            }
        }

        // If this is an API client expecting JSON, return a JSON message.
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            return response()->json(['message' => '👋 Logged out successfully']);
        }

        // Web client: return 204 No Content to match test expectations
        return response()->noContent();
    }

    /**
     * Get authenticated user
     * 
     * @OA\Get(
     *     path="/user",
     *     tags={"Authentication"},
     *     summary="Get current authenticated user",
     *     description="Retrieve currently authenticated user details",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User details",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update user profile
     * 
     * @OA\Patch(
     *     path="/user",
     *     tags={"Authentication"},
     *     summary="Update user profile",
     *     description="Update authenticated user profile information",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="John Updated"),
     *             @OA\Property(property="email", type="string", format="email", example="john.new@example.com"),
     *             @OA\Property(property="password", type="string", format="password"),
     *             @OA\Property(property="password_confirmation", type="string", format="password"),
     *             @OA\Property(property="phone", type="string", example="+1234567890"),
     *             @OA\Property(property="bio", type="string", example="Professional real estate agent"),
     *             @OA\Property(property="company", type="string", example="ArchSmart Realty")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Profile updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Profile updated"),
     *             @OA\Property(property="user", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|min:6|confirmed',
            'profile_picture' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'phone' => 'sometimes|nullable|string|max:20',
            'bio' => 'sometimes|nullable|string|max:1000',
            'company' => 'sometimes|nullable|string|max:255',
        ]);

        // Update basic fields
        if (array_key_exists('name', $validated)) {
            $user->name = $validated['name'];
        }
        if (array_key_exists('email', $validated)) {
            $user->email = $validated['email'];
        }
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }
        if (array_key_exists('phone', $validated)) {
            $user->phone = $validated['phone'];
        }
        if (array_key_exists('bio', $validated)) {
            $user->bio = $validated['bio'];
        }
        if (array_key_exists('company', $validated)) {
            $user->company = $validated['company'];
        }

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($user->profile_picture && \Storage::disk('public')->exists($user->profile_picture)) {
                \Storage::disk('public')->delete($user->profile_picture);
            }

            // Store new profile picture
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->profile_picture = $path;
        }

        $user->save();

        return response()->json(['message' => 'Profile updated','user' => $user]);
    }
}
