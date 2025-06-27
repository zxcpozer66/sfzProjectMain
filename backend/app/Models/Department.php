<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory;
    use SoftDeletes;

      protected $fillable = [
        'title',
        'parent_id',
        'is_active'
    ];

     public function chief()
    {
        return $this->hasOne(User::class, 'department_id')
            ->whereHas('role', function($query) {
                $query->where('title', 'chief');
            });
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function parentDepartment()
    {
        return $this->belongsTo(Department::class, 'parent_id')->select('id', 'title');
    }
    
    //  public function vacation()
    // {
    //     return $this->hasMany(User::class);
    // }
}