import { makeHttpReq2 } from "../../../../../helper/makeHttpReq";
import { ref } from "vue";
import { showError } from "../../../../../helper/toastnotification";
import { IReplayDrawing, yDocStore } from "../../../../../store/yDoc";
import { IStickyNote } from "../stickynote/stickyNoteTypes";
import { ITextCaption } from "../text-caption/textCaptionTypes";

type DrawingType = {
    drawingData: string;
} | null;
type MiniTextEditorType = {
    miniTextEditorData: string;
} | null;
type StickyNoteType = {
    stickyNoteData: string;
} | null;
type TextCaptionType = {
    textCaptionData: string;
} | null;
export interface IProjectBoardData {
    miniTextEditor: MiniTextEditorType;
    stickyNote: StickyNoteType;
    textCaption: TextCaptionType;
    drawing: DrawingType;
}

export function useGetProjectBoardData(
    initCanvas: () => Promise<{
        drawOnCanvas: () => void;
        undo: () => void;
        redo: () => void;
        replayDrawing: () => void;
        initCanvas: () => void;
    }>,
    dragStickyNote: (id: number) => void,
    changeStickyNoteBodyContent: (id: number) => void,
    dragTextCaption: (id: number) => void,
    changeTextCaptionBodyContent: (id: number) => void
) {
    const loading = ref(false);

    async function getProjectBoardData(projectId: number) {
        try {
            loading.value = true;
            const data = await makeHttpReq2<undefined, IProjectBoardData>(
                `project_boards?projectId=${projectId}`,
                "GET"
            );

            getDrawingData(data);
            getStickyNoteData(data);
            // getTextCaptionData(data);

            loading.value = false;
        } catch (error) {
            showError((error as Error).message);
            loading.value = false;
        }
    }

    async function getDrawingData(data: IProjectBoardData) {
        if (data.drawing !== null) {
            const drawingCoordinates: IReplayDrawing[][] = JSON.parse(
                data.drawing.drawingData
            );

            const drawingArray = yDocStore.yArrayDrawing.toArray();
            yDocStore.yArrayDrawing.delete(0, drawingArray.length);

            yDocStore.yArrayDrawing.insert(0, drawingCoordinates);

            const canvas = await initCanvas();
            canvas.replayDrawing();
        }
    }

    function getStickyNoteData(data: IProjectBoardData) {
       setTimeout(() => {
        const stickyNoteArray = yDocStore.yArrayStickyNote.toArray();
        yDocStore.yArrayStickyNote.delete(0, stickyNoteArray.length);
        yDocStore.stickyNote =[]
        console.log('delete data',stickyNoteArray)
       }, 1000);

        if (data.stickyNote !== null) {
            const stickyNoteData: IStickyNote[] = JSON.parse(
                data.stickyNote.stickyNoteData
            );
            
           
    
          

            setTimeout(() => {
                yDocStore.stickyNote = [...stickyNoteData];
      yDocStore.yArrayStickyNote.insert(0, [...stickyNoteData]);

       stickyNoteData.forEach((stickyNote) => {
          dragStickyNote(stickyNote.id);
          changeStickyNoteBodyContent(stickyNote.id);
      });
      
      }, 1000);


           
        }
    }

    function getTextCaptionData(data: IProjectBoardData) {
        if (data.textCaption !== null) {
            const textCaptionData: IStickyNote[] = JSON.parse(
                data.textCaption.textCaptionData
            );

            // yDocStore.textCaption = [...textCaptionData];

            // setTimeout(() => {
            //     yDocStore.yArrayTextCaption.insert(0, [...textCaptionData]);

            //     textCaptionData.forEach((textCaption) => {
            //         dragTextCaption(textCaption.id);
            //         changeTextCaptionBodyContent(textCaption.id);
            //     });
            // }, 1000);
        }
    }

    return { getProjectBoardData, loading };
}
