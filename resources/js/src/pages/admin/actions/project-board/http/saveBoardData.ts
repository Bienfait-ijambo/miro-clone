


import { ref } from "vue"
import { makeHttpReq2 } from "../../../../../helper/makeHttpReq"
import { IReplayDrawing } from "../../../../../store/yDoc"
import { IMiniTextEditor } from "../editor/miniTextEditorTypes"
import { IStickyNote } from "../stickynote/stickyNoteTypes"
import { ITextCaption } from "../text-caption/textCaptionTypes"
import { showError, successMsg } from "../../../../../helper/toastnotification"


export function useSaveBoardData( arrayDrawing: IReplayDrawing[][],miniTextEditor: IMiniTextEditor[],
    stickyNote:IStickyNote[] ,textCaption:ITextCaption[]  ,
    projectId:number
) {
    const loading = ref(false)
  
    async function saveBoardData() {
      try {
        loading.value = true
      
        //save drawingData
         makeHttpReq2<{drawingData:IReplayDrawing[][],projectId:number}, ResponseType>('drawings', 'POST', {drawingData:arrayDrawing,projectId:projectId})

        // //save MiniTextEditor
        makeHttpReq2<{miniTextEditorData:IMiniTextEditor[],projectId:number}, ResponseType>('mini_text_editors', 'POST', {miniTextEditorData:miniTextEditor,projectId:projectId})

        //save stickyNote
         makeHttpReq2<{stickyNoteData:IStickyNote[],projectId:number}, ResponseType>('sticky_notes', 'POST', {stickyNoteData:stickyNote,projectId:projectId})

        //save TextCaption
        makeHttpReq2<{textCaptionData:ITextCaption[],projectId:number}, ResponseType>('text_captions', 'POST', {textCaptionData:textCaption,projectId:projectId})


  
        successMsg('Board data saved successfully !')
  
        loading.value = false
      } catch (error) {
      console.log(error)
        loading.value = false
        showError((error as Error).message)
      }
    }
  
    return {saveBoardData , loading }
  }

 
