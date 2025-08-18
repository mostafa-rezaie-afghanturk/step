<?php

namespace App\Models;

use App\Enums\FileCategoryEnum;
use App\Traits\HasFileUploads;
use App\Traits\MorphManyFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class FixtureFurnishing extends Model
{
    use HasFactory, LogsActivity, MorphManyFiles, HasFileUploads;

    protected $guarded = [];

    protected $table = 'fixtures_furnishings';
    protected $primaryKey = 'fixture_furnishing_id';

    protected $casts = [
        'technical_specifications' => 'array',
        'calibration_history' => 'array',
        'available_date' => 'date',
        'production_date' => 'date',
        'start_date' => 'date',
        'warranty_start' => 'date',
        'warranty_end' => 'date',
        'calibration_required' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('fixtures_furnishings');
    }

    /**
     * Get the parent location model (Room, Floor, Building, or Campus).
     */
    public function location()
    {
        return $this->morphTo();
    }

    public function fileInputs(): array
    {
        return [
            'warranty_cert' => FileCategoryEnum::WARRANTY_CERT,
        ];
    }
}
