<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\User;
use App\Models\BlogPost;

class BlogPostTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_blog_post_with_image_and_meta()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        Sanctum::actingAs($user, [], 'web');

    // Use a generic fake file (avoid GD dependency in test environment)
    $file = UploadedFile::fake()->create('cover.jpg', 150, 'image/jpeg');

        $payload = [
            'title' => 'Testing creation',
            'subtitle' => 'A subtitle',
            'excerpt' => 'Short excerpt',
            'content' => '<p>Some content</p>',
            'category' => 'testing',
            'tags' => json_encode(['php','laravel']),
            'meta_title' => 'Meta title',
            'meta_description' => 'Meta description',
            'is_featured' => 1,
            'status' => 'published',
            'image' => $file,
        ];

        $response = $this->post('/api/blog-posts', $payload);
        $response->assertStatus(201);

        $this->assertDatabaseHas('blog_posts', [
            'title' => 'Testing creation',
            'category' => 'testing',
            'meta_title' => 'Meta title',
            'status' => 'published',
        ]);

        $post = BlogPost::where('title', 'Testing creation')->first();
        $this->assertNotNull($post->slug);
        $this->assertNotNull($post->image);
    }
}
