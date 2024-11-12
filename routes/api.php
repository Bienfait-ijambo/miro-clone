<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Project\ProjectBoardController;
use App\Http\Controllers\Project\ProjectController;


Route::post('/user_data', [AuthController::class, 'getUserData']);


Route::group(['middleware' => ['auth:api']], function () {

    Route::post('/logout', [AuthController::class, 'logout']);


    Route::controller(ProjectController::class)->group(function () {

        Route::post('/projects', 'createProject');
       Route::put('/projects', 'updateProject');
       Route::get('/projects', 'getProjects');
       Route::get('/projects/detail', 'getProjectDetail');
   
      
    });


    Route::controller(ProjectBoardController::class)->group(function () {

        Route::post('/mini_text_editors', 'createOrUpdateMiniTextEditor');
        Route::post('/sticky_notes',  'createOrUpdateStickyNote');
        Route::post('/drawings',  'createOrUpdateDrawing');
        Route::post('/text_captions',  'createOrUpdateTextCaption');
        Route::get('/project_boards',  'getProjectBoardData');
        Route::post('/joinees',  'addJoinees');
      
    });

    



});


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
