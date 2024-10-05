
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Ref } from "vue";
import { IStickyNote } from "../pages/admin/actions/project-board/stickyNoteTypes";
import { IMiniTextEditor } from "../pages/admin/actions/project-board/miniTextEditorTypes";
import { yDocStore } from "../store/yDoc";



export interface IStickyNoteParams{
    yArrayStickyNote: Ref<Y.Array<IStickyNote>>,
    stickyNoteHasEventSet: Set<number>,
    changeStickyNoteBodyContent: (...args: any[]) => void,
    dragStickyNote: (...args: any[]) => void,
    stickyNote: Ref<IStickyNote[]>,
}

export interface IMiniTextEditorParams{

    yArrayMiniTextEditor: Ref<Y.Array<IMiniTextEditor>>,
   
    miniTextEditorHasEventSet: Set<number>,
    changeMiniTextEditorBodyContent: (...args: any[]) => void,
    dragMiniTextEditor: (...args: any[]) => void,
    miniTextEditor: Ref<IMiniTextEditor[]>,
}


export function initYjs(
   stickyNoteParam:IStickyNoteParams,
   miniTextEditorParam:IMiniTextEditorParams
) {

 
    initYjsTypesForStickyNote(stickyNoteParam)
    initYjsTypesForMiniTextEditor(miniTextEditorParam)


     // this allows you to instantly get the (cached) documents data
     const indexeddbProvider = new IndexeddbPersistence(
         "sticky-note",
         yDocStore.doc 
     );
     indexeddbProvider.whenSynced.then(() => {
         console.log("loaded data from indexed db");
     });

     new WebsocketProvider("ws://localhost:1234", "sticky-note",yDocStore.doc );
 }



 function initYjsTypesForMiniTextEditor( miniTextEditorParam:IMiniTextEditorParams){
    const {
        yArrayMiniTextEditor,
      
        miniTextEditorHasEventSet,
        changeMiniTextEditorBodyContent,
        dragMiniTextEditor,
        miniTextEditor,
        }=miniTextEditorParam


        yArrayMiniTextEditor.value = yDocStore.doc.getArray("y-array-mini-text-editor");

        yArrayMiniTextEditor.value.observe((event: any) => {
            miniTextEditor.value = yArrayMiniTextEditor.value.toArray();
    
            for (const item of miniTextEditor.value) {
                if (miniTextEditorHasEventSet.has(item.id) === false) {
                    miniTextEditorHasEventSet.add(item.id);
                    setTimeout(() => {
                        dragMiniTextEditor(item.id);
                        changeMiniTextEditorBodyContent(item.id);
                        const _miniTextEditor = document.querySelector(
                            ".text-editor-" + item.id
                        ) as HTMLElement;
                        _miniTextEditor.style.position = "absolute";
                        //add an event on each sticky note
                    }, 2000);
                }
            }
        });
 }

 function initYjsTypesForStickyNote(  stickyNoteParam:IStickyNoteParams){

    const {
        yArrayStickyNote,
     
        stickyNoteHasEventSet,
        changeStickyNoteBodyContent,
        stickyNote,
        dragStickyNote
    }=stickyNoteParam
    yArrayStickyNote.value = yDocStore.doc.getArray("y-array-sticky-notes");

    yArrayStickyNote.value.observe((event: any) => {
        stickyNote.value = yArrayStickyNote.value.toArray();

        for (const item of stickyNote.value) {
            if (stickyNoteHasEventSet.has(item.id) === false) {
                stickyNoteHasEventSet.add(item.id);
                setTimeout(() => {
                    dragStickyNote(item.id);
                    changeStickyNoteBodyContent(item.id);
                    const _stickyNote = document.querySelector(
                        ".sticky-note-" + item.id
                    ) as HTMLElement;
                    _stickyNote.style.position = "absolute";
                    //add an event on each sticky note
                }, 2000);
            }
        }
    });
 }