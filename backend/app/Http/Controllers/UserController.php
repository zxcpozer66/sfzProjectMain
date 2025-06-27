<?php

namespace App\Http\Controllers;

use Faker\Core\Number;
use Illuminate\Support\Facades\DB;
use App\Models\Vacation;
use App\Models\Application;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all();

        return response()->json($user);
    }

    public function usersRole($id, Request $request)
    {
        if (!is_numeric($id) || $id <= 0) {
            return response()->json(['error' => 'Неверная роль'], 400);
        }

        $include = filter_var($request->query('include'), FILTER_VALIDATE_BOOLEAN);

        if ($include) {
            $users = User::where('role_id', $id)->get();
        } else {
            $users = User::where('role_id', '!=', $id)->get();
        }

        return response()->json($users);
    }

    public function getUsers()
    {
        $users = User::with(['department'])->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'surname' => $user->surname,
                'patronymic' => $user->patronymic,
                'department' => $user->department->title ?? null,
            ];
        });

        return response()->json($users);
    }

    public function getRole()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'username'      => 'string',
            'name'          => 'string',
            'surname'       => 'string',
            'patronymic'    => 'string',
            'role_id'       => 'integer',
            'department_id' => 'integer',
        ]);

        $data['role_id'] = null;
        $user            = User::create($data);

        return response()->json([
            'message' => 'Пользователь успешно создан',
            'user'    => $user,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'username' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'surname' => 'nullable|string|max:255',
            'patronymic' => 'nullable|string|max:255',
            'department_id' => 'nullable|integer|exists:departments,id',
            'role_id' =>  'nullable|integer|exists:roles,id'
        ]);

        $user->update($data);
        return response()->json($user);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function getVacationInterval()
    {
        $user = auth()->user();
        $approvedStatusId = 2;

        $workHoursSubquery = Application::query()
            ->whereNotNull('start_time')
            ->whereNotNull('end_time')
            ->whereNull('deleted_at')
            ->select(
                'master_id as user_id',
                DB::raw('SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)) / 60 as total_work_hours')
            )
            ->groupBy('master_id');

        $vacationHoursSubquery = Vacation::query()
            ->where('vacation_status_id', $approvedStatusId)
            ->whereNull('deleted_at')
            ->select([
                'user_id',
                DB::raw('SUM(
                (GREATEST(DATEDIFF(end_date, start_date), 0) - DATEDIFF(end_date, start_date)
            ) ) - COALESCE(SUM(hours), 0) as total_vacation_hours')
            ])
            ->groupBy('user_id');

        $query = User::query()
            ->select([
                'users.id',
                'users.username',
                'users.name',
                'users.surname',
                'users.patronymic',
                'users.department_id',
                'users.role_id',
                DB::raw('COALESCE(work.total_work_hours, 0) as total_work_hours'),
                DB::raw('COALESCE(vacation.total_vacation_hours, 0) as total_vacation_hours'),
                DB::raw('COALESCE(work.total_work_hours, 0) + COALESCE(vacation.total_vacation_hours, 0) as available_hours')
            ])
            ->leftJoinSub($workHoursSubquery, 'work', function ($join) {
                $join->on('users.id', '=', 'work.user_id');
            })
            ->leftJoinSub($vacationHoursSubquery, 'vacation', function ($join) {
                $join->on('users.id', '=', 'vacation.user_id');
            })
            ->with('department', 'role')
            ->orderBy('users.id', 'desc');

        if ($user->role_id != 1 && $user->department_id) {
            $query->where('department_id', $user->department_id);
        }

        $users = $query->get();

        return response()->json($users);
    }

    public function registration(Request $request)
    {
        $currentUser = Auth::user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'patronymic' => 'required|string|max:255',
            'department_id' => 'required|integer|exists:departments,id'
        ]);

        $existingUser = User::where('name', $data['name'])
            ->where('surname', $data['surname'])
            ->where('patronymic', $data['patronymic'])
            ->where('department_id', $data['department_id'])
            ->where('id', '!=', $currentUser->id)
            ->first();

        if ($existingUser) {
            $existingUser->username = $currentUser->username;
            $existingUser->role_id = $currentUser->role_id;
            $existingUser->save();

            Auth::logout();

            $currentUser->delete();

            Auth::login($existingUser);

            return response()->json($existingUser);
        } else {
            $currentUser->update($data);

            return response()->json($currentUser);
        }
    }

    public function getAvailableHours()
    {
        $user = auth()->user();

        $rejectedStatusId = 3;

        $totalWorkHours = Application::query()
            ->where('master_id', $user->id)
            ->whereNotNull('start_time')
            ->whereNotNull('end_time')
            ->whereNull('deleted_at')
            ->sum(DB::raw('TIMESTAMPDIFF(MINUTE, start_time, end_time)')) ?? 0;

        // Считаем общее количество минут отпусков (480 минут = рабочий день)
        $totalVacationHours = Vacation::query()
            ->where('user_id', $user->id)
            ->where('vacation_status_id', '!=', $rejectedStatusId)
            ->whereNull('deleted_at')
            ->selectRaw('SUM((GREATEST(DATEDIFF(end_date, start_date), 0) -  DATEDIFF(end_date, start_date) + COALESCE(hours, 0)) * 60) as total_vacation_hours')
            ->value('total_vacation_hours') ?? 0;




        $availableHours = $totalWorkHours - $totalVacationHours;

        return response()->json([
            'total_work_hours' => $totalWorkHours,
            'total_vacation_hours' => $totalVacationHours,
            'available_hours' => round($availableHours / 60, 2)
        ]);
    }
}
