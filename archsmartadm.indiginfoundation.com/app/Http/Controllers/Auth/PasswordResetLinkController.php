<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use App\Models\User;
use Illuminate\Support\Facades\Log;



class PasswordResetLinkController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        Log::info('PasswordResetLinkController invoked for: ' . $request->input('email'));
        // Try to find the user and send reset notification explicitly. Using the broker
        // directly and calling the User notification ensures Notification::fake() in tests
        // intercepts the ResetPassword notification reliably.
        $user = User::where('email', $request->input('email'))->first();
        if (! $user) {
            // Do not reveal whether the email exists — mimic Laravel behavior
            return response()->json(['message' => 'Password reset link sent!']);
        }

    $token = Password::broker()->createToken($user);
    // Dispatch the standard ResetPassword notification via the Notification facade
    // so Notification::fake() in tests reliably intercepts it.
    Notification::send($user, new ResetPasswordNotification($token));

        return response()->json(['message' => 'Password reset link sent!']);
    }
}
