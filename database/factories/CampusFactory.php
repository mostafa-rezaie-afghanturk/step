<?php

namespace Database\Factories;

use App\Models\Campus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campus>
 */
class CampusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'country_id' => \App\Models\Country::inRandomOrder()->first()->country_id,
            'campus_code' => $this->faker->unique()->bothify('CAMP-####'),
            'name_en' => $this->faker->company() . ' Campus',
            'name_tr' => $this->faker->company() . ' Kampüsü',
            'name_local' => $this->faker->company() . ' Campus',
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'website' => $this->faker->url(),
            'social_media_address_1' => $this->faker->url(),
            'social_media_address_2' => $this->faker->url(),
            'social_media_address_3' => $this->faker->url(),
        ];
    }
}
