<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Property Approved</title>
    <style>body{font-family:Arial,Helvetica,sans-serif;color:#111}</style>
    </head>
<body>
    <h2>Good news! Your property has been approved 🎉</h2>
    <p>Hi {{ optional($property->agent)->name ?? 'Agent' }},</p>
    <p>Your property <strong>{{ $property->title }}</strong> has been approved and is now visible to users.</p>
    <ul>
        <li>Location: {{ $property->location }}</li>
        <li>Price: {{ number_format($property->price, 2) }}</li>
        <li>Status: {{ ucfirst($property->status) }}</li>
    </ul>
    <p>Thank you for listing with us.</p>
    <p>— ArchSmart Team</p>
</body>
</html>
