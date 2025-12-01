<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\AdvertRequest;

class PaystackController extends Controller
{
    // Verify Paystack transaction
    public function verify(Request $request)
    {
        $reference = $request->input('reference');
        if (!$reference) {
            return response()->json(['message' => 'Reference required'], 400);
        }
        $paystackSecretKey = env('PAYSTACK_SECRET_KEY');
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $paystackSecretKey,
        ])->get('https://api.paystack.co/transaction/verify/' . $reference);
        $data = $response->json();
        if ($data['status'] && $data['data']['status'] === 'success') {
            // Optionally, mark advert as paid
            $advertId = $request->input('advert_id');
            if ($advertId) {
                $advert = AdvertRequest::find($advertId);
                if ($advert) {
                    $advert->status = 'paid';
                    $advert->payment_method = 'paystack';
                    $advert->payment_reference = $reference;
                    $advert->save();
                }
            }
            return response()->json(['message' => 'Payment verified', 'data' => $data['data']]);
        }
        return response()->json(['message' => 'Verification failed', 'data' => $data], 400);
    }
}
