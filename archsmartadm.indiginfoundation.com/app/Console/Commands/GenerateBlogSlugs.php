<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use App\Models\BlogPost;

class GenerateBlogSlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blog:generate-slugs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate unique slugs for blog posts that are missing them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Scanning for blog posts without a slug...');

        $posts = BlogPost::whereNull('slug')
            ->orWhere('slug', '')
            ->get();

        if ($posts->isEmpty()) {
            $this->info('No posts require slugs.');
            return 0;
        }

        $count = 0;
        foreach ($posts as $post) {
            $base = Str::slug($post->title ?: 'post');

            // ensure uniqueness by appending an uniqid (fast and safe)
            $slug = $base . '-' . uniqid();

            // double-check uniqueness (very unlikely to collide)
            while (BlogPost::where('slug', $slug)->exists()) {
                $slug = $base . '-' . uniqid();
            }

            $post->slug = $slug;
            $post->save();
            $count++;
            $this->info("Updated post id={$post->id} slug={$post->slug}");
        }

        $this->info("Finished. Generated slugs for {$count} posts.");
        return 0;
    }
}
