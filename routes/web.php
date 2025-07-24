<?php

use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EducationalInstitutionController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\LandController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\RoomController;
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

        Route::get('/export', [UserController::class, 'export'])->name('users.export')->middleware('can:users export');
        Route::post('/import', [UserController::class, 'import'])->name('users.import')->middleware('can:users import');
        Route::get('/pdf', [UserController::class, 'pdf'])->name('users.pdf')->middleware('can:users export');

        Route::get('/countries/{search?}', [UserController::class, 'country'])->name('users.country');

        Route::get('/datatable', [UserController::class, 'datatable'])->name('users.datatable')->middleware('can:users read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [UserController::class, 'bulkEdit'])->name('users.bulkEdit')->middleware('can:users edit');
            Route::delete('/delete', [UserController::class, 'bulkDelete'])->name('users.bulkDelete')->middleware('can:users delete');
        });
        Route::get('/{id}/edit', [UserController::class, 'edit'])->name('users.edit')->middleware('can:users edit');
        Route::get('/', [UserController::class, 'index'])->name('users.index')->middleware('can:users read');
        Route::post('/', [UserController::class, 'store'])->name('users.store')->middleware('can:users create');
        Route::get('/create/{id?}', [UserController::class, 'create'])->name('users.create')->middleware('can:users create');
        Route::get('/{id}', [UserController::class, 'show'])->name('users.show')->middleware('can:users read');
        Route::put('/{id}', [UserController::class, 'update'])->name('users.update')->middleware('can:users edit');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('can:users delete');
        Route::post('/users/{id}/change-password', [UserController::class, 'changePassword'])->name('users.changePassword');

        Route::get('/activity_log/{id}', [UserController::class, 'logActivity'])->name('users.logActivity');
    });

    Route::group(['prefix' => 'roles'], function () {

        Route::get('/export', [RolesController::class, 'export'])->name('roles.export')->middleware('can:roles export');
        Route::get('/pdf', [RolesController::class, 'pdf'])->name('roles.pdf')->middleware('can:roles export');

        Route::get('/search/{search?}', [RolesController::class, 'search'])->name('roles.search')->middleware('can:roles read');

        Route::get('/datatable', [RolesController::class, 'datatable'])->name('roles.datatable')->middleware('can:roles read');

        Route::get('/', [RolesController::class, 'index'])->name('roles.index')->middleware('can:roles read');
        Route::post('/', [RolesController::class, 'store'])->name('roles.store');
        Route::get('/create/{id?}', [RolesController::class, 'create'])->name('roles.create');
        Route::get('/{id}/edit', [RolesController::class, 'edit'])->name('roles.edit')->middleware('can:roles edit');
        Route::put('/{id}', [RolesController::class, 'update'])->name('roles.update')->middleware('can:roles edit');
        Route::delete('/{id}', [RolesController::class, 'destroy'])->name('roles.destroy');
    });

    Route::group(['prefix' => 'permissions'], function () {

        Route::get('/export', [PermissionsController::class, 'export'])->name('permissions.export')->middleware('can:permissions export');
        Route::get('/pdf', [PermissionsController::class, 'pdf'])->name('permissions.pdf')->middleware('can:permissions export');

        Route::get('/datatable', [PermissionsController::class, 'datatable'])->name('permissions.datatable')->middleware('can:permissions read');

        Route::get('/', [PermissionsController::class, 'index'])->name('permissions.index')->middleware('can:permissions read');
    });

    Route::group(['prefix' => 'countries'], function () {


        Route::get('/export', [CountryController::class, 'export'])->name('countries.export')->middleware('can:countries export');
        Route::get('/pdf', [CountryController::class, 'pdf'])->name('countries.pdf')->middleware('can:countries export');
        Route::get('/search/{search?}', [CountryController::class, 'search'])->name('countries.search')->middleware('can:countries read');

        Route::get('/datatable', [CountryController::class, 'datatable'])->name('countries.datatable')->middleware('can:countries read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [CountryController::class, 'bulkEdit'])->name('countries.bulkEdit')->middleware('can:countries edit');
            Route::delete('/delete', [CountryController::class, 'bulkDelete'])->name('countries.bulkDelete')->middleware('can:countries delete');
        });
        Route::get('/{id}/edit', [CountryController::class, 'edit'])->name('countries.edit')->middleware('can:countries edit');
        Route::get('/', [CountryController::class, 'index'])->name('countries.index')->middleware('can:countries read');
        Route::post('/', [CountryController::class, 'store'])->name('countries.store')->middleware('can:countries create');
        Route::get('/create/{id?}', [CountryController::class, 'create'])->name('countries.create')->middleware('can:countries create');
        Route::get('/show/{id}', [CountryController::class, 'show'])->name('countries.show')->middleware('can:countries read');
        Route::put('/{id}', [CountryController::class, 'update'])->name('countries.update')->middleware('can:countries edit');
        Route::delete('/{id}', [CountryController::class, 'destroy'])->name('countries.destroy')->middleware('can:countries delete');
        Route::get('/activity_log/{id}', [CountryController::class, 'logActivity'])->name('countries.logActivity');
    });

    Route::group(['prefix' => 'campuses'], function () {

        Route::get('/export', [CampusController::class, 'export'])->name('campuses.export')->middleware('can:campuses export');
        Route::get('/pdf', [CampusController::class, 'pdf'])->name('campuses.pdf')->middleware('can:campuses export');
        Route::get('/search/{search?}', [CampusController::class, 'search'])->name('campuses.search')->middleware('can:campuses read');

        Route::get('/datatable', [CampusController::class, 'datatable'])->name('campuses.datatable')->middleware('can:campuses read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [CampusController::class, 'bulkEdit'])->name('campuses.bulkEdit')->middleware('can:campuses edit');
            Route::delete('/delete', [CampusController::class, 'bulkDelete'])->name('campuses.bulkDelete')->middleware('can:campuses delete');
        });

        Route::get('/{id}/edit', [CampusController::class, 'edit'])->name('campuses.edit')->middleware('can:campuses edit');
        Route::get('/', [CampusController::class, 'index'])->name('campuses.index')->middleware('can:campuses read');
        Route::post('/', [CampusController::class, 'store'])->name('campuses.store')->middleware('can:campuses create');
        Route::get('/create/{id?}', [CampusController::class, 'create'])->name('campuses.create')->middleware('can:campuses create');
        Route::get('/show/{id}', [CampusController::class, 'show'])->name('campuses.show')->middleware('can:campuses read');
        Route::put('/{id}', [CampusController::class, 'update'])->name('campuses.update')->middleware('can:campuses edit');
        Route::post('/{id}/change-status', [CampusController::class, 'changeStatus'])->name('campuses.changeStatus')->middleware('can:campuses edit');
        Route::delete('/{id}', [CampusController::class, 'destroy'])->name('campuses.destroy')->middleware('can:campuses delete');
        Route::get('/activity_log/{id}', [CampusController::class, 'logActivity'])->name('campuses.logActivity');
    });

    Route::group(['prefix' => 'educational-institutions'], function () {

        Route::get('/export', [EducationalInstitutionController::class, 'export'])->name('educational-institutions.export')->middleware('can:educational-institutions export');
        Route::get('/pdf', [EducationalInstitutionController::class, 'pdf'])->name('educational-institutions.pdf')->middleware('can:educational-institutions export');


        Route::get('/datatable', [EducationalInstitutionController::class, 'datatable'])->name('educational-institutions.datatable')->middleware('can:educational-institutions read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [EducationalInstitutionController::class, 'bulkEdit'])->name('educational-institutions.bulkEdit')->middleware('can:educational-institutions edit');
            Route::delete('/delete', [EducationalInstitutionController::class, 'bulkDelete'])->name('educational-institutions.bulkDelete')->middleware('can:educational-institutions delete');
        });

        Route::get('/{id}/edit', [EducationalInstitutionController::class, 'edit'])->name('educational-institutions.edit')->middleware('can:educational-institutions edit');
        Route::get('/', [EducationalInstitutionController::class, 'index'])->name('educational-institutions.index')->middleware('can:educational-institutions read');
        Route::post('/', [EducationalInstitutionController::class, 'store'])->name('educational-institutions.store')->middleware('can:educational-institutions create');
        Route::get('/create/{id?}', [EducationalInstitutionController::class, 'create'])->name('educational-institutions.create')->middleware('can:educational-institutions create');
        Route::get('/show/{id}', [EducationalInstitutionController::class, 'show'])->name('educational-institutions.show')->middleware('can:educational-institutions read');
        Route::put('/{id}', [EducationalInstitutionController::class, 'update'])->name('educational-institutions.update')->middleware('can:educational-institutions edit');
        Route::post('/{id}/change-status', [EducationalInstitutionController::class, 'changeStatus'])->name('educational-institutions.changeStatus')->middleware('can:educational-institutions edit');
        Route::delete('/{id}', [EducationalInstitutionController::class, 'destroy'])->name('educational-institutions.destroy')->middleware('can:educational-institutions delete');
        Route::get('/activity_log/{id}', [EducationalInstitutionController::class, 'logActivity'])->name('educational-institutions.logActivity');
    });

    Route::group(['prefix' => 'lands'], function () {

        Route::get('/export', [LandController::class, 'export'])->name('lands.export')->middleware('can:lands export');
        Route::get('/pdf', [LandController::class, 'pdf'])->name('lands.pdf')->middleware('can:lands export');
        Route::get('/search/{search?}', [LandController::class, 'search'])->name('lands.search')->middleware('can:lands read');

        Route::get('/datatable', [LandController::class, 'datatable'])->name('lands.datatable')->middleware('can:lands read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [LandController::class, 'bulkEdit'])->name('lands.bulkEdit')->middleware('can:lands edit');
            Route::delete('/delete', [LandController::class, 'bulkDelete'])->name('lands.bulkDelete')->middleware('can:lands delete');
        });

        Route::get('/{id}/edit', [LandController::class, 'edit'])->name('lands.edit')->middleware('can:lands edit');
        Route::get('/', [LandController::class, 'index'])->name('lands.index')->middleware('can:lands read');
        Route::post('/', [LandController::class, 'store'])->name('lands.store')->middleware('can:lands create');
        Route::get('/create/{id?}', [LandController::class, 'create'])->name('lands.create')->middleware('can:lands create');
        Route::get('/show/{id}', [LandController::class, 'show'])->name('lands.show')->middleware('can:lands read');
        Route::put('/{id}', [LandController::class, 'update'])->name('lands.update')->middleware('can:lands edit');
        Route::post('/{id}/change-status', [LandController::class, 'changeStatus'])->name('lands.changeStatus')->middleware('can:lands edit');
        Route::delete('/{id}', [LandController::class, 'destroy'])->name('lands.destroy')->middleware('can:lands delete');
        Route::get('/activity_log/{id}', [LandController::class, 'logActivity'])->name('lands.logActivity');
    });

    Route::group(['prefix' => 'buildings'], function () {

        Route::get('/export', [BuildingController::class, 'export'])->name('buildings.export')->middleware('can:buildings export');
        Route::get('/pdf', [BuildingController::class, 'pdf'])->name('buildings.pdf')->middleware('can:buildings export');
        Route::get('/search/{search?}', [BuildingController::class, 'search'])->name('buildings.search')->middleware('can:buildings read');

        Route::get('/datatable', [BuildingController::class, 'datatable'])->name('buildings.datatable')->middleware('can:buildings read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [BuildingController::class, 'bulkEdit'])->name('buildings.bulkEdit')->middleware('can:buildings edit');
            Route::delete('/delete', [BuildingController::class, 'bulkDelete'])->name('buildings.bulkDelete')->middleware('can:buildings delete');
        });

        Route::get('/{id}/edit', [BuildingController::class, 'edit'])->name('buildings.edit')->middleware('can:buildings edit');
        Route::get('/', [BuildingController::class, 'index'])->name('buildings.index')->middleware('can:buildings read');
        Route::post('/', [BuildingController::class, 'store'])->name('buildings.store')->middleware('can:buildings create');
        Route::get('/create/{id?}', [BuildingController::class, 'create'])->name('buildings.create')->middleware('can:buildings create');
        Route::get('/show/{id}', [BuildingController::class, 'show'])->name('buildings.show')->middleware('can:buildings read');
        Route::put('/{id}', [BuildingController::class, 'update'])->name('buildings.update')->middleware('can:buildings edit');
        Route::post('/{id}/change-status', [BuildingController::class, 'changeStatus'])->name('buildings.changeStatus')->middleware('can:buildings edit');
        Route::delete('/{id}', [BuildingController::class, 'destroy'])->name('buildings.destroy')->middleware('can:buildings delete');
        Route::get('/activity_log/{id}', [BuildingController::class, 'logActivity'])->name('buildings.logActivity');
    });

    Route::group(['prefix' => 'floors'], function () {

        Route::get('/export', [FloorController::class, 'export'])->name('floors.export')->middleware('can:floors export');
        Route::get('/pdf', [FloorController::class, 'pdf'])->name('floors.pdf')->middleware('can:floors export');
        Route::get('/search/{search?}', [BuildingController::class, 'search'])->name('floors.search')->middleware('can:floors read');

        Route::get('/datatable', [FloorController::class, 'datatable'])->name('floors.datatable')->middleware('can:floors read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [FloorController::class, 'bulkEdit'])->name('floors.bulkEdit')->middleware('can:floors edit');
            Route::delete('/delete', [FloorController::class, 'bulkDelete'])->name('floors.bulkDelete')->middleware('can:floors delete');
        });

        Route::get('/{id}/edit', [FloorController::class, 'edit'])->name('floors.edit')->middleware('can:floors edit');
        Route::get('/', [FloorController::class, 'index'])->name('floors.index')->middleware('can:floors read');
        Route::post('/', [FloorController::class, 'store'])->name('floors.store')->middleware('can:floors create');
        Route::get('/create/{id?}', [FloorController::class, 'create'])->name('floors.create')->middleware('can:floors create');
        Route::get('/show/{id}', [FloorController::class, 'show'])->name('floors.show')->middleware('can:floors read');
        Route::put('/{id}', [FloorController::class, 'update'])->name('floors.update')->middleware('can:floors edit');
        Route::post('/{id}/change-status', [FloorController::class, 'changeStatus'])->name('floors.changeStatus')->middleware('can:floors edit');
        Route::delete('/{id}', [FloorController::class, 'destroy'])->name('floors.destroy')->middleware('can:floors delete');
        Route::get('/activity_log/{id}', [FloorController::class, 'logActivity'])->name('floors.logActivity');
    });

    Route::group(['prefix' => 'rooms'], function () {

        Route::get('/export', [RoomController::class, 'export'])->name('rooms.export')->middleware('can:rooms export');
        Route::get('/pdf', [RoomController::class, 'pdf'])->name('rooms.pdf')->middleware('can:rooms export');

        Route::get('/datatable', [RoomController::class, 'datatable'])->name('rooms.datatable')->middleware('can:rooms read');
        Route::group(['prefix' => 'bulk'], function () {
            Route::put('/edit', [RoomController::class, 'bulkEdit'])->name('rooms.bulkEdit')->middleware('can:rooms edit');
            Route::delete('/delete', [RoomController::class, 'bulkDelete'])->name('rooms.bulkDelete')->middleware('can:rooms delete');
        });

        Route::get('/{id}/edit', [RoomController::class, 'edit'])->name('rooms.edit')->middleware('can:rooms edit');
        Route::get('/', [RoomController::class, 'index'])->name('rooms.index')->middleware('can:rooms read');
        Route::post('/', [RoomController::class, 'store'])->name('rooms.store')->middleware('can:rooms create');
        Route::get('/create/{id?}', [RoomController::class, 'create'])->name('rooms.create')->middleware('can:rooms create');
        Route::get('/show/{id}', [RoomController::class, 'show'])->name('rooms.show')->middleware('can:rooms read');
        Route::put('/{id}', [RoomController::class, 'update'])->name('rooms.update')->middleware('can:rooms edit');
        Route::post('/{id}/change-status', [RoomController::class, 'changeStatus'])->name('rooms.changeStatus')->middleware('can:rooms edit');
        Route::delete('/{id}', [RoomController::class, 'destroy'])->name('rooms.destroy')->middleware('can:rooms delete');
        Route::get('/activity_log/{id}', [RoomController::class, 'logActivity'])->name('rooms.logActivity');
    });

    Route::group(['prefix' => 'activity-log'], function () {
        Route::get('/', [ActivityLogsController::class, 'index'])->name('activityLog.index')->middleware('can:activity-log read');
        Route::get('/datatable', [ActivityLogsController::class, 'datatable'])->name('activityLog.datatable')->middleware('can:activity-log read');
        Route::get('/show/{id}', [ActivityLogsController::class, 'show'])->name('activityLog.show')->middleware('can:activity-log read');
    });
});

require __DIR__ . '/auth.php';
