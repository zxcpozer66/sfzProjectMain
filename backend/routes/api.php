<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ReactionTypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotationController;
use App\Http\Controllers\VacationController;
use Illuminate\Http\Request;

Route::middleware(['windows.auth'])->group(function () {

  Route::get('/users/current-user', function (Request $request) {
    return $request->user()->load([
        'role:id,title',
        'department'
    ]);
});

  Route::patch('/users/registration', [UserController::class, 'registration']);

  Route::get('/departments', [DepartmentController::class, 'index']);

  Route::middleware('check.registration')->group(function () {
      Route::get('/users/get-users', [UserController::class, 'getUsers']);

      Route::post('/users', [UserController::class, 'store']);
      Route::patch('/users/{id}', [UserController::class, 'update']);
      Route::delete('/users/{id}', [UserController::class, 'destroy']);
      Route::get('/users/get-available-hours', [UserController::class, 'getAvailableHours']);

    Route::get('/users', action: [UserController::class, 'index']);
    Route::get('/users/role/{id}', [UserController::class, 'usersRole']);
    Route::get('/users/vacation-interval', [UserController::class, 'getVacationInterval']);

    Route::get('/users/role', action: [UserController::class, 'getRole']);


    Route::get('/applications', [ApplicationController::class, 'index']);

    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::patch('/applications/{id}', [ApplicationController::class, 'update']);
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);

    Route::get('/reactions', [ReactionTypeController::class, 'index']);

    Route::get('/notations', [NotationController::class, 'index']);

    Route::get('/vacations', [VacationController::class, 'index']);
    Route::post('/vacations', [VacationController::class, 'store']);
    Route::patch('/vacations/{id}', [VacationController::class, 'update']);
    Route::get('/vacations/my-vacation', [VacationController::class, 'myVacation']);
    Route::delete('/vacations/{id}', [VacationController::class, 'destroy']);

    
  Route::post('/departments', [DepartmentController::class, 'store']);
  Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
  Route::patch('/departments/{id}', [DepartmentController::class, 'update']);

    Route::get('/vacations/vacation-statuses', [VacationController::class, 'statuses']);
  });
});
