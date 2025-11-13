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
    public function publicKey()
    {
        return response()->json(['key' => config('push.vapid.public')]);
    }

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

    public function destroy(Request $request)
    {
        $request->validate(['endpoint' => 'required|string']);
        PushSubscription::where('endpoint', $request->input('endpoint'))
            ->where('user_id', Auth::id())
            ->delete();
        return response()->json(['message' => 'Unsubscribed']);
    }

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
