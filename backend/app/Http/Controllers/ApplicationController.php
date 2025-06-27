<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $query = Application::with([
            'notation',
            'master' => function ($query) {
                $query->withTrashed();
            },
            'user',
            'reactionType',
            'department'
        ]);

        match ($user->role->title) {
            'ceo'    => null,
            'master' => $query->where('master_id', $user->id),
            'chief'  => $query->whereHas('master', function ($q) use ($user) {
                $q->withTrashed()
                    ->where('department_id', $user->department_id);
            })
        };

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'department_id'       => 'nullable|exists:departments,id',
            'user_id'             => 'required|exists:users,id',
            'appeal_title'        => 'required|string|max:255',
            'type_reaction_id'    => 'nullable|exists:reactions_type,id',
            'description_problem' => 'required|string',
            'start_time'          => 'nullable|date',
            'end_time'            => 'nullable|date',
            'notation_id'         => 'nullable|exists:notations,id',
            'answer'              => 'nullable|string',
            'order_application'   => 'nullable|string',
            'data'                => 'nullable|string',
            'description_task'    => 'nullable|string',
            'master_id'           => 'nullable|exists:users,id',
        ]);

        $data['master_id'] = $user->id;

        $task = Application::create($data);

        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        $task = Application::findOrFail($id);

        $data = $request->validate([
            'department_id'       => 'exists:departments,id',
            'user_id'             => 'exists:users,id',
            'master_id'           => 'exists:users,id',
            'appeal_title'        => 'string|max:255',
            'type_reaction_id'    => 'nullable:reactions_type,id',
            'set_start_time' => 'sometimes|boolean',
            'set_end_time'   => 'sometimes|boolean',
            'notation_id'         => 'nullable|exists:notations,id',
            'answer'              => 'nullable|string',
            'order_application'   => 'nullable|string',
            'description_task'    => 'nullable|string',
            'description_problem'              => 'nullable|string',
        ]);

        if ($request->has('set_start_time') && $request->boolean('set_start_time')) {
            $data['start_time'] = now();
        }

        if ($request->has('set_end_time') && $request->boolean('set_end_time')) {
            $data['end_time'] = now();
        }

        $task->update($data);
        return response()->json($task);
    }

    public function destroy($id)
    {
        Application::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
