<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;


class AuthController extends Controller
{
    

 public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    
    public function createUserViaGoogle(Request $request)
    {

        $googleUser = Socialite::driver('google')->user();
        $user = User::createUser($googleUser);
    }



}
