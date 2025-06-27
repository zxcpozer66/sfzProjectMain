<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $departments = Department::with([
            'chief' => function ($query) {
                $query->whereHas('role', function ($q) {
                    $q->where('title', 'chief');
                })
                    ->select('id', 'name', 'surname', 'patronymic', 'department_id');
            },
            'parentDepartment' => function ($query) {
                $query->select('id', 'title');
            }
        ])
            ->get(['id', 'title', 'parent_id']);

        $formattedDepartments = $departments->map(function ($department) {
            return [
                'id' => $department->id,
                'title' => $department->title,
                'is_active' => $department->isActive,
                'parent_department' => $department->parentDepartment ? [
                    'id' => $department->parentDepartment->id,
                    'title' => $department->parentDepartment->title
                ] : null,
                'chief' => $department->chief ? [
                    'name' => $department->chief->name,
                    'surname' => $department->chief->surname,
                    'patronymic' => $department->chief->patronymic,
                    'user_id' => $department->chief->id
                ] : null
            ];
        });

        return response()->json($formattedDepartments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title'     => 'required|string|max:255',
            'parent_id' => 'nullable|exists:departments,id',
            'cheif_id'  => 'nullable|exists:users,id'
        ]);

        return DB::transaction(function () use ($validatedData) {
            $department = Department::create([
                'title' => $validatedData['title'],
                'parent_id' => $validatedData['parent_id'] ?? null,
                'is_active' => true
            ]);

            if (isset($validatedData['cheif_id'])) {
                $userId = $validatedData['cheif_id'];
                $user = User::find($userId);
                if ($user) {
                    $user->role_id = 2;
                    $user->department_id = $department->id;
                    $user->save();
                }
            }

            return response()->json([
                'message' => 'Департамент успешно создан',
                'data' => $department->load('users')
            ], 201);
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $data = $request->validate([
            'title'      => 'nullable|string|max:255',
            'parent_id'  => 'nullable|exists:departments,id',
            'chief_id'   => 'nullable|exists:users,id',
        ]);
        $department->update($data);

        User::where('id',  $data['chief_id'])->update(['role_id' => 2, 'department_id' =>  $department->id]);

        return response()->json($department);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        $department = Department::findOrFail($id);

        Department::where('parent_id', $department->id)
            ->update(['parent_id' => $department->parent_id]);

        User::where('department_id', $department->id)->where('role_id', 2)->update(['department_id' => null, 'role_id' => null]);
        User::where('department_id', $department->parent_id)->update(['department_id' => $department->parent_id]);

        $department->delete();

        return response()->json(null, 204);
    }
}
