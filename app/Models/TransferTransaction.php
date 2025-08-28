<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class TransferTransaction extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [];

    protected $primaryKey = 'transfer_transaction_id';

    protected $casts = [
        'transfer_date' => 'date',
    ];

    /**
     * Get the user who initiated the transfer (from user)
     */
    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    /**
     * Get the user who received the transfer (to user)
     */
    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    /**
     * Get the asset or material being transferred
     */
    public function assetOrMaterial(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the activity log options
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('transfer_transactions');
    }

    /**
     * Scope for active transfers (not returned)
     */
    public function scopeActive($query)
    {
        return $query->where('return_status', 'Transferred');
    }

    /**
     * Scope for returned transfers
     */
    public function scopeReturned($query)
    {
        return $query->where('return_status', 'Returned');
    }

    /**
     * Check if the transfer is active (not returned)
     */
    public function isActive(): bool
    {
        return $this->return_status === 'Transferred';
    }

    /**
     * Check if the transfer has been returned
     */
    public function isReturned(): bool
    {
        return $this->return_status === 'Returned';
    }
}
