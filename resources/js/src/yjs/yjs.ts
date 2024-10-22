import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Ref } from "vue";
import { IStickyNote } from "../pages/admin/actions/project-board/stickyNoteTypes";
import { yDocStore } from "../store/yDoc";
import { runFuncSequentially } from "../helper/util";
import { initCursor, initDrawing, initMiniTextEditor, initMouse, initStickyNote } from "./yjsUtil";



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


export async function initYjs(
    stickyNoteParam: IStickyNoteParams,
    miniTextEditorParam: IMiniTextEditorParams
) {


    runFuncSequentially([initCursor,initMouse,initDrawing,
        initMiniTextEditor(miniTextEditorParam),
        initStickyNote(stickyNoteParam)
    ]).then(() => {
        console.log("All functions completed in sequence.");
    });
   

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

