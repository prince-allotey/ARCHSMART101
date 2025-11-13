<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Blog Post Published</title>
    <style>body{font-family:Arial,Helvetica,sans-serif;color:#111}</style>
</head>
<body>
    <h2>Your blog post is live 🚀</h2>
    <p>Hi {{ optional($post->user)->name ?? 'Author' }},</p>
    <p>Your blog post <strong>{{ $post->title }}</strong> has been published.</p>
    @if($post->excerpt)
        <blockquote style="border-left:4px solid #ccc;padding:8px 12px;margin:16px 0;background:#f9f9f9">{{ $post->excerpt }}</blockquote>
    @endif
    <p>You can view it here: <a href="{{ url('/blog/' . $post->slug) }}">{{ url('/blog/' . $post->slug) }}</a></p>
    <p>Keep creating great content!</p>
    <p>— ArchSmart Team</p>
</body>
</html>
