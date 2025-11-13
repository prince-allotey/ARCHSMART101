<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@archsmart.gh'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'phone' => '+233 30 123 4567',
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Create editor user
        $editor = User::firstOrCreate(
            ['email' => 'editor@archsmart.gh'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password'),
                'phone' => '+233 24 987 6543',
                'email_verified_at' => now(),
            ]
        );
        $editor->assignRole('editor');

        // Create sample agents
        $agents = [
            [
                'name' => 'Kwame Asante',
                'email' => 'kwame@archsmart.gh',
                'phone' => '+233 24 123 4567',
            ],
            [
                'name' => 'Ama Osei',
                'email' => 'ama@archsmart.gh',
                'phone' => '+233 24 987 6543',
            ],
            [
                'name' => 'Kofi Mensah',
                'email' => 'kofi@archsmart.gh',
                'phone' => '+233 24 555 7777',
            ],
        ];

        foreach ($agents as $agentData) {
            $agent = User::firstOrCreate(
                ['email' => $agentData['email']],
                [
                    'name' => $agentData['name'],
                    'password' => Hash::make('password'),
                    'phone' => $agentData['phone'],
                    'email_verified_at' => now(),
                ]
            );
            $agent->assignRole('editor');
        }
    }
}