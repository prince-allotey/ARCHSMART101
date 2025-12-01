<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('advert_requests', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('business_category');
            $table->string('contact_name');
            $table->string('contact_email');
            $table->string('contact_phone');
            $table->text('advert_details');
            $table->string('target_audience')->nullable(); // buyers, sellers, renters, investors
            $table->integer('duration_months')->default(1); // 1, 3, 6, 12
            $table->decimal('budget', 10, 2)->nullable();
            $table->string('website_url')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected, paid
            $table->string('payment_method')->nullable();
            $table->string('payment_reference')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('advert_requests');
    }
};
