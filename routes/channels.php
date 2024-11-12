<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});



 //Checks if the authenticated user's ID matches the ID in the private channel
Broadcast::channel('typing.{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('project.room.{projectCode}', function ($user, $projectCode){
    return $user;
});