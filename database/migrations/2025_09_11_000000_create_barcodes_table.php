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
        Schema::create('barcodes', function (Blueprint $table) {
            $table->id('barcode_id');

            $table->foreignId('fixture_furnishing_id')
                ->nullable()
                ->constrained('fixtures_furnishings', 'fixture_furnishing_id')
                ->nullOnDelete();

            $table->foreignId('educational_material_id')
                ->nullable()
                ->constrained('educational_materials', 'educational_material_id')
                ->nullOnDelete();

            $table->string('barcode_image_path');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barcodes');
    }
};
