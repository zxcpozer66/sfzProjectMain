<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VacationStatus extends Model
{
    use HasFactory;

    protected $table = 'vacation_statuses';

    public function vacations()
    {
        return $this->hasMany(Vacation::class, 'vacation_status_id');
    }
}
