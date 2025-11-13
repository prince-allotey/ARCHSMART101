<?php

namespace App\Providers;

use App\Models\Property;
use App\Models\BlogPost;
use App\Models\Inquiry;
use App\Models\Resource;
use App\Policies\PropertyPolicy;
use App\Policies\BlogPostPolicy;
use App\Policies\InquiryPolicy;
use App\Policies\ResourcePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Property::class => PropertyPolicy::class,
        BlogPost::class => BlogPostPolicy::class,
        Inquiry::class => InquiryPolicy::class,
        Resource::class => ResourcePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
         ResetPassword::toMailUsing(function ($notifiable, $token) {
        $url = config('app.frontend_url') . "/reset-password?token={$token}&email={$notifiable->getEmailForPasswordReset()}";

        return (new MailMessage)
            ->subject('Reset Your ArchSmart GH Password')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $url)
            ->line('If you did not request a password reset, no further action is required.');
    });
    }
}