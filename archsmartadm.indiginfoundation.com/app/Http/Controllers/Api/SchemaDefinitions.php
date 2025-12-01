<?php

namespace App\Http\Controllers\Api;

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     description="User model",
 *     required={"id", "name", "email", "role"},
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="User ID",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="name",
 *         type="string",
 *         description="User's full name",
 *         example="John Doe"
 *     ),
 *     @OA\Property(
 *         property="email",
 *         type="string",
 *         format="email",
 *         description="User's email address",
 *         example="john@example.com"
 *     ),
 *     @OA\Property(
 *         property="role",
 *         type="string",
 *         description="User role",
 *         enum={"admin", "agent", "user"},
 *         example="user"
 *     ),
 *     @OA\Property(
 *         property="is_agent",
 *         type="boolean",
 *         description="Whether user is an agent",
 *         example=false
 *     ),
 *     @OA\Property(
 *         property="is_admin",
 *         type="boolean",
 *         description="Whether user is an admin",
 *         example=false
 *     ),
 *     @OA\Property(
 *         property="is_approved",
 *         type="boolean",
 *         description="Whether user account is approved",
 *         example=true
 *     ),
 *     @OA\Property(
 *         property="phone",
 *         type="string",
 *         description="User's phone number",
 *         nullable=true,
 *         example="+1234567890"
 *     ),
 *     @OA\Property(
 *         property="bio",
 *         type="string",
 *         description="User's biography",
 *         nullable=true,
 *         example="Experienced real estate agent with 10+ years"
 *     ),
 *     @OA\Property(
 *         property="company",
 *         type="string",
 *         description="User's company name",
 *         nullable=true,
 *         example="ArchSmart Realty"
 *     ),
 *     @OA\Property(
 *         property="profile_picture",
 *         type="string",
 *         description="Path to profile picture",
 *         nullable=true,
 *         example="profile_pictures/user1.jpg"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Account creation timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Last update timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="Property",
 *     type="object",
 *     title="Property",
 *     description="Property listing model",
 *     required={"id", "title", "price", "status"},
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="Property ID",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="title",
 *         type="string",
 *         description="Property title",
 *         example="Luxury Villa in Downtown"
 *     ),
 *     @OA\Property(
 *         property="description",
 *         type="string",
 *         description="Property description",
 *         example="Beautiful 5 bedroom villa with pool and garden"
 *     ),
 *     @OA\Property(
 *         property="address",
 *         type="string",
 *         description="Property address",
 *         example="123 Main St, City, Country"
 *     ),
 *     @OA\Property(
 *         property="price",
 *         type="number",
 *         format="float",
 *         description="Property price",
 *         example=500000
 *     ),
 *     @OA\Property(
 *         property="bedrooms",
 *         type="integer",
 *         description="Number of bedrooms",
 *         example=5
 *     ),
 *     @OA\Property(
 *         property="bathrooms",
 *         type="integer",
 *         description="Number of bathrooms",
 *         example=3
 *     ),
 *     @OA\Property(
 *         property="area",
 *         type="number",
 *         format="float",
 *         description="Property area in square feet",
 *         example=3500
 *     ),
 *     @OA\Property(
 *         property="property_type",
 *         type="string",
 *         description="Type of property",
 *         enum={"house", "apartment", "villa", "land", "commercial"},
 *         example="villa"
 *     ),
 *     @OA\Property(
 *         property="listing_type",
 *         type="string",
 *         description="Listing type",
 *         enum={"sale", "rent"},
 *         example="sale"
 *     ),
 *     @OA\Property(
 *         property="status",
 *         type="string",
 *         description="Property approval status",
 *         enum={"pending", "approved", "rejected"},
 *         example="approved"
 *     ),
 *     @OA\Property(
 *         property="featured",
 *         type="boolean",
 *         description="Whether property is featured",
 *         example=false
 *     ),
 *     @OA\Property(
 *         property="images",
 *         type="array",
 *         description="Property images",
 *         @OA\Items(type="string"),
 *         example={"properties/image1.jpg", "properties/image2.jpg"}
 *     ),
 *     @OA\Property(
 *         property="agent_id",
 *         type="integer",
 *         description="ID of the agent who listed the property",
 *         example=2
 *     ),
 *     @OA\Property(
 *         property="agent",
 *         description="Agent details",
 *         ref="#/components/schemas/User"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Creation timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Last update timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="BlogPost",
 *     type="object",
 *     title="Blog Post",
 *     description="Blog post model",
 *     required={"id", "title", "content"},
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="Blog post ID",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="title",
 *         type="string",
 *         description="Blog post title",
 *         example="10 Tips for First-Time Home Buyers"
 *     ),
 *     @OA\Property(
 *         property="slug",
 *         type="string",
 *         description="URL-friendly slug",
 *         example="10-tips-first-time-home-buyers-abc123"
 *     ),
 *     @OA\Property(
 *         property="content",
 *         type="string",
 *         description="HTML content of the blog post",
 *         example="<p>Blog content with HTML formatting...</p>"
 *     ),
 *     @OA\Property(
 *         property="excerpt",
 *         type="string",
 *         description="Short excerpt or summary",
 *         nullable=true,
 *         example="Learn essential tips for buying your first home..."
 *     ),
 *     @OA\Property(
 *         property="featured_image",
 *         type="string",
 *         description="URL to featured image",
 *         nullable=true,
 *         example="https://example.com/images/blog-post.jpg"
 *     ),
 *     @OA\Property(
 *         property="author_id",
 *         type="integer",
 *         description="ID of the author",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="author",
 *         description="Author details",
 *         ref="#/components/schemas/User"
 *     ),
 *     @OA\Property(
 *         property="tags",
 *         type="array",
 *         description="Blog post tags",
 *         @OA\Items(type="string"),
 *         example={"real-estate", "tips", "buying"}
 *     ),
 *     @OA\Property(
 *         property="views",
 *         type="integer",
 *         description="Number of views",
 *         example=150
 *     ),
 *     @OA\Property(
 *         property="published_at",
 *         type="string",
 *         format="date-time",
 *         description="Publication timestamp",
 *         nullable=true,
 *         example="2025-01-01T00:00:00.000000Z"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Creation timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Last update timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="Inquiry",
 *     type="object",
 *     title="Inquiry",
 *     description="Customer inquiry model",
 *     required={"id", "name", "email", "message"},
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="Inquiry ID",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="name",
 *         type="string",
 *         description="Customer name",
 *         example="Jane Doe"
 *     ),
 *     @OA\Property(
 *         property="email",
 *         type="string",
 *         format="email",
 *         description="Customer email",
 *         example="jane@example.com"
 *     ),
 *     @OA\Property(
 *         property="phone",
 *         type="string",
 *         description="Customer phone number",
 *         example="+1234567890"
 *     ),
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         description="Inquiry message",
 *         example="I'm interested in property #123 and would like more information"
 *     ),
 *     @OA\Property(
 *         property="property_id",
 *         type="integer",
 *         description="Related property ID",
 *         nullable=true,
 *         example=123
 *     ),
 *     @OA\Property(
 *         property="status",
 *         type="string",
 *         description="Inquiry status",
 *         enum={"pending", "responded", "closed"},
 *         example="pending"
 *     ),
 *     @OA\Property(
 *         property="notes",
 *         type="string",
 *         description="Internal notes",
 *         nullable=true,
 *         example="Follow up needed"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Creation timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Last update timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="Consultation",
 *     type="object",
 *     title="Consultation",
 *     description="Consultation request model",
 *     required={"id", "name", "email", "phone"},
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="Consultation ID",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="name",
 *         type="string",
 *         description="Customer name",
 *         example="John Smith"
 *     ),
 *     @OA\Property(
 *         property="email",
 *         type="string",
 *         format="email",
 *         description="Customer email",
 *         example="john@example.com"
 *     ),
 *     @OA\Property(
 *         property="phone",
 *         type="string",
 *         description="Customer phone number",
 *         example="+1234567890"
 *     ),
 *     @OA\Property(
 *         property="service",
 *         type="string",
 *         description="Service requested",
 *         nullable=true,
 *         example="Smart Home Installation"
 *     ),
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         description="Consultation message",
 *         nullable=true,
 *         example="I need consultation for smart home integration"
 *     ),
 *     @OA\Property(
 *         property="status",
 *         type="string",
 *         description="Consultation status",
 *         enum={"pending", "responded", "closed"},
 *         example="pending"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Creation timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Last update timestamp",
 *         example="2025-01-01T00:00:00.000000Z"
 *     )
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
