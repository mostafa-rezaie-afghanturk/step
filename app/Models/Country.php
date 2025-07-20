<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Country extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['country_code', 'name', 'name_tr', 'name_primary'];

    protected $primaryKey = 'country_id';

    public function scopeSearch($query, $search)
    {
        return $query->where('country_code', 'like', "%$search%")
            ->orWhere('name', 'like', "%$search%")
            ->orWhere('name_tr', 'like', "%$search%")
            ->orWhere('name_primary', 'like', "%$search%");
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['country_code', 'name', 'name_tr', 'name_primary'])  // Log all attributes (you can customize this)
            ->useLogName('countries');  // Optional: Custom log name for the model
    }
}
