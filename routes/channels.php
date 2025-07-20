<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

// Broadcast::channel('notifications.{userId}', function ($user, $userId) {
//     return (int) $user->id === (int) $userId;
// });

// Broadcast::channel('notifications.{userId}', function ($user, $userId) {
//     Log::info('Broadcasting auth request', [
//         'user' => $user,
//         'userId' => $userId,
//     ]);

//     return (int) $user->id === (int) $userId;
// });
