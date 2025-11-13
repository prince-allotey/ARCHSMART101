<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="ArchSmart API Documentation",
 *     description="Complete API documentation for ArchSmart Real Estate Platform",
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
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter token in format: Bearer {token}"
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
 */
class SwaggerController extends Controller
{
    // This controller is only for Swagger annotations
}
