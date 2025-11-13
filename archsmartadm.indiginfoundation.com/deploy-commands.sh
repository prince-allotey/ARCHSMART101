https://archsmart.indiginfoundation.com#!/bin/bash
# Run these commands on cPanel server after uploading files

echo "🚀 Starting deployment..."

# Navigate to backend directory
cd ~/public_html/archsmartadm.indiginfoundation.com

# Clear all caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Create storage symlink (CRITICAL for images to work!)
echo "🔗 Creating storage symlink..."
php artisan storage:link

# Set proper permissions for storage folders
echo "🔐 Setting storage permissions..."
chmod -R 755 storage
chmod -R 775 storage/logs
chmod -R 755 bootstrap/cache

# Verify storage symlink exists
echo "✅ Checking storage symlink..."
ls -la public/storage

# Verify database connection
echo "📊 Verifying database connection..."
php artisan migrate:status

# If migrations not run yet, run them:
# php artisan migrate --force

# Cache optimized config for production
echo "⚡ Caching configurations..."
php artisan config:cache
php artisan route:cache

# Generate Swagger docs
echo "📚 Generating API documentation..."
php artisan l5-swagger:generate

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Configuration Summary:"
echo "   Database: indinrwx_archsmartDB"
echo "   Environment: production"
echo "   Storage symlink: public/storage -> ../storage/app/public"
echo ""
echo "🔍 Next steps:"
echo "   1. Verify images work: https://archsmartadm.indiginfoundation.com/storage/"
echo "   2. Test API: https://archsmartadm.indiginfoundation.com/api/properties"
echo "   3. Check logs: tail -f storage/logs/laravel.log"

