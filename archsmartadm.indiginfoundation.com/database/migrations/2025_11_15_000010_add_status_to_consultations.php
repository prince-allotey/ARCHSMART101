<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultations', function (Blueprint $table) {
            $table->enum('status', ['pending', 'responded', 'closed'])->default('pending')->after('message');
            $table->text('response_message')->nullable()->after('status');
            $table->timestamp('responded_at')->nullable()->after('response_message');
        });
    }

    public function down(): void
    {
        Schema::table('consultations', function (Blueprint $table) {
            $table->dropColumn(['status', 'response_message', 'responded_at']);
        });
    }
};
