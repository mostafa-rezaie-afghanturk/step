<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // broadcast(new NotificationEvent( 1 , "nasim"))->toOthers();
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request)
    {

        try {
            $validatedData = $request->validated();

            $user = $request->user();

            if ($request->hasFile('profile_picture')) {

                if ($user->profile_picture) {
                    Storage::disk('public')->delete($user->profile_picture);
                }

                $file = $request->file('profile_picture');
                $filename = time().'_'.$file->getClientOriginalName();
                $file->storeAs('profile_pictures', $filename, 'public');

                $validatedData['profile_picture'] = 'profile_pictures/'.$filename;
            }
            if ($request->profile_picture == 'null') {

                if ($user->profile_picture) {
                    Storage::disk('public')->delete($user->profile_picture);
                }

                $validatedData['profile_picture'] = 'assets/img/profile_user.jpg';
            } else {
            }

            $user->fill($validatedData);
            $user->save();

            return response()->json([
                'result' => true,

            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'result' => false,

            ]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
