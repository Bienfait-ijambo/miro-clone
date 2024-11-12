import { makeHttpReq2 } from "../../../../../helper/makeHttpReq";
import { ref } from "vue";
import { showError } from "../../../../../helper/toastnotification";
import { IReplayDrawing, yDocStore } from "../../../../../store/yDoc";
import { IStickyNote } from "../stickynote/stickyNoteTypes";
import { ITextCaption } from "../text-caption/textCaptionTypes";
import { IMiniTextEditor } from "../editor/miniTextEditorTypes";
import { getUserData } from "../../../../../helper/auth";

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
    changeTextCaptionBodyContent: (id: number) => void,
    dragMiniTextEditor: (id: number) => void,
    changeMiniTextEditorBodyContent: (id: number) => void,
) {
    const loading = ref(false);
    const userData=getUserData()
    async function getProjectBoardData(projectId: number) {
        try {
            loading.value = true;
            const data = await makeHttpReq2<undefined, IProjectBoardData>(
                `project_boards?projectId=${projectId}&userId=${userData?.user?.userId}`,
                "GET"
            );

        await resetYDocArray()
            getDrawingData(data);
            getStickyNoteData(data);
            getTextCaptionData(data);
            getMiniTextEditorData(data)

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
            yDocStore.arrayDrawing = [...drawingCoordinates];
            yDocStore.yArrayDrawing.insert(0, drawingCoordinates);

            const canvas = await initCanvas();
            canvas.replayDrawing();
        }
    }


    function getMiniTextEditorData(data: IProjectBoardData) {
        if (data.miniTextEditor !== null) {
            const miniTextEditorData: IMiniTextEditor[] = JSON.parse(
                data.miniTextEditor.miniTextEditorData
            );
            yDocStore.miniTextEditor = [...miniTextEditorData];
            setTimeout(() => {
                yDocStore.yArrayMiniTextEditor.insert(0, [...miniTextEditorData]);

                miniTextEditorData.forEach((miniTextEditor) => {
                    dragMiniTextEditor(miniTextEditor.id);
                    changeMiniTextEditorBodyContent(miniTextEditor.id);
                });
            }, 1000);
        }
    }


    function getStickyNoteData(data: IProjectBoardData) {
        if (data.stickyNote !== null) {
            const stickyNoteData: IStickyNote[] = JSON.parse(
                data.stickyNote.stickyNoteData
            );
            yDocStore.stickyNote = [...stickyNoteData];
            setTimeout(() => {
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
            const textCaptionData: ITextCaption[] = JSON.parse(
                data.textCaption.textCaptionData
            );
            
            yDocStore.textCaption = [...textCaptionData];

            setTimeout(() => {
                yDocStore.yArrayTextCaption.insert(0, [...textCaptionData]);

                textCaptionData.forEach((textCaption) => {
                    dragTextCaption(textCaption.id);
                    changeTextCaptionBodyContent(textCaption.id);
                });
            }, 1000);
        }
    }

     /**
     * 
     * reset drawing, stickyNote, textCaption and miniTextEditor array
     */
     function resetYDocArray() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

            const drawingArray = yDocStore.yArrayDrawing.toArray();
            yDocStore.yArrayDrawing.delete(0, drawingArray.length);

            const textCaptionArray = yDocStore.yArrayTextCaption.toArray();
            yDocStore.yArrayTextCaption.delete(0, textCaptionArray.length);
            yDocStore.textCaption = [];

            const stickyNoteArray = yDocStore.yArrayStickyNote.toArray();
            yDocStore.yArrayStickyNote.delete(0, stickyNoteArray.length);
            yDocStore.stickyNote = [];

            const miniTextEditorArray = yDocStore.yArrayMiniTextEditor.toArray();
            yDocStore.yArrayMiniTextEditor.delete(0, miniTextEditorArray.length);
            yDocStore.miniTextEditor = [];

            
            resolve(null);

                
            }, 1000);
        });
    }

  

    return { getProjectBoardData, loading };
}
