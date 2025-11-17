<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $agents = User::role('editor')->get();

        $properties = [
           
            
        ];

        foreach ($properties as $propertyData) {
            $property = Property::create([
                ...$propertyData,
                'agent_id' => $agents->random()->id,
            ]);
        }
    }
}