<?php

namespace Database\Factories;

use App\Models\TransferTransaction;
use App\Models\User;
use App\Models\FixtureFurnishing;
use App\Models\EducationalMaterial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransferTransaction>
 */
class TransferTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fromUser = User::factory()->create();
        $toUser = User::factory()->create();
        
        // Randomly choose between fixture and educational material
        $assetType = $this->faker->randomElement([
            FixtureFurnishing::class,
            EducationalMaterial::class
        ]);

        if ($assetType === FixtureFurnishing::class) {
            $asset = FixtureFurnishing::factory()->create();
        } else {
            $asset = EducationalMaterial::factory()->create();
        }

        return [
            'from_user_id' => $fromUser->id,
            'to_user_id' => $toUser->id,
            'asset_or_material_type' => $assetType,
            'asset_or_material_id' => $asset->getKey(),
            'transfer_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'return_status' => $this->faker->randomElement(['Transferred', 'Returned']),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the transfer is active (not returned).
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'return_status' => 'Transferred',
        ]);
    }

    /**
     * Indicate that the transfer has been returned.
     */
    public function returned(): static
    {
        return $this->state(fn (array $attributes) => [
            'return_status' => 'Returned',
        ]);
    }
}
