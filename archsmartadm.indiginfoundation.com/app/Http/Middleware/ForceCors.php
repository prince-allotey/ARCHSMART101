<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceCors
{
    /**
     * Force CORS headers on every response, preferring the incoming Origin when allowed.
     * This middleware is a defensive measure to ensure a single, correct
     * Access-Control-Allow-Origin header is emitted even when server-level
     * headers conflict. It should be used alongside Laravel's CORS middleware.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $origin = $request->headers->get('origin');
        if (!$origin) {
            return $response;
        }

        // Read allowed origins from env (comma-separated)
        $allowed = array_map('trim', explode(',', env('ALLOWED_ORIGINS', '')));

        // Allow if origin exactly matches an allowed origin or matches configured patterns
        $allowedFlag = false;
        foreach ($allowed as $a) {
            if ($a === '') continue;
            if (strcasecmp($a, $origin) === 0) {
                $allowedFlag = true;
                break;
            }
        }

        if (!$allowedFlag) {
            $patterns = config('cors.allowed_origins_patterns', []);
            foreach ($patterns as $pattern) {
                if (!trim($pattern)) continue;
                try {
                    if (preg_match($pattern, $origin)) {
                        $allowedFlag = true;
                        break;
                    }
                } catch (\Throwable $e) {
                    // Ignore invalid patterns, fallback to strict matching
                }
            }
        }

        // As a fallback, if allowed list is empty, allow everything in local/dev.
        if (empty(array_filter($allowed)) && app()->environment('local')) {
            $allowedFlag = true;
        }

        if ($allowedFlag) {
            // Replace any existing header values so we have a single coherent header.
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept, Origin');
            $response->headers->set('Access-Control-Expose-Headers', 'Authorization, Content-Type, X-CSRF-TOKEN');
            $response->headers->set('Access-Control-Max-Age', '0');
        }

        return $response;
    }
}
