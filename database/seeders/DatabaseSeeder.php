<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Assign the first role to the user
        $firstRole = Role::first();
        if ($firstRole) {
            $user->assignRole($firstRole);
        }

        // $this->call(CountrySeeder::class);
        // $this->call(LanguageSeeder::class);
        // $this->call(ProvinceSeeder::class);
        // $this->call(SchoolSeeder::class);
        // $this->call(LibrarySeeder::class);
    }
}
