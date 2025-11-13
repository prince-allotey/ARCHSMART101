<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ResetAdmin extends Command
{
    protected $signature = 'user:reset-admin {--email=admin@gmail.com} {--password=password}';
    protected $description = 'Ensure an admin user exists and reset its password';

    public function handle(): int
    {
        $email = $this->option('email');
        $password = $this->option('password');

        $user = User::where('email', $email)->first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]);
            $this->info("Created admin user: {$email}");
        } else {
            $user->password = Hash::make($password);
            $user->role = 'admin';
            $user->save();
            $this->info("Updated admin user password: {$email}");
        }

    $this->line("Login with: email={$email} password={$password}");
    $this->warn('If you seeded earlier with admin@example.com you may now have two admins; delete the old one if not needed.');
        return self::SUCCESS;
    }
}
