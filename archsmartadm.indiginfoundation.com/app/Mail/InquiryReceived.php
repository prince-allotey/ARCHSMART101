<?php

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryReceived extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
   public Inquiry $inquiry;

    /**
     * Create a new message instance.
     */
    public function __construct(Inquiry $inquiry)
    {
        $this->inquiry = $inquiry;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Inquiry Received - ' . $this->inquiry->subject,
        );
    }
     public function build()
    {
        return $this->subject('New Inquiry Received')
                    ->view('emails.inquiry-received')
                    ->with([
                        'name' => $this->inquiry->name,
                        'email' => $this->inquiry->email,
                        'phone' => $this->inquiry->phone,
                        'subjectLine' => $this->inquiry->subject,
                        'messageBody' => $this->inquiry->message,
                        'type' => ucfirst(str_replace('-', ' ', $this->inquiry->type)),
                    ]);
    }
    

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inquiry-received',
            with: [
                'inquiry' => $this->inquiry,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}