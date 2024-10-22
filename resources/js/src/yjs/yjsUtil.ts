import { useCanvas } from "../pages/admin/actions/project-board/canvas/canvas";
import { yDocStore } from "../store/yDoc";
import { IMiniTextEditorParams, IStickyNoteParams } from "./yjs";

const {initCanvas}=useCanvas()



 export const initStickyNote=(stickyNoteParam: IStickyNoteParams) =>{
       return function(){
        return new Promise<any>((resolve, reject) =>{
            initYjsTypesForStickyNote(stickyNoteParam);
            resolve(null)
    
        })
       }
    
}


 export const initMiniTextEditor=(miniTextEditorParam: IMiniTextEditorParams) =>{
   return function(){
    return new Promise((resolve, reject) =>{
        initYjsTypesForMiniTextEditor(miniTextEditorParam);
        resolve(null)

    })
   }
}

export const initCursor=() =>{
    return new Promise((resolve, reject) =>{
        initYjsTypesForCursor();
        resolve(null)

    })
}


export const initMouse=() =>{
    return new Promise((resolve, reject) =>{
        initYjsTypesForMouse();
        resolve(null)

    })
}


export const initDrawing=() =>{
    return new Promise((resolve, reject) =>{
        initYjsTypesDrawing()
        resolve(null)

    })
}


function initYjsTypesForMiniTextEditor(
    miniTextEditorParam: IMiniTextEditorParams
) {
    const {
        miniTextEditorHasEventSet,
        changeMiniTextEditorBodyContent,
        dragMiniTextEditor,
    } = miniTextEditorParam;

    yDocStore.yArrayMiniTextEditor = yDocStore.doc.getArray(
        "y-array-mini-text-editor"
    );

    yDocStore.yArrayMiniTextEditor.observe((event: any) => {
        yDocStore.miniTextEditor = yDocStore.yArrayMiniTextEditor.toArray();

        for (const item of yDocStore.miniTextEditor) {
            if (miniTextEditorHasEventSet.has(item.id) === false) {
                miniTextEditorHasEventSet.add(item.id);
                setTimeout(() => {
                    dragMiniTextEditor(item.id);
                    changeMiniTextEditorBodyContent(item.id);

                    
                }, 1000);
            }
        }
    });
}

function initYjsTypesForStickyNote(stickyNoteParam: IStickyNoteParams) {
    const {
        yArrayStickyNote,

        stickyNoteHasEventSet,
        changeStickyNoteBodyContent,
        stickyNote,
        dragStickyNote,
    } = stickyNoteParam;
    yArrayStickyNote.value = yDocStore.doc.getArray("y-array-sticky-notes");

    yArrayStickyNote.value.observe((event: any) => {
        stickyNote.value = yArrayStickyNote.value.toArray();

        for (const item of stickyNote.value) {
            if (stickyNoteHasEventSet.has(item.id) === false) {
                stickyNoteHasEventSet.add(item.id);
                setTimeout(() => {
                    dragStickyNote(item.id);
                    changeStickyNoteBodyContent(item.id);

                   
                }, 2000);
            }
        }
    });
}

function initYjsTypesForMouse() {
    yDocStore.yMouse = yDocStore.doc.getMap("y-mouse");

    yDocStore.yMouse.observe((event: any) => {
        yDocStore.mousePosition.x = yDocStore.yMouse.get("x") as number;
        yDocStore.mousePosition.y = yDocStore.yMouse.get("y") as number;
    });
}

function initYjsTypesForCursor() {
    yDocStore.yCursor = yDocStore.doc.getMap("y-cursor");

    yDocStore.yCursor.observe((event: any) => {
        yDocStore.cursor.x = yDocStore.yCursor.get("x") as string;
        yDocStore.cursor.y = yDocStore.yCursor.get("y") as string;
    });
}

function initYjsTypesDrawing() {
    yDocStore.yArrayDrawing = yDocStore.doc.getArray("y-array-drawing");

    yDocStore.yArrayDrawing.observe(async(event: any) => {
        yDocStore.arrayDrawing=yDocStore.yArrayDrawing.toArray();
        
        (await initCanvas()).replayDrawing()
        
        console.log("modifying y-array-drawing...");
    });
}
