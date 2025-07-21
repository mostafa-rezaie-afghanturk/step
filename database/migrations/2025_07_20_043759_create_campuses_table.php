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
            $table->string('phone')->nullable();
            $table->string('website')->nullable();

            // Explicit social media fields
            $table->string('facebook_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('linkedin_url')->nullable();

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
