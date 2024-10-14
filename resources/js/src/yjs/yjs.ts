import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Ref } from "vue";
import { IStickyNote } from "../pages/admin/actions/project-board/stickyNoteTypes";
import { IMiniTextEditor } from "../pages/admin/actions/project-board/miniTextEditorTypes";
import { yDocStore } from "../store/yDoc";

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
    initYjsTypesForStickyNote(stickyNoteParam);
    initYjsTypesForMiniTextEditor(miniTextEditorParam);
    initYjsTypesForCursor()
   
    // this allows you to instantly get the (cached) documents data
    const indexeddbProvider = new IndexeddbPersistence(
        "sticky-note",
        yDocStore.doc
    );
    await indexeddbProvider.whenSynced
    // indexeddbProvider.whenSynced.then(() => {
    //     console.log("loaded data from indexed db");
    // });

    new WebsocketProvider("ws://localhost:1234", "sticky-note", yDocStore.doc);
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
                    console.log('modify in observe...')

                    const _miniTextEditor = document.querySelector(
                        ".text-editor-" + item.id
                    ) as HTMLElement;
                    _miniTextEditor.style.position = "absolute";
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


function initYjsTypesForCursor() {
    yDocStore.yCursor = yDocStore.doc.getMap("y-cursor");

    yDocStore.yCursor.observe((event: any) => {
  
            yDocStore.mousePosition.x = yDocStore.yCursor.get('x') as number
            yDocStore.mousePosition.y = yDocStore.yCursor.get('y')  as number
        
    });
}




function moveCursorToPosition(position:number) {
    console.log('move...', position)

    const editor = document.querySelector(".text-editor-body-1") as any;
    // console.log('we move it',position)
    // const editor = document.getElementById('editor');
    const selection = window.getSelection() as Selection
    const range = document.createRange() as Range

    let currentPos = 0;
    let node;

    // Iterate over child nodes to find the correct text node
    for (let i = 0; i < editor.childNodes.length; i++) {
        node = editor.childNodes[i];
        const nodeLength = node.textContent.length;

        if (currentPos + nodeLength >= position) {
            // If it's a text node, set the cursor directly
            if (node.nodeType === Node.TEXT_NODE) {
                range.setStart(node, position - currentPos);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // For element nodes, recursively go inside its child nodes to find the correct position
                setCursorInsideElement(node, position - currentPos, range);
            }
            break;
        } else {
            currentPos += nodeLength;
        }
    }

    range.collapse(true); // Collapse the range to the start (move the cursor there)
    selection.removeAllRanges(); // Clear any existing selections
    selection.addRange(range); // Set the new range (moves the cursor)
    editor.focus(); // Ensure the contenteditable div has focus
}

// Helper function to set cursor inside nested elements
function setCursorInsideElement(element:any, position:number, range:any) {
    for (let i = 0; i < element.childNodes.length; i++) {
        let child = element.childNodes[i];
        let length = child.textContent.length;

        if (position <= length) {
            if (child.nodeType === Node.TEXT_NODE) {
                range.setStart(child, position);
            } else {
                setCursorInsideElement(child, position, range); // Recursive for nested elements
            }
            break;
        } else {
            position -= length;
        }
    }
}