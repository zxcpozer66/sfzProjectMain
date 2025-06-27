<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WindowsAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // $remoteUser = $_SERVER['REMOTE_USER'] ?? null;
        $remoteUser = $_SERVER['REMOTE_USER'] ?? 'DOMAIN\\admin';
        
        if ($remoteUser) {
            $username = substr(strrchr($remoteUser, "\\"), 1);
            $user = User::firstOrCreate(['username' => $username], ['role_id' => 3]);

            Auth::login($user);
        }

        return $next($request);
    }
}
