<?php

namespace App\Http\Controllers\Api;

/**
 * @OA\Schema(
 *     schema="User",
 *     title="User",
 *     description="User model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="role", type="string", enum={"admin", "agent", "user"}, example="user"),
 *     @OA\Property(property="is_agent", type="boolean", example=false),
 *     @OA\Property(property="is_admin", type="boolean", example=false),
 *     @OA\Property(property="is_approved", type="boolean", example=true),
 *     @OA\Property(property="phone", type="string", nullable=true, example="+1234567890"),
 *     @OA\Property(property="bio", type="string", nullable=true, example="Experienced real estate agent"),
 *     @OA\Property(property="company", type="string", nullable=true, example="ArchSmart Realty"),
 *     @OA\Property(property="profile_picture", type="string", nullable=true, example="profile_pictures/user1.jpg"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-01-01T00:00:00Z")
 * )
 * 
 * @OA\Schema(
 *     schema="Property",
 *     title="Property",
 *     description="Property model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Luxury Villa in Downtown"),
 *     @OA\Property(property="description", type="string", example="Beautiful 5 bedroom villa with pool"),
 *     @OA\Property(property="address", type="string", example="123 Main St, City"),
 *     @OA\Property(property="price", type="number", format="float", example=500000),
 *     @OA\Property(property="bedrooms", type="integer", example=5),
 *     @OA\Property(property="bathrooms", type="integer", example=3),
 *     @OA\Property(property="area", type="number", format="float", example=3500),
 *     @OA\Property(property="property_type", type="string", enum={"house", "apartment", "villa", "land", "commercial"}, example="villa"),
 *     @OA\Property(property="listing_type", type="string", enum={"sale", "rent"}, example="sale"),
 *     @OA\Property(property="status", type="string", enum={"pending", "approved", "rejected"}, example="approved"),
 *     @OA\Property(property="featured", type="boolean", example=false),
 *     @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"properties/image1.jpg", "properties/image2.jpg"}),
 *     @OA\Property(property="agent_id", type="integer", example=2),
 *     @OA\Property(property="agent", ref="#/components/schemas/User"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="BlogPost",
 *     title="Blog Post",
 *     description="Blog post model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="10 Tips for First-Time Home Buyers"),
 *     @OA\Property(property="slug", type="string", example="10-tips-first-time-home-buyers-abc123"),
 *     @OA\Property(property="content", type="string", example="<p>Blog content with HTML...</p>"),
 *     @OA\Property(property="excerpt", type="string", nullable=true, example="Learn essential tips..."),
 *     @OA\Property(property="featured_image", type="string", nullable=true, example="https://example.com/image.jpg"),
 *     @OA\Property(property="author_id", type="integer", example=1),
 *     @OA\Property(property="author", ref="#/components/schemas/User"),
 *     @OA\Property(property="tags", type="array", @OA\Items(type="string"), example={"real-estate", "tips", "buying"}),
 *     @OA\Property(property="views", type="integer", example=150),
 *     @OA\Property(property="published_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Inquiry",
 *     title="Inquiry",
 *     description="Customer inquiry model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Jane Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="jane@example.com"),
 *     @OA\Property(property="phone", type="string", example="+1234567890"),
 *     @OA\Property(property="message", type="string", example="I'm interested in property #123"),
 *     @OA\Property(property="property_id", type="integer", nullable=true, example=123),
 *     @OA\Property(property="status", type="string", example="new"),
 *     @OA\Property(property="notes", type="string", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Consultation",
 *     title="Consultation",
 *     description="Consultation request model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Smith"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="phone", type="string", example="+1234567890"),
 *     @OA\Property(property="service", type="string", example="Smart Home Installation"),
 *     @OA\Property(property="message", type="string", example="Need consultation for smart home"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="ValidationError",
 *     title="Validation Error",
 *     description="Validation error response",
 *     @OA\Property(property="message", type="string", example="The given data was invalid."),
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         @OA\AdditionalProperties(
 *             type="array",
 *             @OA\Items(type="string")
 *         ),
 *         example={"email": {"The email field is required."}}
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     title="Error Response",
 *     description="Generic error response",
 *     @OA\Property(property="message", type="string", example="An error occurred")
 * )
 */
class SchemaDefinitions
{
    // This class is only for Swagger schema definitions
}
