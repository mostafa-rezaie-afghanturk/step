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
        Schema::create('buildings', function (Blueprint $table) {
            $table->id('building_id');
            $table->foreignId('land_id')->constrained('lands', 'land_id')->onDelete('cascade');
            $table->string('building_code')->unique();
            $table->string('name');
            $table->date('construction_date')->nullable();
            $table->date('tmv_start_date')->nullable();
            $table->integer('floor_count');

            $table->enum('ownership_status', ['TMV', 'Rent']);

            $table->decimal('purchase_price', 12, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->json('purchase_docs')->nullable();

            $table->decimal('rental_fee', 12, 2)->nullable();
            $table->date('lease_start')->nullable();
            $table->date('lease_end')->nullable();
            $table->json('lease_docs')->nullable();

            $table->json('allocation_docs')->nullable();
            $table->json('building_project')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buildings');
    }
};
