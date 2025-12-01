<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('advert_requests', function (Blueprint $table) {
            $table->string('business_category')->after('business_name');
            $table->string('target_audience')->nullable()->after('advert_details');
            $table->integer('duration_months')->default(1)->after('target_audience');
            $table->decimal('budget', 10, 2)->nullable()->after('duration_months');
            $table->string('website_url')->nullable()->after('budget');
            $table->string('logo_path')->nullable()->after('website_url');
        });
    }

    public function down(): void
    {
        Schema::table('advert_requests', function (Blueprint $table) {
            $table->dropColumn(['business_category', 'target_audience', 'duration_months', 'budget', 'website_url', 'logo_path']);
        });
    }
};
