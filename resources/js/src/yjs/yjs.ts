
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Ref } from "vue";
import { IStickyNote } from "../pages/admin/actions/project-board/stickyNoteTypes";
import { IMiniTextEditor } from "../pages/admin/actions/project-board/miniTextEditorTypes";



export interface IStickyNoteParams{

    yArrayStickyNote: Ref<Y.Array<IStickyNote>>,
    doc: Ref<Y.Doc>,
    stickyNoteHasEventSet: Set<number>,
    changeStickyNoteBodyContent: (...args: any[]) => void,
    dragStickyNote: (...args: any[]) => void,
    stickyNote: Ref<IStickyNote[]>,
}

export interface IMiniTextEditorParams{

    yArrayMiniTextEditor: Ref<Y.Array<IMiniTextEditor>>,
    doc: Ref<Y.Doc>,
    miniTextEditorHasEventSet: Set<number>,
    changeMiniTextEditorBodyContent: (...args: any[]) => void,
    dragMiniTextEditor: (...args: any[]) => void,
    miniTextEditor: Ref<IMiniTextEditor[]>,
}


export function initYjs(
   stickyNoteParam:IStickyNoteParams,
   miniTextEditorParam:IMiniTextEditorParams
) {

    const {
        yArrayStickyNote,
        doc ,
        stickyNoteHasEventSet,
        changeStickyNoteBodyContent,
        stickyNote,
        dragStickyNote
    }=stickyNoteParam

    // const {

        
    // yArrayMiniTextEditor,
    // doc,
    // miniTextEditorHasEventSet,
    // changeMiniTextEditorBodyContent,
    // dragMiniTextEditor,
    // miniTextEditor,
    // }=miniTextEditorParam
     
     doc.value = new Y.Doc();

     yArrayStickyNote.value = doc.value.getArray("y-array-sticky-notes");

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

     // this allows you to instantly get the (cached) documents data
     const indexeddbProvider = new IndexeddbPersistence(
         "sticky-note",
         doc.value
     );
     indexeddbProvider.whenSynced.then(() => {
         console.log("loaded data from indexed db");
     });

     new WebsocketProvider("ws://localhost:1234", "sticky-note", doc.value);
 }
