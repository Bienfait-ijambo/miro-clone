<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// route parameter


Route::get('/', function() {
    return view('welcome');
});

Route::get('/app/{any}', function() {
    return view('welcome');
});


Route::get('/auth/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/callback', [AuthController::class, 'createUserViaGoogle']);


Route::get('/callback', function (Request $request) {
    $state = $request->session()->pull('state');

    $codeVerifier = $request->session()->pull('code_verifier');

    throw_unless(
        strlen($state) > 0 && $state === $request->state,
        InvalidArgumentException::class
    );

    //redirect to the client to request for code
    return redirect('http://127.0.0.1:8000/app/token?code_verifier='.$codeVerifier);
});


Route::get('/login', function() {
    return redirect('/auth/redirect');
})->name('login');