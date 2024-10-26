<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;





Route::post('/user_data', [AuthController::class, 'getUserData']);


Route::group(['middleware' => ['auth:api']], function () {

    Route::post('/logout', [AuthController::class, 'logout']);

});


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
