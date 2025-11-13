<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link to user's email
     * 
     * @OA\Post(
     *     path="/forgot-password",
     *     tags={"Authentication"},
     *     summary="Request password reset link",
     *     description="Send password reset email to registered email address",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reset link sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Password reset link sent!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Unable to send reset link",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unable to send reset link."),
     *             @OA\Property(property="reason", type="string", example="User not found")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function forgot(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        try {
            $status = Password::sendResetLink($request->only('email'));

            // Map Laravel Password status constants to user-friendly messages
            $messages = [
                Password::RESET_LINK_SENT => 'Password reset link sent! Check your email.',
                Password::INVALID_USER => 'We could not find a user with that email address.',
                Password::RESET_THROTTLED => 'Too many password reset attempts. Please wait before trying again.',
            ];

            $message = $messages[$status] ?? 'Unable to send reset link. Please try again later.';
            $statusCode = ($status === Password::RESET_LINK_SENT) ? 200 : 400;

            // Log password reset attempts for security monitoring
            Log::info('Password reset attempt', [
                'email' => $request->email,
                'status' => $status,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'message' => $message,
                'status' => $status
            ], $statusCode);

        } catch (\Exception $e) {
            // Log mail/system errors
            Log::error('Password reset failed', [
                'email' => $request->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to send reset link. Please contact support.',
                'reason' => config('app.debug') ? $e->getMessage() : 'System error'
            ], 500);
        }
    }

    /**
     * Reset user password with token
     * 
     * @OA\Post(
     *     path="/reset-password",
     *     tags={"Authentication"},
     *     summary="Reset password with token",
     *     description="Reset user password using token from email",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"token", "email", "password", "password_confirmation"},
     *             @OA\Property(property="token", type="string", example="abcdef123456..."),
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="newpassword123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="newpassword123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password reset successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Password reset successfully!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid token or email",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Invalid or expired reset token."),
     *             @OA\Property(property="reason", type="string", example="Token expired")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();

                    Log::info('Password reset successful', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                    ]);
                }
            );

            // Map status to user-friendly messages
            $messages = [
                Password::PASSWORD_RESET => 'Password reset successfully! You can now login with your new password.',
                Password::INVALID_TOKEN => 'Invalid or expired reset token. Please request a new reset link.',
                Password::INVALID_USER => 'We could not find a user with that email address.',
            ];

            $message = $messages[$status] ?? 'Password reset failed. Please try again.';
            $statusCode = ($status == Password::PASSWORD_RESET) ? 200 : 400;

            return response()->json([
                'message' => $message,
                'status' => $status
            ], $statusCode);

        } catch (\Exception $e) {
            Log::error('Password reset error', [
                'email' => $request->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Password reset failed. Please contact support.',
                'reason' => config('app.debug') ? $e->getMessage() : 'System error'
            ], 500);
        }
    }
}
