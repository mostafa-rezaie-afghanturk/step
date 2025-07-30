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

            // Door details (structured)
            $table->boolean('has_door')->default(false);
            $table->enum('door_material', ['Wood', 'PVC', 'Aluminum'])->nullable();
            $table->integer('door_wingspan_cm')->nullable();
            $table->enum('observation_window_type', ['None', 'Tampered', 'Non-Tampered'])->nullable();
            $table->boolean('has_door_threshold')->default(false);
            $table->boolean('has_door_shin_guard')->default(false);
            $table->boolean('has_door_centre_back')->default(false);

            // Window details (structured)
            $table->boolean('has_window')->default(false);
            $table->float('window_total_area')->nullable();
            $table->float('window_starting_height')->nullable();
            $table->enum('window_opening_type', ['Vasisdas', 'Sideways', 'Upwards'])->nullable();

            // Additional features
            $table->boolean('has_fire_escape')->default(false);
            $table->boolean('has_elevator')->default(false);

            // Ground / flooring
            $table->enum('flooring', [
                'PVC',
                'Laminate',
                'Carpet',
                'Ceramic-Tiles',
                'Wood',
                'Rubber'
            ])->nullable();

            // Environment conditions
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

            // Infrastructure
            $table->integer('number_of_sockets')->nullable();
            $table->json('data_outputs')->nullable(); // (e.g., { "Cat 6": 4, "Fiber": 2 })

            $table->enum('heating', ['None', 'Heating', 'Air Conditioning'])->nullable();
            $table->integer('seats')->nullable();

            $table->boolean('has_clean_water')->default(false);
            $table->boolean('has_dirty_water')->default(false);
            $table->boolean('has_natural_gas')->default(false);

            $table->text('notes')->nullable(); // Renovation info

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
