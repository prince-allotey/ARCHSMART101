<!DOCTYPE html>
<html>
<head>
    <title>Verify Email</title>
</head>
<body>
    <h1>Email Verification Required</h1>
    <p>
        Please verify your email address by clicking the link we sent to your email.
    </p>

    @if (session('status') == 'verification-link-sent')
        <p>A new verification link has been sent to your email.</p>
    @endif

    <form method="POST" action="{{ route('verification.send') }}">
        @csrf
        <button type="submit">Resend Verification Email</button>
    </form>
</body>
</html>
