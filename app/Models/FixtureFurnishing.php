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
            'asset_photo' => FileCategoryEnum::ASSET_PHOTO,
        ];
    }

    public function barcode()
    {
        return $this->hasOne(Barcode::class, 'fixture_furnishing_id', 'fixture_furnishing_id');
    }

    /**
     * Get all transfer transactions for this fixture/furnishing
     */
    public function transferTransactions()
    {
        return $this->morphMany(TransferTransaction::class, 'asset_or_material');
    }

    /**
     * Get the current holder of this asset (user who has it transferred to them)
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
     * Check if this asset is currently transferred to someone
     */
    public function isTransferred(): bool
    {
        return $this->transferTransactions()->active()->exists();
    }
}
