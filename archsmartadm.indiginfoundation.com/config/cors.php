<?php

return [
    'paths' => [
        'api/*',
        'properties',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'storage/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Authorization',
        'Content-Type',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN'
    ],

    'supports_credentials' => false,

    'max_age' => 0,

];
