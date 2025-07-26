<?php

namespace App\Models;

use App\Traits\MorphManyFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Land extends Model
{
    use HasFactory, LogsActivity, MorphManyFiles;

    protected $guarded = [];

    protected $primaryKey = 'land_id';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('lands');
    }

    public function country() {
        return $this->belongsTo(Country::class, 'country_id', 'country_id');
    }
}
