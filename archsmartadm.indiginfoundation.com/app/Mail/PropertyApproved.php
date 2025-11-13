<?php

namespace App\Mail;

use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class PropertyApproved extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Property $property;

    public function __construct(Property $property)
    {
        $this->property = $property;
    }

    public function build()
    {
        return $this->subject('Your property has been approved')
            ->view('emails.property_approved')
            ->with([
                'property' => $this->property,
            ]);
    }
}
