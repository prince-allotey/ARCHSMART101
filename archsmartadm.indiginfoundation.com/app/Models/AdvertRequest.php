<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'business_category',
        'contact_name',
        'contact_email',
        'contact_phone',
        'advert_details',
        'target_audience',
        'duration_months',
        'budget',
        'website_url',
        'logo_path',
        'status', // pending, approved, rejected, paid
        'payment_method',
        'payment_reference',
    ];
}
