<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            // Attempt to add indexes; if driver doesn't support index introspection or
            // an index already exists, ignore the exception to keep migrations safe.
            try {
                $table->index('slug');
            } catch (\Throwable $e) {
                // ignore
            }

            try {
                $table->index('published_at');
            } catch (\Throwable $e) {
                // ignore
            }
        });
    }

    public function down()
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['published_at']);
        });
    }
};
