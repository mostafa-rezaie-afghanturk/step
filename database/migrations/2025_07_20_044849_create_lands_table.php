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
        Schema::create('lands', function (Blueprint $table) {
            $table->id('land_id');
            $table->foreignId('country_id')->constrained('countries', 'country_id')->onDelete('cascade');
            $table->string('land_code')->unique();
            $table->text('address');
            $table->string('province');
            $table->string('district');
            $table->string('neighborhood');
            $table->string('street');
            $table->string('door_number');
            $table->string('country_land_number')->nullable();
            $table->float('size_sqm');
            $table->date('tmv_start_date')->nullable();

            $table->enum('ownership_status', ['TMV', 'Rent']);

            $table->decimal('purchase_price', 12, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->json('purchase_docs')->nullable();

            $table->decimal('rental_fee', 12, 2)->nullable();
            $table->date('lease_start')->nullable();
            $table->date('lease_end')->nullable();
            $table->json('lease_docs')->nullable();

            $table->json('allocation_docs')->nullable();
            $table->json('layout_plan')->nullable();
            $table->json('features')->nullable();
            $table->json('photos')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};
