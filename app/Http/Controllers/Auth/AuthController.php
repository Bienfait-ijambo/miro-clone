<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
class g{
    public $id;
    public $name;
    public $email;
    public function __construct($id,$name,$email){
        $this->name = $name;
        $this->email = $email;
        $this->id = $id;
    }
}

class AuthController extends Controller
{
    


    
    public function getUserData(Request $request)
       {
   
           $loginUser = DB::table('oauth_access_tokens')
               ->where('client_id', $request->client_id)
               ->where('user_id', $request->user_id)
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

    // $googleUser=new g('110271711780782516836','ijambo izuba','ijamboizuba20@gmail.com');
    // $googleUser=new g('109134498984023056893','bienfait Ijambo','bienfait201@gmail.com ');

    
        $user = User::createUser($googleUser);


        Auth::login( $user);

        $request->session()->put('state', $state = Str::random(40));

        $request->session()->put(
            'code_verifier', $code_verifier = Str::random(128)
        );

        $codeChallenge = strtr(rtrim(
            base64_encode(hash('sha256', $code_verifier, true)), '='), '+/', '-_');

        $query = http_build_query([
            'client_id' => '9d69c34f-da8d-4930-a760-cb24235ee151',
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
