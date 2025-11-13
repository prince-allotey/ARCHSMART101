<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['post_id','user_id','name','email','body'];
    public function post(){ return $this->belongsTo(BlogPost::class, 'post_id'); }
}
