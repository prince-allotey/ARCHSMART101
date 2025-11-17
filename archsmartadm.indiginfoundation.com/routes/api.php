<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\DraftController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\PushSubscriptionController;
use App\Http\Controllers\Api\NotificationController;
/*
|--------------------------------------------------------------------------
| 🧾 AUTHENTICATION
|--------------------------------------------------------------------------
*/

// Health check / API test route
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'ArchSmart Backend and API is running',
        'timestamp' => now(),
        'env' => app()->environment(),
    ]);
});

// Serve profile pictures via API so CORS middleware runs for these requests.
use App\Http\Controllers\MediaController;
// Generic media endpoint for a few allowed folders. Filename can contain slashes.
Route::get('/media/{folder}/{filename}', [MediaController::class, 'serve'])
    ->where('folder', 'profile_pictures|properties|blogs|services|images')
    ->where('filename', '.*');

use App\Http\Controllers\Api\ImageRepairController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::patch('/user', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');

// Password reset
Route::post('/forgot-password', [PasswordResetController::class, 'forgot']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

/*
|--------------------------------------------------------------------------
| 📊 DASHBOARD (Protected)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/dashboard/overview', [DashboardController::class, 'overview']);

/*
|--------------------------------------------------------------------------
| 🧑‍💼 ADMIN ROUTES (Admin-only)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // 👥 Agents Management
    Route::get('/agents', [AdminController::class, 'index']); // all agents
    Route::get('/agents/pending', [AdminController::class, 'listPendingAgents']);
    Route::post('/agents/{id}/approve', [AdminController::class, 'approveAgent']);
    Route::post('/agents/{id}/suspend', [AdminController::class, 'suspendAgent']);

    // 📰 Blog posts (admin)
    Route::get('/blog-posts', [BlogPostController::class, 'adminIndex']);
    // Admin helper: scan for blog posts whose image file is missing
    // Generic media scanner/repair endpoints. Use query param `type` (blogs|properties|profile_pictures|services)
    Route::get('/missing-media', [ImageRepairController::class, 'missingMedia']);
    Route::post('/repair-missing-media', [ImageRepairController::class, 'repairMissingBlogImages']);
    Route::post('/repair-missing-media/{type}/{id}', [ImageRepairController::class, 'repairSingleMedia']);
});

/*
|--------------------------------------------------------------------------
| 🏠 PROPERTIES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/properties/my', [PropertyController::class, 'myProperties']);
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/properties/{id}/approve', [PropertyController::class, 'approve']);
        Route::post('/properties/{id}/reject', [PropertyController::class, 'reject']);
        Route::get('/properties/pending', [PropertyController::class, 'pending']);
    });
});

// Public routes
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/approved', [PropertyController::class, 'approved']);
Route::get('/properties/featured', [PropertyController::class, 'featured']);
Route::get('/properties/agent/{agentId}', [PropertyController::class, 'byAgent']);

// Authenticated route for viewing any property (including own pending ones)
Route::middleware('auth:sanctum')->get('/properties/{property}/view', [PropertyController::class, 'viewProperty']);

// Public property view (only approved)
Route::get('/properties/{property}', [PropertyController::class, 'show']);

/*
|--------------------------------------------------------------------------
| 🧑‍💼 AGENT ROUTES (optional, non-conflicting)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:agent'])->prefix('agent')->group(function () {
    Route::get('/properties', [PropertyController::class, 'agentIndex']);
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| 📰 BLOG POSTS
|--------------------------------------------------------------------------
*/
Route::prefix('blog-posts')->group(function () {
    Route::get('/', [BlogPostController::class, 'index']);
    Route::get('/{slug}', [BlogPostController::class, 'show']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/', [BlogPostController::class, 'store']);
        Route::put('/{blogPost}', [BlogPostController::class, 'update']);
        Route::delete('/{blogPost}', [BlogPostController::class, 'destroy']);
    });
});

// Tags endpoint for autocomplete
Route::get('/tags', [TagController::class, 'index']);

// Drafts - server-side saves for admin autosave
Route::post('/drafts', [DraftController::class, 'store']);
Route::get('/drafts/{id}', [DraftController::class, 'show']);

// Comments for posts
Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);
Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);

/*
|--------------------------------------------------------------------------
| � PUSH NOTIFICATIONS
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/push/subscribe', [PushSubscriptionController::class, 'store']);
    Route::delete('/push/unsubscribe', [PushSubscriptionController::class, 'destroy']);
    Route::post('/push/test', [PushSubscriptionController::class, 'test']);
    Route::post('/push/broadcast', [PushSubscriptionController::class, 'broadcast']);
    // In-app notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
});

Route::get('/push/public-key', [PushSubscriptionController::class, 'publicKey']);

/*
|--------------------------------------------------------------------------
| �💬 INQUIRIES
|--------------------------------------------------------------------------
*/
Route::prefix('inquiries')->group(function () {
    // Public
    Route::post('/', [InquiryController::class, 'store']);

    // Authenticated
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [InquiryController::class, 'index']);
        Route::get('/statistics', [InquiryController::class, 'statistics']);
        Route::get('/{inquiry}', [InquiryController::class, 'show']);
        Route::put('/{inquiry}', [InquiryController::class, 'update']);
        Route::delete('/{inquiry}', [InquiryController::class, 'destroy']);
    });
});

/*
|--------------------------------------------------------------------------
| 📞 CONSULTATIONS
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::put('/consultations/{consultation}', [ConsultationController::class, 'respond']);
});
Route::post('/consultations', [ConsultationController::class, 'store']);
