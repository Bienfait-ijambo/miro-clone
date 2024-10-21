import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Ref } from "vue";
import { IStickyNote } from "../pages/admin/actions/project-board/stickyNoteTypes";
import { yDocStore } from "../store/yDoc";
import { useDrawOnCanvas } from "../pages/admin/actions/project-board/canvas/canvas";


const {replayDrawing}=useDrawOnCanvas()


export interface IStickyNoteParams {
    yArrayStickyNote: Ref<Y.Array<IStickyNote>>;
    stickyNoteHasEventSet: Set<number>;
    changeStickyNoteBodyContent: (...args: any[]) => void;
    dragStickyNote: (...args: any[]) => void;
    stickyNote: Ref<IStickyNote[]>;
}

export interface IMiniTextEditorParams {
    miniTextEditorHasEventSet: Set<number>;
    changeMiniTextEditorBodyContent: (...args: any[]) => void;
    dragMiniTextEditor: (...args: any[]) => void;
}

async function runFuncSequentially( functions: (() => any | Promise<any>)[] ) {
    for (const func of functions) {
        await func();
    }
}

export async function initYjs(
    stickyNoteParam: IStickyNoteParams,
    miniTextEditorParam: IMiniTextEditorParams
) {

    const func1 = () => {
        return new Promise((resolve, reject) => {
            console.log('func1...')
            initYjsTypesForStickyNote(stickyNoteParam);
            resolve(null);
        });
    };
    const func2 = () => {
        return new Promise((resolve, reject) => {
            console.log('func2...')

            initYjsTypesForMiniTextEditor(miniTextEditorParam);
            resolve(null);
        });
    };
    const func3 = () => {
        return new Promise((resolve, reject) => {
            console.log('func3...')

            initYjsTypesForCursor();
            resolve(null);
        });
    };
  
    const func4 = () => {
        return new Promise((resolve, reject) => {
            console.log('func4...')

            initYjsTypesForMouse();
            resolve(null);
        });
    };

    yDocStore.l=true
    runFuncSequentially([func1, func2,func3,func4]).then(() => {
        initYjsTypesDrawing();
    yDocStore.l=false

        console.log("All functions completed in sequence.");
    });


    // initYjsTypesForStickyNote(stickyNoteParam);
    // initYjsTypesForMiniTextEditor(miniTextEditorParam);
    // initYjsTypesForCursor();
    // initYjsTypesForMouse();
    // initYjsTypesDrawing();

    // this allows you to instantly get the (cached) documents data
    const indexeddbProvider = new IndexeddbPersistence(
        "sticky-note-y",
        yDocStore.doc
    );
    indexeddbProvider.whenSynced.then(() => {
        console.log("loaded data from indexed db");
    });

    new WebsocketProvider( "ws://localhost:1234", "sticky-note-y", yDocStore.doc );
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

                    
                    //add an event on each sticky note
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

    yDocStore.yArrayDrawing.observe((event: any) => {
        yDocStore.arrayDrawing=yDocStore.yArrayDrawing.toArray();
        replayDrawing()
        
        console.log("modifying y-array-drawing...");
    });
}
