<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

// route parameter


Route::get('/', function() {
    return view('welcome');
});

Route::get('/app/{any}', function() {
    return view('welcome');
});
// baseUrl/app/register

// baseUrl/

Route::get('/auth/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/callback', [AuthController::class, 'createUserViaGoogle']);




