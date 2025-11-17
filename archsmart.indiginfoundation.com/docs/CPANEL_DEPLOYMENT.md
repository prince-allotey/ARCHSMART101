# cPanel Hosting Checklist for ArchSmart

This repository contains two wired parts:

1. **Frontend:** a Vite + React site in `archsmart.indiginfoundation.com` that should live under the primary domain (e.g., `archsmart.indiginfoundation.com`).
2. **Backend:** a Laravel admin API in `archsmartadm.indiginfoundation.com` that can be hosted beside the frontend (preferably on a subdomain) so the SPA can talk to the API without cross-origin issues.

Below are the practical steps and artifacts you need to upload to cPanel for a smooth deployment.

---

## 1. Build & upload the React frontend

1. Install dependencies and pre-generate helper manifests (runs before `npm run build`).

```bash
npm install
npm run build
```

2. The build output lives in `dist/`. Copy every file in `dist/` into the cPanel `public_html/` (or the document root of `archsmart.indiginfoundation.com`).
3. Copy the `public/manifest.json`, `public/robots.txt`, `public/sw.js`, and the `public/images/` directory into the same document root. This ensures favicon, manifest, and handwritten assets stay available.
4. Add the SPA rewrite/caching rules from `deploy/frontend.htaccess` to `public_html/.htaccess` so deep links always fallback to `index.html`:

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} -f [OR]
     RewriteCond %{REQUEST_FILENAME} -d
     RewriteRule ^ - [L]
     RewriteRule ^ index.html [L]
   </IfModule>
   ```

5. When you upload, keep `public_html/images` intact – the app references `/images/...`. If you regenerate assets locally, copy the new `images` folder contents each time.
6. Configure the frontend environment (either via `.env.production` before build, or by editing `config.js` defaults) so it points at the hosted backend:

   - `VITE_BACKEND_URL`: e.g. `https://archsmartadm.indiginfoundation.com`
   - `VITE_API_URL`: `${VITE_BACKEND_URL}/api`
   - `VITE_ASSET_URL`: `${VITE_BACKEND_URL}/storage`

   If you rebuild on the server, set these in a `.env.production` file before running `npm run build`. Otherwise, the defaults already fall back to the local host and your backend domain if it matches `archsmart.indiginfoundation.com`.

---

## 2. Deploy the Laravel backend (`archsmartadm.indiginfoundation.com`)

1. Upload the entire `archsmartadm.indiginfoundation.com/` directory to the cPanel account, and set the domain or subdomain document root to the `public/` folder.
2. Install PHP dependencies (no dev packages) from the cPanel Terminal (or via SSH):

```bash
cd ~/path/to/archsmartadm.indiginfoundation.com
composer install --no-dev --optimize-autoloader
```

3. Copy the `.env.example` to `.env` and edit the following keys to match your environment:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `APP_URL=https://archsmartadm.indiginfoundation.com`
   - `SESSION_DOMAIN=.indiginfoundation.com` (so cookies are readable by both frontend/backend)
   - `LOG_CHANNEL=stack`
   - `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
   - `BROADCAST_DRIVER=log`, `CACHE_DRIVER=file`, `QUEUE_CONNECTION=sync`, `FILESYSTEM_DRIVER=public`
   - Email settings (`MAIL_MAILER`, `MAIL_HOST`, etc.) if you need contact forms to send mail.
4. Generate the app key and link storage:

```bash
php artisan key:generate
php artisan storage:link
```

5. Run migrations and any seeds (note `--force` to run in production):

```bash
php artisan migrate --force
php artisan db:seed --force
```

6. Cache configuration and routes for faster load times:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

7. Set folder permissions so `bootstrap/cache/` and `storage/` are writable by the web server.

8. Ensure the `.htaccess` inside `public/` remains in place; it already protects the framework entry point.

---

## 3. Cross-deployment reminders

- The React SPA expects the backend to host media via `/api/media/...`. Confirm `config/cors.php` allows the frontend origin (`https://archsmart.indiginfoundation.com`), and that `APP_URL` matches the domain used in the browser.
- If the frontend and backend are on different domains, set cookie domain and session domain to `.indiginfoundation.com` and configure `SANCTUM_STATEFUL_DOMAINS` (in `.env`) to include both hostnames.
- Upload the `public/images` folder (React assets) and the `storage/app/public` contents (Laravel media) exactly as they are referred to in the code.
- Keep `deploy/frontend.htaccess` handy when you update the SPA so you don’t lose the rewrite rules.

---

## 4. Optional cPanel housekeeping

- Use cPanel’s **SSL/TLS** section to install certificates for both domains; force HTTPS by editing `.htaccess` or using cPanel’s Redirect tool.
- Use **Cron Jobs** to run `php artisan schedule:run` every minute if you later add scheduler tasks.
- Back up the `.env` file separately and avoid committing secrets.
- If you ever rebuild the frontend (new features), repeat the build/upload steps, but leave backend migrations alone unless schema changes occur.

Follow these steps once, and you can repeat the build + upload cycle whenever you release new frontend updates. Let me know if you’d like a deployment script or GitHub Action tuned for cPanel as well.