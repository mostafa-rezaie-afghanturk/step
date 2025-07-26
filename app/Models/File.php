<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class File extends Model
{
    use LogsActivity;

    protected $guarded = [];

    protected $primaryKey = 'file_id';

    public static function boot()
    {
        parent::boot();

        static::creating(function ($file) {
            $file->user_id = auth()->user->id ?? User::first()->id;
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('files');
    }
}
