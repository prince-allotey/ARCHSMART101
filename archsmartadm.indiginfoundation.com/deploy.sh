# Quick Backend Deployment Script
# Run this on the cPanel server via SSH

#!/bin/bash

echo "=== ArchSmart Backend Deployment Script ==="
echo ""

# Navigate to backend directory
cd /home/indinrwx/public_html/archsmartadm || exit

echo "1. Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev

echo "2. Setting up environment..."
if [ ! -f .env ]; then
    cp .env.production .env
fi

echo "3. Generating application key..."
php artisan key:generate --force

echo "4. Creating storage symlink..."
php artisan storage:link

echo "5. Running database migrations..."
php artisan migrate --force

echo "6. Seeding database..."
php artisan db:seed --force

echo "7. Setting folder permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache

echo "8. Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "9. Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

echo ""
echo "=== Backend deployment completed! ==="
echo "Visit: https://archsmartadm.indiginfoundation.com"
