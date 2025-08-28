<?php

namespace Database\Factories;

use App\Models\FixtureFurnishing;
use App\Models\Campus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FixtureFurnishing>
 */
class FixtureFurnishingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $assetCodeCounter = 1;
        
        return [
            'location_type' => 'App\\Models\\Campus',
            'location_id' => Campus::factory(),
            'asset_code' => 'FF' . str_pad($assetCodeCounter++, 6, '0', STR_PAD_LEFT),
            'tmv_code' => $this->faker->optional()->bothify('TMV-####'),
            'group' => $this->faker->randomElement(['Furniture', 'White Goods', 'Electronics', 'Technical']),
            'subgroup' => $this->faker->word(),
            'status' => $this->faker->randomElement(['Very good', 'Good', 'Maintenance required', 'Unusable', 'Scrap']),
            'usage' => $this->faker->randomElement(['Active', 'Passive']),
            'available_date' => $this->faker->optional()->date(),
            'supply_method' => $this->faker->randomElement(['Purchase', 'Donation', 'Transfer from FETO']),
            'supply_info' => $this->faker->optional()->sentence(),
            'price' => $this->faker->optional()->randomFloat(2, 10, 10000),
            'manufacturer' => $this->faker->optional()->company(),
            'production_site' => $this->faker->optional()->city(),
            'production_date' => $this->faker->optional()->date(),
            'technical_specifications' => $this->faker->optional()->randomElement([null, json_encode(['spec' => $this->faker->word()])]),
            'related_level' => $this->faker->optional()->randomElement([
                'Preschool', 'Primary School', 'Middle School', 'High School', 'Other'
            ]),
            'lifespan' => $this->faker->optional()->numberBetween(1, 20),
            'start_date' => $this->faker->optional()->date(),
            'warranty_start' => $this->faker->optional()->date(),
            'warranty_end' => $this->faker->optional()->date(),
            'brand' => $this->faker->optional()->company(),
            'model' => $this->faker->optional()->bothify('Model-####'),
            'maintenance_notes' => $this->faker->optional()->paragraph(),
            'service_info' => $this->faker->optional()->sentence(),
            'calibration_required' => $this->faker->boolean(20),
            'calibration_history' => $this->faker->optional()->paragraph(),
        ];
    }
}
