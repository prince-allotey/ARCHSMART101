<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('blog_posts', 'subtitle')) {
                $table->string('subtitle')->nullable()->after('title');
            }
            if (!Schema::hasColumn('blog_posts', 'summary')) {
                $table->text('summary')->nullable()->after('excerpt');
            }
            if (!Schema::hasColumn('blog_posts', 'secondary_image')) {
                $table->string('secondary_image')->nullable()->after('image');
            }
            if (!Schema::hasColumn('blog_posts', 'cover_image_alt')) {
                $table->string('cover_image_alt')->nullable()->after('secondary_image');
            }
            if (!Schema::hasColumn('blog_posts', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('read_time');
            }
            if (!Schema::hasColumn('blog_posts', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('blog_posts', 'canonical_url')) {
                $table->string('canonical_url')->nullable()->after('meta_description');
            }
            if (!Schema::hasColumn('blog_posts', 'seo_keywords')) {
                $table->text('seo_keywords')->nullable()->after('canonical_url');
            }
            if (!Schema::hasColumn('blog_posts', 'external_sources')) {
                $table->text('external_sources')->nullable()->after('seo_keywords');
            }
            if (!Schema::hasColumn('blog_posts', 'estimated_read_time')) {
                $table->integer('estimated_read_time')->nullable()->after('read_time');
            }
            if (!Schema::hasColumn('blog_posts', 'reading_level')) {
                $table->string('reading_level')->nullable()->after('estimated_read_time');
            }
            if (!Schema::hasColumn('blog_posts', 'layout')) {
                $table->string('layout')->nullable()->after('reading_level');
            }
            if (!Schema::hasColumn('blog_posts', 'tags')) {
                // JSON preferred; fall back to text if not supported
                try {
                    $table->json('tags')->nullable()->after('category');
                } catch (\Exception $e) {
                    $table->text('tags')->nullable()->after('category');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $cols = [
                'subtitle', 'summary', 'secondary_image', 'cover_image_alt',
                'meta_title', 'meta_description', 'canonical_url', 'seo_keywords',
                'external_sources', 'estimated_read_time', 'reading_level', 'layout', 'tags'
            ];
            foreach ($cols as $c) {
                if (Schema::hasColumn('blog_posts', $c)) {
                    $table->dropColumn($c);
                }
            }
        });
    }
};
