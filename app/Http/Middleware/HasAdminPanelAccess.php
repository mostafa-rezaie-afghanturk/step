<?php

namespace App\Http\Middleware;

use App\Models\ParentModel;
use App\Models\Student;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class HasAdminPanelAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // if ($user && ($user->userable_type !== Student::class && $user->userable_type !== ParentModel::class)) {
        //     return $next($request);
        // }

        if ($user && ! $user->isPortalUser()) {
            return $next($request);
        }

        return redirect('/');
    }
}
