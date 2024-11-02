<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use DB;
use Illuminate\Support\Str;
use Validator;
use App\Models\MiniTextEditor;
use App\Models\StickyNote;
use App\Models\TextCaption;
use App\Models\Drawing;



class ProjectBoardController extends Controller
{
    

    public function createOrUpdateStickyNote(Request $request)
    {

        $projectId=$request->projectId;
        $miniTextEditor = StickyNote::where('projectId', $projectId)
        ->first();


        if(is_null($miniTextEditor)){

            //insert a new row
            StickyNote::create([
                'projectId' => $projectId,
                'stickyNoteData' => $request->stickyNoteData,
            ]);
        }else{

            StickyNote::where('projectId', $projectId)
            ->update([
                'projectId' => $projectId,
                'stickyNoteData' => $request->stickyNoteData,
            ]);

        }
    

    }

    public function createOrUpdateMiniTextEditor(Request $request)
    {

        $projectId=$request->projectId;
        $miniTextEditor = MiniTextEditor::where('projectId', $projectId)
        ->first();


        if(is_null($miniTextEditor)){

            //insert a new row
            MiniTextEditor::create([
                'projectId' => $projectId,
                'miniTextEditorData' => $request->miniTextEditorData,
            ]);
        }else{

            MiniTextEditor::where('projectId', $projectId)
            ->update([
                'projectId' => $projectId,
                'miniTextEditorData' => $request->miniTextEditorData,
            ]);

        }
    

    }



    public function createOrUpdateTextCaption(Request $request)
    {

        $projectId=$request->projectId;
        $TextCaption = TextCaption::where('projectId', $projectId)
        ->first();


        if(is_null($TextCaption)){

            //insert a new row
            TextCaption::create([
                'projectId' => $projectId,
                'textCaptionData' => $request->textCaptionData,
            ]);
        }else{

            TextCaption::where('projectId', $projectId)
            ->update([
                'projectId' => $projectId,
                'textCaptionData' => $request->textCaptionData,
            ]);

        }
    

    }


     public function createOrUpdateDrawing(Request $request)
    {

        $json=json_encode($request->drawingData);

        $projectId=1;
        $drawing = Drawing::where('projectId', $projectId)
        ->first();


        if(is_null($drawing)){

            //insert a new row
            Drawing::create([
                'projectId' => $projectId,
                'drawingData' => $json
            ]);
            return response(['success' => true]);
        }else{

            Drawing::where('projectId', $projectId)
            ->update([
                'projectId' => $projectId,
               'drawingData' => $json
            ]);
            return response(['success' => true]);


        }
    

    }

}
