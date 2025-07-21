<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class EducationalInstitution extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [];

    protected $primaryKey = 'educational_institution_id';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('educational_institutions');
    }
}
