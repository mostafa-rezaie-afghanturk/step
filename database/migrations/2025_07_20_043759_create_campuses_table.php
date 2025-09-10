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
        Schema::create('campuses', function (Blueprint $table) {
            $table->id('campus_id');
            $table->foreignId('country_id')->constrained('countries', 'country_id')->onDelete('cascade');
            $table->string('campus_code')->unique();
            $table->string('name_en');
            $table->string('name_tr');
            $table->string('name_local');
            $table->text('address');
            $table->string('phone');
            $table->string('website');

            $table->string('social_media_address_1')->nullable();
            $table->string('social_media_address_2')->nullable();
            $table->string('social_media_address_3')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campuses');
    }
};
