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
        Schema::table('properties', function (Blueprint $table) {
            $table->string('agent_name')->nullable()->after('status');
            $table->string('agent_phone', 50)->nullable()->after('agent_name');
            $table->string('agent_email')->nullable()->after('agent_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['agent_name', 'agent_phone', 'agent_email']);
        });
    }
};
