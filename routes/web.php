<?php

use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EducationalInstitutionController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Models\EducationalInstitution;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/password/change', function () {
        return Inertia::render('Users/ForceChangePassword');
    })->name('password.change');

    Route::post('/password/update', [PasswordController::class, 'update'])->name('password.force-update');
});

Route::middleware(['auth', 'force_password_change'])->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::group(['prefix' => 'users'], function () {
        // Additional routes
        Route::get('/export', [UserController::class, 'export'])->name('users.export')->middleware('can:users export');
        Route::post('/import', [UserController::class, 'import'])->name('users.import')->middleware('can:users import');
        Route::get('/pdf', [UserController::class, 'pdf'])->name('users.pdf')->middleware('can:users export');

        Route::get('/countries/{search?}', [UserController::class, 'country'])->name('users.country');

        Route::get('/datatable', [UserController::class, 'datatable'])->name('users.datatable')->middleware('can:users read'); // Get schools in datatable format
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [UserController::class, 'bulkEdit'])->name('users.bulkEdit')->middleware('can:users edit'); // Bulk edit schools
            Route::delete('/delete', [UserController::class, 'bulkDelete'])->name('users.bulkDelete')->middleware('can:users delete'); // Bulk edit schools

        });
        Route::get('/{id}/edit', [UserController::class, 'edit'])->name('users.edit')->middleware('can:users edit'); // Show form to edit a user
        Route::get('/', [UserController::class, 'index'])->name('users.index')->middleware('can:users read'); // List all schools
        Route::post('/', [UserController::class, 'store'])->name('users.store')->middleware('can:users create'); // Store new school
        Route::get('/create/{id?}', [UserController::class, 'create'])->name('users.create')->middleware('can:users create'); // Show form to create a new school
        Route::get('/{id}', [UserController::class, 'show'])->name('users.show')->middleware('can:users read'); // Show a single school
        Route::put('/{id}', [UserController::class, 'update'])->name('users.update')->middleware('can:users edit'); // Update a school
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('can:users delete'); // Delete a school
        Route::post('/users/{id}/change-password', [UserController::class, 'changePassword'])->name('users.changePassword');

        Route::get('/activity_log/{id}', [UserController::class, 'logActivity'])->name('users.logActivity');
    });

    Route::group(['prefix' => 'roles'], function () {
        // Additional routes
        Route::get('/export', [RolesController::class, 'export'])->name('roles.export')->middleware('can:roles export');
        Route::get('/pdf', [RolesController::class, 'pdf'])->name('roles.pdf')->middleware('can:roles export');

        Route::get('/search/{search?}', [RolesController::class, 'search'])->name('roles.search')->middleware('can:roles read');

        Route::get('/datatable', [RolesController::class, 'datatable'])->name('roles.datatable')->middleware('can:roles read');

        Route::get('/', [RolesController::class, 'index'])->name('roles.index')->middleware('can:roles read'); // List all roles
        Route::post('/', [RolesController::class, 'store'])->name('roles.store'); // Store new school
        Route::get('/create/{id?}', [RolesController::class, 'create'])->name('roles.create'); // Show form to create a new school
        Route::get('/{id}/edit', [RolesController::class, 'edit'])->name('roles.edit')->middleware('can:roles edit'); // Show form to edit a role
        Route::put('/{id}', [RolesController::class, 'update'])->name('roles.update')->middleware('can:roles edit');
        Route::delete('/{id}', [RolesController::class, 'destroy'])->name('roles.destroy'); // Delete a role
    });

    Route::group(['prefix' => 'permissions'], function () {
        // Additional routes
        Route::get('/export', [PermissionsController::class, 'export'])->name('permissions.export')->middleware('can:permissions export');
        Route::get('/pdf', [PermissionsController::class, 'pdf'])->name('permissions.pdf')->middleware('can:permissions export');

        Route::get('/datatable', [PermissionsController::class, 'datatable'])->name('permissions.datatable')->middleware('can:permissions read');

        Route::get('/', [PermissionsController::class, 'index'])->name('permissions.index')->middleware('can:permissions read'); // List all permissions
    });

    Route::group(['prefix' => 'countries'], function () {
        // Additional routes

        Route::get('/export', [CountryController::class, 'export'])->name('countries.export')->middleware('can:countries export');
        Route::get('/pdf', [CountryController::class, 'pdf'])->name('countries.pdf')->middleware('can:countries export');
        Route::get('/search/{search?}', [CountryController::class, 'search'])->name('countries.search')->middleware('can:countries read');

        Route::get('/datatable', [CountryController::class, 'datatable'])->name('countries.datatable')->middleware('can:countries read'); // Get schools in datatable format
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [CountryController::class, 'bulkEdit'])->name('countries.bulkEdit')->middleware('can:countries edit'); // Bulk edit schools
            Route::delete('/delete', [CountryController::class, 'bulkDelete'])->name('countries.bulkDelete')->middleware('can:countries delete'); // Bulk edit schools

        });
        Route::get('/{id}/edit', [CountryController::class, 'edit'])->name('countries.edit')->middleware('can:countries edit'); // Show form to edit a user
        Route::get('/', [CountryController::class, 'index'])->name('countries.index')->middleware('can:countries read'); // List all schools
        Route::post('/', [CountryController::class, 'store'])->name('countries.store')->middleware('can:countries create'); // Store new school
        Route::get('/create/{id?}', [CountryController::class, 'create'])->name('countries.create')->middleware('can:countries create'); // Show form to create a new school
        Route::get('/show/{id}', [CountryController::class, 'show'])->name('countries.show')->middleware('can:countries read'); // Show a single school
        Route::put('/{id}', [CountryController::class, 'update'])->name('countries.update')->middleware('can:countries edit'); // Update a school
        Route::delete('/{id}', [CountryController::class, 'destroy'])->name('countries.destroy')->middleware('can:countries delete');
        Route::get('/activity_log/{id}', [CountryController::class, 'logActivity'])->name('countries.logActivity');
    });

    Route::group(['prefix' => 'campuses'], function () {
        // Additional routes
        Route::get('/export', [CampusController::class, 'export'])->name('campuses.export')->middleware('can:campuses export');
        Route::get('/pdf', [CampusController::class, 'pdf'])->name('campuses.pdf')->middleware('can:campuses export');
        Route::get('/search/{search?}', [CampusController::class, 'search'])->name('campuses.search')->middleware('can:campuses read');

        Route::get('/datatable', [CampusController::class, 'datatable'])->name('campuses.datatable')->middleware('can:campuses read'); // Get schools in datatable format
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [CampusController::class, 'bulkEdit'])->name('campuses.bulkEdit')->middleware('can:campuses edit'); // Bulk edit schools
            Route::delete('/delete', [CampusController::class, 'bulkDelete'])->name('campuses.bulkDelete')->middleware('can:campuses delete'); // Bulk edit schools
        });

        Route::get('/{id}/edit', [CampusController::class, 'edit'])->name('campuses.edit')->middleware('can:campuses edit'); // Show form to edit a school
        Route::get('/', [CampusController::class, 'index'])->name('campuses.index')->middleware('can:campuses read'); // List all schools
        Route::post('/', [CampusController::class, 'store'])->name('campuses.store')->middleware('can:campuses create'); // Store new school
        Route::get('/create/{id?}', [CampusController::class, 'create'])->name('campuses.create')->middleware('can:campuses create'); // Show form to create a new school
        Route::get('/show/{id}', [CampusController::class, 'show'])->name('campuses.show')->middleware('can:campuses read'); // Show a single school
        Route::put('/{id}', [CampusController::class, 'update'])->name('campuses.update')->middleware('can:campuses edit'); // Update a school
        Route::post('/{id}/change-status', [CampusController::class, 'changeStatus'])->name('campuses.changeStatus')->middleware('can:campuses edit'); // Change status of a school
        Route::delete('/{id}', [CampusController::class, 'destroy'])->name('campuses.destroy')->middleware('can:campuses delete'); // Delete a school
        Route::get('/activity_log/{id}', [CampusController::class, 'logActivity'])->name('campuses.logActivity'); // Delete a school
    });

    Route::group(['prefix' => 'educational-institutions'], function () {
        // Additional routes
        Route::get('/export', [EducationalInstitutionController::class, 'export'])->name('educational-institutions.export')->middleware('can:educational-institutions export');
        Route::get('/pdf', [EducationalInstitutionController::class, 'pdf'])->name('educational-institutions.pdf')->middleware('can:educational-institutions export');
        // Route::get('/search/{search?}', [EducationalInstitutionController::class, 'search'])->name('educational-institutions.search')->middleware('can:educational-institutions read');

        Route::get('/datatable', [EducationalInstitutionController::class, 'datatable'])->name('educational-institutions.datatable')->middleware('can:educational-institutions read'); // Get schools in datatable format
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [EducationalInstitutionController::class, 'bulkEdit'])->name('educational-institutions.bulkEdit')->middleware('can:educational-institutions edit'); // Bulk edit schools
            Route::delete('/delete', [EducationalInstitutionController::class, 'bulkDelete'])->name('educational-institutions.bulkDelete')->middleware('can:educational-institutions delete'); // Bulk edit schools
        });

        Route::get('/{id}/edit', [EducationalInstitutionController::class, 'edit'])->name('educational-institutions.edit')->middleware('can:educational-institutions edit'); // Show form to edit a school
        Route::get('/', [EducationalInstitutionController::class, 'index'])->name('educational-institutions.index')->middleware('can:educational-institutions read'); // List all schools
        Route::post('/', [EducationalInstitutionController::class, 'store'])->name('educational-institutions.store')->middleware('can:educational-institutions create'); // Store new school
        Route::get('/create/{id?}', [EducationalInstitutionController::class, 'create'])->name('educational-institutions.create')->middleware('can:educational-institutions create'); // Show form to create a new school
        Route::get('/show/{id}', [EducationalInstitutionController::class, 'show'])->name('educational-institutions.show')->middleware('can:educational-institutions read'); // Show a single school
        Route::put('/{id}', [EducationalInstitutionController::class, 'update'])->name('educational-institutions.update')->middleware('can:educational-institutions edit'); // Update a school
        Route::post('/{id}/change-status', [EducationalInstitutionController::class, 'changeStatus'])->name('educational-institutions.changeStatus')->middleware('can:educational-institutions edit'); // Change status of a school
        Route::delete('/{id}', [EducationalInstitutionController::class, 'destroy'])->name('educational-institutions.destroy')->middleware('can:educational-institutions delete'); // Delete a school
        Route::get('/activity_log/{id}', [EducationalInstitutionController::class, 'logActivity'])->name('educational-institutions.logActivity'); // Delete a school
    });

    Route::group(['prefix' => 'activity-log'], function () {
        Route::get('/', [ActivityLogsController::class, 'index'])->name('activityLog.index')->middleware('can:activity-log read');
        Route::get('/datatable', [ActivityLogsController::class, 'datatable'])->name('activityLog.datatable')->middleware('can:activity-log read');
        Route::get('/show/{id}', [ActivityLogsController::class, 'show'])->name('activityLog.show')->middleware('can:activity-log read');
    });
});

// Removed the duplicate require statement
require __DIR__ . '/auth.php';
