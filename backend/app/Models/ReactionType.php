<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReactionType extends Model
{
    use HasFactory;

    protected $table = 'reactions_type'; 

    public function applications()
    {
        return $this->hasMany(Application::class, 'type_reaction_id');
    }
}