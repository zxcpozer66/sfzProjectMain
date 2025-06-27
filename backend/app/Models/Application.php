<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Department;
use App\Models\User;
use App\Models\ReactionType;
use App\Models\Notation;

class Application extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'department_id',
        'user_id',
        'master_id',
        'appeal_title',
        'type_reaction_id',
        'description_problem',
        'start_time',
        'end_time',
        'notation_id',
        'answer',
        'order_application',
        'description_task',
    ];


    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function master()
    {
        return $this->belongsTo(User::class, 'master_id');
    }

    public function reactionType()
    {
        return $this->belongsTo(ReactionType::class, 'type_reaction_id');
    }

    public function notation()
    {
        return $this->belongsTo(Notation::class);
    }
}
