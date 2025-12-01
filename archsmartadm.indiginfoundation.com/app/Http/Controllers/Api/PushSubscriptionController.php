<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PushSubscription;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class PushSubscriptionController extends Controller
{
    /**
     * Get VAPID public key
     * 
     * @OA\Get(
     *     path="/push/public-key",
     *     tags={"Notifications"},
     *     summary="Get VAPID public key",
     *     description="Retrieve the VAPID public key for push notification subscriptions",
     *     @OA\Response(
     *         response=200,
     *         description="VAPID public key",
     *         @OA\JsonContent(
     *             @OA\Property(property="key", type="string", example="BKx...abc")
     *         )
     *     )
     * )
     */
    public function publicKey()
    {
        return response()->json(['key' => config('push.vapid.public')]);
    }

    /**
     * Subscribe to push notifications
     * 
     * @OA\Post(
     *     path="/push/subscribe",
     *     tags={"Notifications"},
     *     summary="Subscribe to push notifications",
     *     description="Register a push notification subscription for authenticated user",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"endpoint", "keys"},
     *             @OA\Property(property="endpoint", type="string", example="https://fcm.googleapis.com/..."),
     *             @OA\Property(
     *                 property="keys",
     *                 type="object",
     *                 @OA\Property(property="p256dh", type="string"),
     *                 @OA\Property(property="auth", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Subscription created",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="endpoint", type="string"),
     *             @OA\Property(property="user_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'endpoint' => 'required|string',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
        ]);

        $user = Auth::user();
        $sub = PushSubscription::updateOrCreate(
            ['endpoint' => $data['endpoint']],
            [
                'user_id' => $user->id,
                'p256dh' => $data['keys']['p256dh'],
                'auth' => $data['keys']['auth'],
                'user_agent' => $request->userAgent(),
            ]
        );
        return response()->json($sub, 201);
    }

    /**
     * Unsubscribe from push notifications
     * 
     * @OA\Delete(
     *     path="/push/unsubscribe",
     *     tags={"Notifications"},
     *     summary="Unsubscribe from push notifications",
     *     description="Remove a push notification subscription",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"endpoint"},
     *             @OA\Property(property="endpoint", type="string", example="https://fcm.googleapis.com/...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Unsubscribed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unsubscribed")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function destroy(Request $request)
    {
        $request->validate(['endpoint' => 'required|string']);
        PushSubscription::where('endpoint', $request->input('endpoint'))
            ->where('user_id', Auth::id())
            ->delete();
        return response()->json(['message' => 'Unsubscribed']);
    }

    /**
     * Test push notification
     * 
     * @OA\Post(
     *     path="/push/test",
     *     tags={"Notifications"},
     *     summary="Test push notification",
     *     description="Send a test push notification to verify subscription",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"endpoint"},
     *             @OA\Property(property="endpoint", type="string", example="https://fcm.googleapis.com/...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Test notification sent",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(response=404, description="Subscription not found")
     * )
     */
    public function test(Request $request)
    {
        $request->validate(['endpoint' => 'required|string']);
        $subscription = PushSubscription::where('endpoint', $request->input('endpoint'))
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $auth = [
            'VAPID' => [
                'subject' => config('app.url') ?? 'mailto:admin@example.com',
                'publicKey' => config('push.vapid.public'),
                'privateKey' => config('push.vapid.private'),
            ],
        ];

        $webPush = new WebPush($auth);
        $sub = Subscription::create([
            'endpoint' => $subscription->endpoint,
            'publicKey' => $subscription->p256dh,
            'authToken' => $subscription->auth,
            'contentEncoding' => 'aes128gcm',
        ]);
        $report = $webPush->sendOneNotification($sub, json_encode([
            'title' => 'Test Notification',
            'body' => 'Push works! 🎯',
        ]));

        return response()->json(['success' => $report->isSuccess()]);
    }

    /**
     * Broadcast a push notification to all stored subscriptions (admin only suggested via route middleware).
     * 
     * @OA\Post(
     *     path="/push/broadcast",
     *     tags={"Notifications"},
     *     summary="Broadcast push notification (Admin)",
     *     description="Send a push notification to all subscribed users",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "body"},
     *             @OA\Property(property="title", type="string", maxLength=120, example="New Update"),
     *             @OA\Property(property="body", type="string", maxLength=300, example="Check out our latest features!"),
     *             @OA\Property(property="url", type="string", format="url", example="https://archsmart.com/news")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Broadcast queued",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Broadcast queued")
     *         )
     *     ),
     *     @OA\Response(response=400, description="VAPID keys not set")
     * )
     */
    public function broadcast(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:120',
            'body' => 'required|string|max:300',
            'url' => 'nullable|url',
        ]);

        $authArray = [
            'VAPID' => [
                'subject' => config('push.vapid.subject'),
                'publicKey' => config('push.vapid.public'),
                'privateKey' => config('push.vapid.private'),
            ],
        ];
        if (!$authArray['VAPID']['publicKey'] || !$authArray['VAPID']['privateKey']) {
            return response()->json(['message' => 'VAPID keys not set'], 400);
        }

        $payload = json_encode([
            'title' => $data['title'],
            'body' => $data['body'],
            'data' => [ 'url' => $data['url'] ?? url('/') ],
        ]);

        $webPush = new WebPush($authArray);
        PushSubscription::chunk(100, function ($subs) use ($webPush, $payload) {
            foreach ($subs as $sub) {
                $webPush->queueNotification(Subscription::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->p256dh,
                    'authToken' => $sub->auth,
                    'contentEncoding' => 'aes128gcm',
                ]), $payload);
            }
            $webPush->flush();
        });

        return response()->json(['message' => 'Broadcast queued']);
    }
}
