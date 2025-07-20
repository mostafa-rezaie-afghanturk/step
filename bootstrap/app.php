<?php

use App\Http\Middleware\HasAdminPanelAccess;
use App\Http\Middleware\HasPortalAcess;
use App\Models\BorrowingRecord;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => HasAdminPanelAccess::class,
            'force_password_change' => \App\Http\Middleware\ForcePasswordChange::class,
        ]);
    })
    ->withSchedule(function ($schedule) {
        
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
