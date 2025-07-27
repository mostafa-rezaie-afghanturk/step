<?php

namespace App\Models;

use App\Enums\FileCategoryEnum;
use App\Traits\HasFileUploads;
use App\Traits\MorphManyFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Land extends Model
{
    use HasFactory, LogsActivity, MorphManyFiles, HasFileUploads;

    protected $guarded = [];

    protected $primaryKey = 'land_id';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('lands');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'country_id');
    }

    public function fileInputs(): array
    {
        return [
            'allocation_docs' => FileCategoryEnum::ALLOCATION_DOC,
            'purchase_docs'   => FileCategoryEnum::PURCHASE_DOC,
            'lease_docs'      => FileCategoryEnum::LEASE_DOC,
            'layout_plan'     => FileCategoryEnum::LAYOUT_PLAN,
            'land_photos'     => FileCategoryEnum::LAND_PHOTO,
        ];
    }
}
