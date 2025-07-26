<?php

use App\Models\User;
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
        Schema::create('files', function (Blueprint $table) {
            $table->id('file_id');
            $table->foreignIdFor(User::class)->constrained();
            $table->morphs('fileable');

            $table->string('name')->nullable();
            $table->string('file_path');
            $table->string('file_type');
            $table->enum('category', ['allocation_doc', 'layout_plan', 'lease_doc', 'land_photo', 'room_photo', 'warranty_cert', 'purchase_doc'])->nullable();
            $table->json('details')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
