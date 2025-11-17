cPanel deployment checklist — frontend + backend

This file lists the practical steps to deploy the frontend (Vite-built React SPA) and the Laravel backend to cPanel. It also includes quick remediation commands for image issues.

1) Backend (Laravel) on cPanel
- Upload code to your cPanel account (Git/SFTP/FileManager) into a project folder.
- In cPanel Terminal or SSH:
  - composer install --no-dev --optimize-autoloader
  - cp .env.example .env  # edit .env to set APP_URL, DB_*, VITE_BACKEND_URL etc.
  - php artisan key:generate
  - php artisan storage:link
  - php artisan migrate --force
  - php artisan config:cache
  - ensure permissions: chmod -R 775 storage bootstrap/cache

2) Frontend (build & host)
- Locally: set VITE_BACKEND_URL to your backend origin and generate manifests:
    npm run generate:public-images
    npm run build
- Copy contents of `dist/` to the cPanel webroot (public_html or subfolder/subdomain root).
- Place the file `deploy/frontend.htaccess` in the frontend root (rename to .htaccess). This enables SPA routing fallback.

3) Image sync and fixes (server-side)
- If images in `public/images` must be available via `storage` (Laravel), run on the server (project root):
    # create storage link if missing
    php artisan storage:link

    # copy missing images from public/images to storage/app/public (non-destructive)
    rsync -av --ignore-existing public/images/ storage/app/public/
    chown -R <cpanel_user>:<cpanel_user> storage/app/public
    chmod -R 644 storage/app/public/*

4) CORS & API checks
- Ensure `config/cors.php` allows your frontend origin(s) for api/* paths.
- Test media endpoint:
    curl -I https://your-backend-domain/api/media/blogs/blog1.jpeg

5) Post-deploy verification
- Run the image checker locally pointing to the deployed backend:
    $env:VITE_BACKEND_URL = 'https://archsmartadm.indiginfoundation.com'
    npm run check:images

If you want, run the `scripts/syncPublicToStorage.cjs` on the server (requires Node installed) to copy public images into storage/app/public. This is non-destructive and will skip existing files.
