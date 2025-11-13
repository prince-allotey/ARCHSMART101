<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Inquiry Received</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
    <div style="background: white; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2c3e50;">📩 New Inquiry Received</h2>

        <p><strong>Name:</strong> {{ $name }}</p>
        <p><strong>Email:</strong> {{ $email }}</p>
        <p><strong>Phone:</strong> {{ $phone ?? 'N/A' }}</p>
        <p><strong>Type:</strong> {{ $type }}</p>
        <p><strong>Subject:</strong> {{ $subjectLine }}</p>

        <hr>
        <p><strong>Message:</strong></p>
        <p>{{ $messageBody }}</p>

        <hr>
        <p style="font-size: 0.9em; color: #777;">This inquiry was submitted via ArchSmart GH's website.</p>
    </div>
</body>
</html>
