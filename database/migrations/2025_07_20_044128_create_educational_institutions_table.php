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
        Schema::create('educational_institutions', function (Blueprint $table) {
            $table->id('institution_id');
            $table->foreignId('campus_id')->constrained('campuses', 'campus_id')->onDelete('cascade');
            $table->string('institution_code')->unique();
            $table->string('name_en');
            $table->string('name_tr');
            $table->string('name_local');
            $table->enum('type', ['School', 'Dormitory', 'Education Center', 'Other']);

            // JSON fields for multi-select dropdowns
            $table->json('stage'); // ['Preschool', 'Elementary School', ...]
            $table->json('level'); // [0, 1, 2, ..., 13]

            $table->date('start_date')->nullable();

            // ENUM for status
            $table->enum('status', ['TMV Installation', 'Transfer from FETO', 'Transfer from 2nd Party']);

            $table->date('open_date')->nullable();
            $table->string('former_name')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational_institutions');
    }
};
