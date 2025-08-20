<?php

namespace App\Models;

use App\Enums\FileCategoryEnum;
use App\Traits\HasFileUploads;
use App\Traits\MorphManyFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class EducationalMaterial extends Model
{
    use HasFactory, LogsActivity, MorphManyFiles, HasFileUploads;

    protected $guarded = [];

    protected $primaryKey = 'educational_material_id';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('educational_materials');
    }

    /**
     * Get the parent location model (Room, Floor, Building, or Land).
     */
    public function location()
    {
        return $this->morphTo();
    }

    public function fileInputs(): array
    {
        return [
            'warranty_cert' => FileCategoryEnum::WARRANTY_CERT,
            'asset_photo' => FileCategoryEnum::ASSET_PHOTO,
        ];
    }
}
