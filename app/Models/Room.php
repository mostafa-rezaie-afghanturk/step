<?php

namespace App\Models;

use App\Enums\FileCategoryEnum;
use App\Traits\HasFileUploads;
use App\Traits\MorphManyFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Room extends Model
{
    use HasFactory, LogsActivity, MorphManyFiles, HasFileUploads;

    protected $guarded = [];

    protected $primaryKey = 'room_id';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('rooms');
    }

    public function floor()
    {
        return $this->belongsTo(Floor::class, 'floor_id', 'floor_id');
    }

    public function fileInputs(): array
    {
        return [
            'room_photos' => FileCategoryEnum::ROOM_PHOTO,
        ];
    }
}
