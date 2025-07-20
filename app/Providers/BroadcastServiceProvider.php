<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Register broadcasting routes
        Broadcast::routes(['middleware' => ['web', 'auth']]);

        // Load channel routes (make sure channels are defined in routes/channels.php)
        require base_path('routes/channels.php');
    }
}
