<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    public function update(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        // Check if the new password is the same as the current password
        if (Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'The new password must be different from the current password.']);
        }

        // Update the user's password
        $user->password = Hash::make($request->password);
        $user->force_password_change = false;
        $user->save();

        return redirect()->route('dashboard')->with('success', 'Your password has been successfully changed.');
    }
}
