<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

class CountryFactory extends Factory
{
    protected $model = Country::class;

    public function definition()
    {
        return [
            'country_code' => $this->faker->countryCode,
            'name' => $this->faker->country,
            'name_tr' => $this->faker->word,
            'name_primary' => $this->faker->country,
        ];
    }
}
