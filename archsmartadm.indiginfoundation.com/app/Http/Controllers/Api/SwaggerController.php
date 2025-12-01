<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="ArchSmart API Documentation",
 *     description="Complete API documentation for ArchSmart Real Estate Platform. 
 * 
 * **Authentication:**
 * 1. First, login using the `/login` endpoint with your credentials
 * 2. Copy the token from the response
 * 3. Click the 'Authorize' button (🔓) at the top right
 * 4. Paste your token in the value field (just the token, without 'Bearer')
 * 5. Click 'Authorize' and then 'Close'
 * 6. Now you can test all protected endpoints
 * 
 * **Note:** All API requests should use `Accept: application/json` header.",
 *     @OA\Contact(
 *         email="admin@archsmart.com",
 *         name="ArchSmart Support"
 *     ),
 *     @OA\License(
 *         name="Proprietary",
 *         url="https://archsmart.indiginfoundation.com/license"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="https://archsmartadm.indiginfoundation.com/api",
 *     description="Production API Server"
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Local Development Server"
 * )
 * 
 * @OA\Server(
 *     url="/api",
 *     description="Current Domain API Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="Token",
 *     description="Enter your Bearer token (the token will be automatically prefixed with 'Bearer ')"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="User authentication endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Properties",
 *     description="Property management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Blog Posts",
 *     description="Blog post management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Admin",
 *     description="Admin-only endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Dashboard",
 *     description="Dashboard and analytics endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Inquiries",
 *     description="Customer inquiry management"
 * )
 * 
 * @OA\Tag(
 *     name="Consultations",
 *     description="Consultation request endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Notifications",
 *     description="Push notifications and in-app notifications"
 * )
 * 
 * @OA\Tag(
 *     name="Tags",
 *     description="Blog post tags management"
 * )
 * 
 * @OA\Tag(
 *     name="Drafts",
 *     description="Blog post draft management"
 * )
 * 
 * @OA\Tag(
 *     name="Comments",
 *     description="Blog post comments"
 * )
 * 
 * @OA\Tag(
 *     name="Media",
 *     description="Media file management and serving"
 * )
 * 
 * @OA\Tag(
 *     name="Health",
 *     description="API health check endpoints"
 * )
 * 
 * @OA\Get(
 *     path="/health",
 *     tags={"Health"},
 *     summary="API health check",
 *     description="Check if the API is running and responding",
 *     @OA\Response(
 *         response=200,
 *         description="API is healthy",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="ok"),
 *             @OA\Property(property="message", type="string", example="ArchSmart Backend and API is running"),
 *             @OA\Property(property="timestamp", type="string", format="date-time"),
 *             @OA\Property(property="env", type="string", example="local")
 *         )
 *     )
 * )
 */
class SwaggerController extends Controller
{
    // This controller is only for Swagger annotations
}
