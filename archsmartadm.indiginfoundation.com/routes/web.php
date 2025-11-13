<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'ArchSmart GH API',
        'status' => 'active'
    ]);
});
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// Include optional auth scaffolding routes (register/login/forgot-password/etc.)
// This file is present when Laravel Breeze/Jetstream style scaffolding is installed.
if (file_exists(__DIR__ . '/auth.php')) {
    require __DIR__ . '/auth.php';
}

// Route::get('/health', function () {
//     return response()->json([
//         'status' => 'healthy',
//         'timestamp' => now()->toISOString()
//     ]);
// });