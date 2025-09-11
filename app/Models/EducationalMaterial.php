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

    protected $casts = [
        'technical_specifications' => 'array',
        'calibration_history' => 'array',
        'calibration_required' => 'boolean',
    ];

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

    public function barcode()
    {
        return $this->hasOne(Barcode::class, 'educational_material_id', 'educational_material_id');
    }

    /**
     * Get all transfer transactions for this educational material
     */
    public function transferTransactions()
    {
        return $this->morphMany(TransferTransaction::class, 'asset_or_material');
    }

    /**
     * Get the current holder of this material (user who has it transferred to them)
     */
    public function currentHolder()
    {
        return $this->transferTransactions()
            ->active()
            ->with('toUser')
            ->latest('transfer_date')
            ->first()?->toUser;
    }

    /**
     * Check if this material is currently transferred to someone
     */
    public function isTransferred(): bool
    {
        return $this->transferTransactions()->active()->exists();
    }
}
