


import { ref } from "vue"
import { makeHttpReq2 } from "../../../../../helper/makeHttpReq"
import { IReplayDrawing } from "../../../../../store/yDoc"
import { IMiniTextEditor } from "../editor/miniTextEditorTypes"
import { IStickyNote } from "../stickynote/stickyNoteTypes"
import { ITextCaption } from "../text-caption/textCaptionTypes"
import { showError, successMsg } from "../../../../../helper/toastnotification"


export function useSaveBoardData( arrayDrawing: IReplayDrawing[][],miniTextEditor: IMiniTextEditor[],
    stickyNote:IStickyNote[] ,textCaption:ITextCaption[]  
) {
    const loading = ref(false)
  
    async function saveBoardData() {
      try {
        loading.value = true
      
        //save drawingData
        await makeHttpReq2<{drawingData:IReplayDrawing[][]}, ResponseType>('drawings', 'POST', {drawingData:arrayDrawing})

        //save MiniTextEditor
        // makeHttpReq2<{miniTextEditorData:IMiniTextEditor[]}, ResponseType>('mini_text_editors', 'POST', {miniTextEditorData:miniTextEditor})

        //save stickyNote
        // await makeHttpReq2<{stickyNoteData:IStickyNote[]}, ResponseType>('sticky_notes', 'POST', {stickyNoteData:stickyNote})

        //save TextCaption
        // makeHttpReq2<{textCaptionData:ITextCaption[]}, ResponseType>('text_captions', 'POST', {textCaptionData:textCaption})


  
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

 
