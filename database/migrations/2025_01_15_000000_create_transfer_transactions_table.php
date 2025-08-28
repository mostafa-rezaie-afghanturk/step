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
        Schema::create('transfer_transactions', function (Blueprint $table) {
            $table->id('transfer_transaction_id');
            $table->date('transfer_date');
            $table->foreignId('from_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('to_user_id')->constrained('users')->onDelete('cascade');
            $table->string('asset_or_material_type');
            $table->unsignedBigInteger('asset_or_material_id');
            $table->enum('return_status', ['Transferred', 'Returned'])->default('Transferred');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['from_user_id', 'transfer_date'], 'idx_from_user_date');
            $table->index(['to_user_id', 'transfer_date'], 'idx_to_user_date');
            $table->index(['asset_or_material_type', 'asset_or_material_id'], 'idx_asset_material');
            $table->index('return_status', 'idx_return_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfer_transactions');
    }
};
