<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ResetUserPassword extends Command
{
    protected $signature = 'user:reset-password {email} {password} {--role=user : admin, agent, or user}';
    protected $description = 'Reset a user\'s password (creates user if missing)';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');
        $role = $this->option('role') ?: 'user';

        $user = User::where('email', $email)->first();
        if (!$user) {
            $user = User::create([
                'name' => ucfirst($role) . ' User',
                'email' => $email,
                'password' => Hash::make($password),
                'role' => $role,
                'is_agent' => $role === 'agent',
                'is_approved' => true,
            ]);
            $this->info("Created {$role} user {$email}");
        } else {
            $user->password = Hash::make($password);
            if ($this->option('role')) {
                $user->role = $role;
                $user->is_agent = $role === 'agent';
            }
            $user->save();
            $this->info("Updated password for {$email} (role: {$user->role})");
        }

        return self::SUCCESS;
    }
}
