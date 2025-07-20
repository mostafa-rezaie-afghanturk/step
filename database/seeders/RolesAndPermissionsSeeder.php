<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $entities = [
            'books',
            'authors',
            'borrowers',
            'borrowing_records',
            'categories',
            'classes',
            'provinces',
            'countries',
            'inventories',
            'languages',
            'libraries',
            'announcements',
            'schools',
            'sessions',
            'student_classes',
            'students',
            'parents',
            'users',
            'roles',
            'permissions',
            'activity-log',
            'reports',
            'book_type'
        ]; // Add other entities as needed
        $actions = ['read', 'write', 'create', 'edit', 'delete', 'report', 'import', 'export', 'print'];

        Permission::create(['name' => 'dashboard read', 'module' => 'dashboard']);

        // Permissions
        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                Permission::create(['name' => "$entity $action", 'module' => $entity]);
            }
            // Book specific actions
            if ($entity === 'books') {
                Permission::create(['name' => 'books issue', 'module' => 'books']);
                Permission::create(['name' => 'books return', 'module' => 'books']);
                Permission::create(['name' => 'books change status', 'module' => 'books']);
            }
            if ($entity === 'classes') {
                Permission::create(['name' => 'classes students', 'module' => 'classes']);

            }
        }

        // Roles
        $centraAdministrator = Role::create(['name' => 'Central Adminstrator']);
        $centraAdministrator->givePermissionTo(Permission::all());

        $countryRepresentative = Role::create(['name' => 'Country Representative']);
        $schoolPrincipal = Role::create(['name' => 'School Principal']);
        $librarian = Role::create(['name' => 'Librarian']);
        $member = Role::create(['name' => 'Member']);
    }
}
