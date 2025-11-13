<?php

namespace App\Mail;

use App\Models\BlogPost;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class BlogPostPublished extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public BlogPost $post;

    public function __construct(BlogPost $post)
    {
        $this->post = $post;
    }

    public function build()
    {
        return $this->subject('New blog post published: ' . $this->post->title)
            ->view('emails.blog_post_published')
            ->with([
                'post' => $this->post,
            ]);
    }
}
