<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Project;
use DB;
use Illuminate\Support\Str;
use Validator;
class ProjectController extends Controller
{
    public function createProject(Request $request){

        $fields=$request->all();

        $errors = Validator::make($fields, [
            'name' => 'required',
            'userId' => 'required',
        ]);

        if ($errors->fails()) {
            return response([
                'errors' => $errors->errors()->all(),
                'message' => 'invalid input',
            ], 422);
        }


        $projectCode=Str::random(128).'-'.time();
        $projectLink=url('/');

        Project::create([
            'name' => $fields['name'],
            'projectCode' => $projectCode,
            'userId' => $fields['userId'],
            'projectLink' => $projectLink,

        ]);

        return response(['message' => 'Project created successfully',200]);

   

    }
}
