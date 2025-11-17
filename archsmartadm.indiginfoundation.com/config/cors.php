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
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'api/login',
        'api/register',
        'api/logout',
        'api/health',
        'storage/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', env('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,https://archsmart.indiginfoundation.com,https://archsmartadm.indiginfoundation.com'))))),

    'allowed_origins_patterns' => [
        '#^https?://(?:localhost|127\.0\.0\.1)(:\d+)?$#',
        '#^https?://(www\.)?archsmart\.indiginfoundation\.com$#',
        '#^https?://archsmartadm\.indiginfoundation\.com$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization', 'Content-Type', 'X-CSRF-TOKEN', 'X-XSRF-TOKEN'],

    'max_age' => 3600,

    'supports_credentials' => true,
];




