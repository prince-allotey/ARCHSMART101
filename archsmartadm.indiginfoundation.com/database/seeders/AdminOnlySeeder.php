<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminOnlySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the admin role exists (Spatie permission package)
        try {
            if (class_exists(\Spatie\Permission\Models\Role::class)) {
                \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
            }
        } catch (\Exception $e) {
            // ignore if Spatie isn't present or something goes wrong
        }

        // Create or update a single admin user. Password can be set via ADMIN_PASSWORD in the .env
        $email = env('ADMIN_EMAIL', 'admin@archsmart.gh');
        $password = env('ADMIN_PASSWORD', 'password');

        $admin = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Admin User'),
                'password' => Hash::make($password),
                'phone' => env('ADMIN_PHONE', '+233 30 123 4567'),
                'email_verified_at' => now(),
            ]
        );

        // Assign role if package available
        try {
            if (method_exists($admin, 'assignRole')) {
                $admin->assignRole('admin');
            }
        } catch (\Exception $e) {
            // ignore
        }

        $this->command->info('Admin user ensured: ' . $email);
    }
}
