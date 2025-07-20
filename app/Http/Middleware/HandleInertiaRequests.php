<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'country' => $request->user()->country,
                    'school' => $request->user()->school,
                    'library' => $request->user()->library,
                ]) : null,
                'permissions' => fn() => $request->user() ? $request->user()->getPermissionsViaRoles()->pluck('name') : null,
                'roles' => fn() => $request->user() ? $request->user()->roles->pluck('name') : null,
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'totalBooksRead' => function () use ($request) {
                $user = $request->user();
                if ($user && $user->userable && $user->userable->borrower) {
                    return $user->userable->borrower->totalBooksRead();
                } elseif ($user && $user->userable) {
                    return $user->userable->totalBooksRead();
                }

                return 0;
            },
        ];
    }
}
