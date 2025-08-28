<?php

namespace Tests\Feature;

use App\Models\TransferTransaction;
use App\Models\User;
use App\Models\FixtureFurnishing;
use App\Models\EducationalMaterial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransferTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_transfer_transaction()
    {
        $fromUser = User::factory()->create();
        $toUser = User::factory()->create();
        
        // Create a simple fixture without complex dependencies
        $fixture = FixtureFurnishing::create([
            'location_type' => 'App\\Models\\Campus',
            'location_id' => 1,
            'asset_code' => 'TEST-001',
            'group' => 'Furniture',
            'subgroup' => 'Test Subgroup',
            'status' => 'Good',
            'usage' => 'Active',
        ]);

        $transferData = [
            'from_user_id' => $fromUser->id,
            'to_user_id' => $toUser->id,
            'asset_or_material_type' => FixtureFurnishing::class,
            'asset_or_material_id' => $fixture->fixture_furnishing_id,
            'transfer_date' => now()->toDateString(),
            'notes' => 'Test transfer',
        ];

        $transfer = TransferTransaction::create($transferData);

        $this->assertDatabaseHas('transfer_transactions', [
            'transfer_transaction_id' => $transfer->transfer_transaction_id,
            'from_user_id' => $fromUser->id,
            'to_user_id' => $toUser->id,
            'return_status' => 'Transferred',
        ]);
    }

    public function test_can_mark_transfer_as_returned()
    {
        $fromUser = User::factory()->create();
        $toUser = User::factory()->create();
        
        // Create a simple fixture without complex dependencies
        $fixture = FixtureFurnishing::create([
            'location_type' => 'App\\Models\\Campus',
            'location_id' => 1,
            'asset_code' => 'TEST-003',
            'group' => 'Furniture',
            'subgroup' => 'Test Subgroup',
            'status' => 'Good',
            'usage' => 'Active',
        ]);

        $transfer = TransferTransaction::create([
            'from_user_id' => $fromUser->id,
            'to_user_id' => $toUser->id,
            'asset_or_material_type' => FixtureFurnishing::class,
            'asset_or_material_id' => $fixture->fixture_furnishing_id,
            'transfer_date' => now()->toDateString(),
            'return_status' => 'Transferred'
        ]);

        $transfer->update(['return_status' => 'Returned']);

        $this->assertDatabaseHas('transfer_transactions', [
            'transfer_transaction_id' => $transfer->transfer_transaction_id,
            'return_status' => 'Returned',
        ]);
    }

    public function test_transfer_has_relationships()
    {
        $fromUser = User::factory()->create();
        $toUser = User::factory()->create();
        
        // Create a simple fixture without complex dependencies
        $fixture = FixtureFurnishing::create([
            'location_type' => 'App\\Models\\Campus',
            'location_id' => 1,
            'asset_code' => 'TEST-002',
            'group' => 'Furniture',
            'subgroup' => 'Test Subgroup',
            'status' => 'Good',
            'usage' => 'Active',
        ]);

        $transfer = TransferTransaction::create([
            'from_user_id' => $fromUser->id,
            'to_user_id' => $toUser->id,
            'asset_or_material_type' => FixtureFurnishing::class,
            'asset_or_material_id' => $fixture->fixture_furnishing_id,
            'transfer_date' => now()->toDateString(),
        ]);

        $this->assertInstanceOf(User::class, $transfer->fromUser);
        $this->assertInstanceOf(User::class, $transfer->toUser);
        $this->assertInstanceOf(FixtureFurnishing::class, $transfer->assetOrMaterial);
    }
}
