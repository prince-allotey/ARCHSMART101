<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\VAPID;

class GenerateVapidKeys extends Command
{
    protected $signature = 'push:keys';
    protected $description = 'Generate VAPID keys for Web Push and output .env entries';

    public function handle(): int
    {
        $this->info('Generating VAPID keys...');
        $keys = VAPID::createVapidKeys();
        $this->line('Add the following to your .env file:');
        $this->newLine();
        $this->line('VAPID_PUBLIC_KEY=' . $keys['publicKey']);
        $this->line('VAPID_PRIVATE_KEY=' . $keys['privateKey']);
        $this->line('VAPID_SUBJECT=mailto:admin@example.com');
        $this->newLine();
        $this->info('Done.');
        return self::SUCCESS;
    }
}
