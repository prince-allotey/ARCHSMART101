<?php
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */


return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'api/login', 'api/register', 'api/logout', 'api/health'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://archsmart.indiginfoundation.com',
        'http://archsmart.indiginfoundation.com',
        'https://www.archsmart.indiginfoundation.com',
    ],

    'allowed_origins_patterns' => [
        '#^https?://(www\.)?archsmart\.indiginfoundation\.com$#',
    ],

    'allowed_headers' => ['*'],

    // Expose Authorization header to browser clients so frontend JS can read it
    // (Insomnia/Postman are unaffected, but browsers require this for CORS).
    'exposed_headers' => ['Authorization', 'Content-Type', 'X-CSRF-TOKEN', 'X-XSRF-TOKEN'],

    'max_age' => 3600,

    'supports_credentials' => true,
];




