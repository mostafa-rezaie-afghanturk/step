<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, LogsActivity, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_code',
        'name',
        'email',
        'username',
        'password',
        'is_borrower',
        'borrower_id',
        'userable_id',
        'userable_type',
        'profile_picture',
        'force_password_change',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userRestrictions()
    {
        return $this->hasMany(UserRestriction::class);
    }

    public function userable(): MorphTo
    {
        return $this->morphTo();
    }

    public function isPortalUser(): bool
    {
        return !!$this->userable;
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function getEmailOrUsernameAttribute(): string
    {
        return $this->email ?? $this->username;
    }

    /**
     * Get the parent's user.
     */
    public function user(): MorphOne
    {
        return $this->morphOne(User::class, 'userable');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->dontLogIfAttributesChangedOnly(['remember_token'])
            ->logOnlyDirty()
            ->useLogName('user');
    }
}
