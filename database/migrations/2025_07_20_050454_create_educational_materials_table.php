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
        Schema::create('educational_materials', function (Blueprint $table) {
            $table->id('educational_material_id');
            $table->morphs('location');

            $table->string('asset_code')->unique();
            $table->string('tmv_code')->nullable();

            $table->string('group'); // e.g., Science, Chemistry
            $table->string('subgroup'); // e.g., Beaker

            $table->enum('status', ['Very good', 'Good', 'Maintenance required', 'Unusable']);
            $table->enum('usage', ['Active', 'Passive']);

            $table->date('available_date')->nullable();
            $table->enum('supply_method', ['Purchase', 'Donation', 'Transfer from FETO']);
            $table->string('supply_info')->nullable();
            $table->decimal('price', 12, 2)->nullable();

            $table->string('manufacturer')->nullable();
            $table->string('production_site')->nullable();
            $table->date('production_date')->nullable();
            $table->json('technical_specifications')->nullable();

            $table->string('related_level')->nullable();
            $table->string('photo')->nullable();

            $table->integer('lifespan')->nullable();
            $table->date('start_date')->nullable();

            $table->date('warranty_start')->nullable();
            $table->date('warranty_end')->nullable();
            $table->string('warranty_cert')->nullable();

            $table->string('brand')->nullable();
            $table->string('model')->nullable();

            $table->text('maintenance_notes')->nullable();
            $table->string('service_info')->nullable();

            $table->boolean('calibration_required')->default(false);
            $table->text('calibration_history')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational_materials');
    }
};
