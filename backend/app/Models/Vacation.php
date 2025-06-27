<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Vacation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'vacation_status_id',
        'start_date',
        'end_date',
        'approved_by',
        'hours'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(VacationStatus::class, 'vacation_status_id');
    }

    public function getDaysUsedAttribute()
    {
        $start = Carbon::parse($this->start_date);
        $end = Carbon::parse($this->end_date);

        return $start->diffInWeekdays($end) + 1;
    }

    public function approvedByUser()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // public function department()
    // {
    //     return $this->hasMany(Department::class)->select('id', 'title');
    // }
}
