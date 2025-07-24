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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('room_id');
            $table->foreignId('floor_id')->constrained('floors', 'floor_id')->onDelete('cascade');
            $table->string('room_code')->unique();

            $table->enum('room_type', [
                'Classroom',
                'Science Laboratory',
                'Turbine',
                'Conference'
            ]);

            $table->float('size')->nullable();
            $table->float('width')->nullable();

            $table->json('door_details')->nullable();
            $table->json('window_details')->nullable();

            $table->enum('flooring', [
                'PVC',
                'Laminate',
                'Carpet',
                'Ceramic-Tiles',
                'Wood',
                'Rubber'
            ])->nullable();

            $table->enum('daylight_direction', [
                'Left',
                'Right',
                'Back',
                'Front',
                'Mixed'
            ])->nullable();

            $table->enum('ventilation', ['Sufficient', 'Insufficient'])->nullable();
            $table->enum('lighting', ['Sufficient', 'Insufficient'])->nullable();
            $table->enum('sound_insulation', ['Sufficient', 'Insufficient'])->nullable();
            $table->enum('paint_condition', ['Sufficient', 'Insufficient'])->nullable();

            $table->integer('number_of_sockets')->nullable();
            $table->json('data_outputs')->nullable(); // Cat 6, Cat 5, Multi mode Fiber, Single Mode Fiber with count

            $table->enum('heating', ['None', 'Heating', 'Air Conditioning'])->nullable();

            $table->boolean('has_clean_water')->default(false);
            $table->boolean('has_dirty_water')->default(false);
            $table->boolean('has_natural_gas')->default(false);

            $table->integer('seats')->nullable();

            $table->string('photo')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
