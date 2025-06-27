<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;


class User extends Authenticatable
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'username',
        'name',
        'surname',
        'patronymic',
        'role_id',
        'department_id',
    ];


    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'user_id');
    }

    public function masterApplications()
    {
        return $this->hasMany(Application::class, 'master_id');
    }

    public function vacations()
    {
        return $this->hasMany(Vacation::class);
    }

    public function approvedVacations()
    {
        return $this->hasMany(Vacation::class, 'approved_by');
    }


}
