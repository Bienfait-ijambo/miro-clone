<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Project\ProjectController;

Route::post('/user_data', [AuthController::class, 'getUserData']);


// Route::group(['middleware' => ['auth:api']], function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/projects', [ProjectController::class, 'createProject']);
    Route::put('/projects', [ProjectController::class, 'updateProject']);
    Route::get('/projects', [ProjectController::class, 'getProjects']);


// });


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
