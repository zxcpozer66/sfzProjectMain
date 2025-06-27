<?php

namespace App\Http\Controllers;

use App\Models\Vacation;
use App\Models\VacationStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VacationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $statusFilter = $request->query('status', 'all');

        $query = Vacation::with([
            'user:id,name,surname,patronymic',
            'status:id,title',
            'approvedByUser:id,name,surname,patronymic'
        ])
            ->orderBy('created_at', 'desc');

            match ($user->role->title) {
                'ceo'    => null, 
                'chief'  => $query->whereHas('user', function($q) use ($user) {
                $q->where('department_id', $user->department_id);
            }),
        };

        $today = Carbon::today()->toDateString();

        switch ($statusFilter) {
            case 'pending':
                $query->where('vacation_status_id', 1);
                break;

            case 'active':
                $query->where('vacation_status_id', 2)
                    ->where('end_date', '>=', $today);
                break;

            case 'other':
                $query->where(function ($q) use ($today) {
                    $q->where('vacation_status_id', '!=', 1)
                        ->where(function ($q2) use ($today) {
                            $q2->where('vacation_status_id', '!=', 2)
                                ->orWhere(function ($q3) use ($today) {
                                    $q3->where('vacation_status_id', 2)
                                        ->where('end_date', '<', $today);
                                });
                        });
                });
                break;
        }

        return $query->paginate(10);
    }
 public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'start_date' => 'required|date|after_or_equal:' . now()->toDateString(),
            'end_date' => 'required|date|after_or_equal:start_date',
            'hours' => 'nullable|integer'
        ]);

        $data['user_id'] = $user->id;
        $data['vacation_status_id'] = 1;
        $vacation = Vacation::create($data);
        $newVacation= Vacation::with(['user:id,name,surname,patronymic',
            'status:id,title',
            'approvedByUser:id,name,surname,patronymic'])->get()->where('id', $vacation->id);
        return response()->json($newVacation, 201);
    }

    public function update(Request $request, $id)
    {
        $vacation = Vacation::findOrFail($id);

        $validator = Validator::make($request->all(), [

            'vacation_status_id' => 'sometimes|exists:vacation_statuses,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if ($request->has('vacation_status_id') && $vacation->vacation_status_id != $request->vacation_status_id) {
            $vacation->approved_by = Auth::id();
        }

        $vacation->fill($request->only(['start_date', 'end_date', 'vacation_status_id']))->save();

        return response()->json($vacation);
    }


    public function statuses()
    {
        return response()->json(VacationStatus::select('id', 'title')->get());
    }

    public function myVacation(){
        $user=Auth::user();
        $user_id = $user->id;
        $vacation = Vacation::with("status")->where('user_id', $user_id)->get();

        return response()->json($vacation);
    }

    public function destroy($id)
    {
        Vacation::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
   
}

   