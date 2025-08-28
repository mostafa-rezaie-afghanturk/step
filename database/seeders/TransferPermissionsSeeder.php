<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class TransferPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create transfer permissions
        $permissions = [
            'asset-transfer read',
            'asset-transfer create',
            'asset-transfer edit',
            'asset-transfer delete',
            'asset-transfer export',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
                'module' => 'transfers'
            ]);
        }

        // Assign permissions to admin role (assuming it exists)
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo($permissions);
        }

        // Assign read permission to user role (assuming it exists)
        $userRole = Role::where('name', 'user')->first();
        if ($userRole) {
            $userRole->givePermissionTo(['asset-transfer read']);
        }
    }
}
