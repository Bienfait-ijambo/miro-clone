<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;




// Route::controller(AuthController::class)->group(function(){
//     Route::post('/register','register');
//     Route::post('/login','login');
// });


// Route::group(['middleware'=>['auth:sanctum']],function(){

// });





Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
