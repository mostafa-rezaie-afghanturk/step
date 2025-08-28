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
            'countries',
            'campuses',
            'lands',
            'educational-institutions',
            'buildings',
            'floors',
            'rooms',
            'fixture-furnishings',
            'educational-materials',
            'users',
            'roles',
            'permissions',
            'activity-log',
            'reports',
            'asset-transfer',
        ];
        $actions = ['read', 'write', 'create', 'edit', 'delete', 'report', 'import', 'export', 'print'];

        Permission::create(['name' => 'dashboard read', 'module' => 'dashboard']);

        // Permissions
        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                Permission::create(['name' => "$entity $action", 'module' => $entity]);
            }
            // Book specific actions
            // if ($entity === '') {
            //     Permission::create(['name' => '', 'module' => '']);
            // }
        }

        // Roles
        $centraAdministrator = Role::create(['name' => 'Central Adminstrator']);
        $centraAdministrator->givePermissionTo(Permission::all());
    }
}
