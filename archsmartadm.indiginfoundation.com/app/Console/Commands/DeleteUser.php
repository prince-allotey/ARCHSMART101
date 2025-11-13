<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class DeleteUser extends Command
{
    protected $signature = 'user:delete {--email= : Email of user to delete}';
    protected $description = 'Delete a user by email if it exists';

    public function handle(): int
    {
        $email = $this->option('email');
        if (!$email) {
            $this->error('Please provide --email=example@domain.com');
            return self::FAILURE;
        }
        $user = User::where('email', $email)->first();
        if (!$user) {
            $this->warn("No user found with email: {$email}");
            return self::SUCCESS;
        }
        $user->delete();
        $this->info("Deleted user: {$email}");
        return self::SUCCESS;
    }
}
