<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();

            // 🧑‍💼 Each property belongs to an agent (user)
            $table->foreignId('agent_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->integer('size')->nullable();
            $table->string('type')->nullable();
            $table->json('images')->nullable(); // store image URLs
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_smart_home')->default(false);

            // available | sold | rented | pending
            $table->string('status')->default('available');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
