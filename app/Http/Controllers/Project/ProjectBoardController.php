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


    public function getProjectBoardData(Request $request)
    {
        return DB::transaction(function() use($request){

            $projectId=$request->projectId;

            $miniTextEditor = MiniTextEditor::where('projectId', $projectId)
            ->first();
            $stickyNote = StickyNote::where('projectId', $projectId)
            ->first();
            $textCaption = TextCaption::where('projectId', $projectId)
            ->first();
            $drawing = Drawing::where('projectId', $projectId)
             ->first();


             return response([
                'miniTextEditor'=>$miniTextEditor,
                'stickyNote'    =>$stickyNote,
                'textCaption'   =>$textCaption,
                'drawing'       =>$drawing,
             ],200);
        });
    }
    

    public function createOrUpdateStickyNote(Request $request)
    {

        $projectId=$request->projectId;
        $stickyNote = StickyNote::where('projectId', $projectId)
        ->first();
        $json=json_encode( $request->stickyNoteData);


        if(is_null($stickyNote)){

            //insert a new row
            StickyNote::create([
                'projectId' => $projectId,
                'stickyNoteData' => $json
            ]);
            return response(['success' => true],200);
        }else{

            StickyNote::where('projectId', $projectId)
            ->update([
                'stickyNoteData' => $json
            ]);
            return response(['success' => true],200);


        }
    

    }

    public function createOrUpdateMiniTextEditor(Request $request)
    {

        $projectId=$request->projectId;
        $miniTextEditor = MiniTextEditor::where('projectId', $projectId)
        ->first();

        $json=json_encode( $request->miniTextEditorData);



        if(is_null($miniTextEditor)){

            //insert a new row
            MiniTextEditor::create([
                'projectId' => $projectId,
                'miniTextEditorData' => $json
            ]);
            return response(['success' => true],200);

        }else{

            MiniTextEditor::where('projectId', $projectId)
            ->update([
                'miniTextEditorData' => $json
            ]);
            return response(['success' => true],200);


        }
    

    }



    public function createOrUpdateTextCaption(Request $request)
    {

        $projectId=$request->projectId;
        $TextCaption = TextCaption::where('projectId', $projectId)
        ->first();

        $json=json_encode( $request->textCaptionData);

        if(is_null($TextCaption)){

            //insert a new row
            TextCaption::create([
                'projectId' => $projectId,
                'textCaptionData' => $json
            ]);
            return response(['success' => true],200);

        }else{

            TextCaption::where('projectId', $projectId)
            ->update([
                'textCaptionData' => $json
            ]);
            return response(['success' => true],200);


        }
    

    }


     public function createOrUpdateDrawing(Request $request)
    {

        $projectId=$request->projectId;
        $drawing = Drawing::where('projectId', $projectId)
        ->first();

        $json=json_encode( $request->drawingData);



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
                'drawingData' => $json
            ]);
            return response(['success' => true]);


        }
    

    }

}
