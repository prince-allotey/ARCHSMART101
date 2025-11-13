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
            [
                'title' => 'Luxury Smart Villa in East Legon',
                'description' => 'A stunning 4-bedroom smart home villa with automated lighting, climate control, and security systems. Located in the prestigious East Legon neighborhood.',
                'price' => 850000,
                'location' => 'East Legon, Accra',
                'type' => 'house',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'area' => 280,
                'features' => ['Smart Home', 'Swimming Pool', 'Garden', 'Garage', 'Solar Panels'],
                'is_smart_home' => true,
                'is_featured' => true,
                'status' => 'available',
                'latitude' => 5.6037,
                'longitude' => -0.1870,
            ],
            [
                'title' => 'Modern Apartment in Airport City',
                'description' => 'Contemporary 2-bedroom apartment with smart appliances and premium finishes. Perfect for young professionals.',
                'price' => 320000,
                'location' => 'Airport City, Accra',
                'type' => 'apartment',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 120,
                'features' => ['Smart Appliances', 'Gym', 'Security', 'Parking'],
                'is_smart_home' => true,
                'is_featured' => true,
                'status' => 'available',
                'latitude' => 5.6037,
                'longitude' => -0.1870,
            ],
            [
                'title' => 'Prime Commercial Land in Tema',
                'description' => 'Strategically located commercial plot perfect for mixed-use development. Close to major highways and amenities.',
                'price' => 450000,
                'location' => 'Tema, Greater Accra',
                'type' => 'land',
                'area' => 500,
                'features' => ['Prime Location', 'Development Ready', 'Road Access'],
                'is_smart_home' => false,
                'is_featured' => false,
                'status' => 'available',
                'latitude' => 5.6698,
                'longitude' => -0.0166,
            ],
            [
                'title' => 'Executive Townhouse in Cantonments',
                'description' => 'Elegant 3-bedroom townhouse in the heart of Cantonments with modern amenities and beautiful landscaping.',
                'price' => 650000,
                'location' => 'Cantonments, Accra',
                'type' => 'house',
                'bedrooms' => 3,
                'bathrooms' => 3,
                'area' => 200,
                'features' => ['Gated Community', 'Landscaped Garden', 'Modern Kitchen', 'Study Room'],
                'is_smart_home' => false,
                'is_featured' => true,
                'status' => 'available',
                'latitude' => 5.5600,
                'longitude' => -0.1969,
            ],
            [
                'title' => 'Smart Office Complex in Ridge',
                'description' => 'State-of-the-art office building with smart building management systems and premium location in Ridge.',
                'price' => 1200000,
                'location' => 'Ridge, Accra',
                'type' => 'commercial',
                'area' => 800,
                'features' => ['Smart Building Systems', 'Elevator', 'Parking Garage', 'Conference Facilities'],
                'is_smart_home' => true,
                'is_featured' => false,
                'status' => 'available',
                'latitude' => 5.5502,
                'longitude' => -0.2175,
            ],
        ];

        foreach ($properties as $propertyData) {
            $property = Property::create([
                ...$propertyData,
                'agent_id' => $agents->random()->id,
            ]);
        }
    }
}