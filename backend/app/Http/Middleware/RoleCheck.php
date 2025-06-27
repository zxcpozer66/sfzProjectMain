<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleCheck
{

    public function handle(Request $request, Closure $next, $roleId)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->role_id != $roleId) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        return $next($request);
    }
}
