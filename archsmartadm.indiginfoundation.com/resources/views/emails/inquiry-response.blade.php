<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Response to Your Inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
    <div style="background: white; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2c3e50;">💬 Response to Your Inquiry</h2>

        <p>Dear {{ $name }},</p>

        <p>Thank you for contacting ArchSmart GH regarding <strong>{{ $subjectLine }}</strong>.</p>

        <p><strong>Our response:</strong></p>
        <blockquote style="border-left: 4px solid #00aaff; padding-left: 10px; color: #555;">
            {{ $responseMessage }}
        </blockquote>

        <p>We appreciate your interest and look forward to assisting you further.</p>

        <p>Warm regards,<br><strong>ArchSmart GH Team</strong></p>

        <hr>
        <p style="font-size: 0.9em; color: #777;">This message was sent automatically in response to your inquiry.</p>
    </div>
</body>
</html>
