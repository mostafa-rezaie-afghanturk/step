<?php

namespace App\Models;

use App\Enums\FileCategoryEnum;
use App\Traits\HasFileUploads;
use App\Traits\MorphManyFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Building extends Model
{
    use HasFactory, LogsActivity, MorphManyFiles, HasFileUploads;

    protected $guarded = [];

    protected $primaryKey = 'building_id';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('buildings');
    }

    public function land()
    {
        return $this->belongsTo(Land::class, 'land_id', 'land_id');
    }

    public function fileInputs(): array
    {
        return [
            'allocation_docs' => FileCategoryEnum::ALLOCATION_DOC,
            'purchase_docs'   => FileCategoryEnum::PURCHASE_DOC,
            'lease_docs'      => FileCategoryEnum::LEASE_DOC,
        ];
    }
}
