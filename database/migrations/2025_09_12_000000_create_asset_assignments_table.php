<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asset_assignments', function (Blueprint $table) {
            $table->bigIncrements('asset_assignment_id');
            $table->date('assigned_at');
            $table->unsignedBigInteger('assigned_by_user_id');
            $table->unsignedBigInteger('assignee_user_id');
            $table->string('asset_type'); // FQN of model
            $table->unsignedBigInteger('asset_id');
            $table->enum('status', ['Assigned', 'Unassigned'])->default('Assigned');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('assigned_by_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assignee_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->index(['assignee_user_id', 'assigned_at'], 'idx_assignee_date');
            $table->index(['asset_type', 'asset_id'], 'idx_asset');
            $table->index(['status'], 'idx_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_assignments');
    }
};


