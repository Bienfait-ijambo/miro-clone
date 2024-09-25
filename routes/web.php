<?php

use App\Http\Controllers\AuthController;
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



