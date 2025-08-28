<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Country>
 */
class CountryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'country_code' => $this->faker->unique()->countryCode(),
            'name' => $this->faker->country(),
            'name_tr' => $this->faker->country(),
            'name_primary' => $this->faker->country(),
        ];
    }
}
