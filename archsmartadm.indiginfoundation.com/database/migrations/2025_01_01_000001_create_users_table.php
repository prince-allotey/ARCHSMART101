<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // 👇 Role and status fields
            $table->enum('role', ['admin', 'agent', 'user'])->default('user');
            $table->boolean('is_agent')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->string('status')->default('pending'); // pending | active | suspended
            $table->boolean('email_verified')->default(false);

            // Optional agent details
            $table->string('phone')->nullable();
            $table->string('profile_photo')->nullable();
            $table->text('bio')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
