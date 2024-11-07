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

    public function getProjects(Request $request)
    {

        $data = Project::where('userId',$request->userId)->paginate(2);

        return response( $data, 200);
    }

    public function getProjectDetail(Request $request)
    {
        $projectCode=$request->project_code;
        $data = Project::where('projectCode', $projectCode)->first();

        if(!is_null($data)){
            return response( $data, 200);
        }else{
            return response( [], 200);
        }
       
    }



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


        
        $projectCode=Str::random(10).'-'.time();
        $projectLink=url('/');

        Project::create([
            'name' => $fields['name'],
            'projectCode' => $projectCode,
            'userId' => $fields['userId'],
            'projectLink' => $projectLink,

        ]);

        return response(['message' => 'Project created successfully',200]);

    }


    public function updateProject(Request $request){

        $fields=$request->all();

        $errors = Validator::make($fields, [
            'id' => 'required',
            'name' => 'required',
            'userId' => 'required',
        ]);

        if ($errors->fails()) {
            return response([
                'errors' => $errors->errors()->all(),
                'message' => 'invalid input',
            ], 422);
        }



        Project::where('id',$fields['id' ])->update([
            'name' => $fields['name'],
        ]);

        return response(['message' => 'Project updated successfully',200]);

    }
}
