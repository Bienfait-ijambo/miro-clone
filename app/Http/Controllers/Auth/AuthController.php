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
    


   
    public function getUserData(Request $request)
       {
   
           $loginUser = DB::table('oauth_access_tokens')
               ->where('client_id', $request->client_id)
               ->first();
   
           if (! is_null($loginUser)) {
   
               $userId = $loginUser->user_id;
   
               $user = User::where('id', $userId)
                   ->select('id', 'name', 'email')
                   ->first();
   
               return response(['user' => $user]);
   
               
   
           }
   
       }
   

 public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    
    public function createUserViaGoogle(Request $request)
    {

        $googleUser = Socialite::driver('google')->user();
        $user = User::createUser($googleUser);


        Auth::login( $user);

        $request->session()->put('state', $state = Str::random(40));

        $request->session()->put(
            'code_verifier', $code_verifier = Str::random(128)
        );

        $codeChallenge = strtr(rtrim(
            base64_encode(hash('sha256', $code_verifier, true)), '='), '+/', '-_');

        $query = http_build_query([
            'client_id' => '9d53c7f5-6abe-4f17-8f76-96b31815d822',
            'redirect_uri' => 'http://127.0.0.1:8000/app/callback',
            'response_type' => 'code',
            'scope' => '',
            'state' => $state,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256',
            'prompt' => 'login', // "none", "consent", or "login"
        ]);

        return redirect('/oauth/authorize?'.$query);

    }


    public function logout(Request $request)
    {
     
        DB::table('oauth_access_tokens')
            ->where('user_id', $request->userId)
            ->delete();

        return response(['message' => 'user logged out']);
    }



}
