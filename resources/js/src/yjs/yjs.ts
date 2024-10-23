import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Ref } from "vue";
import { IStickyNote } from "../pages/admin/actions/project-board/stickynote/stickyNoteTypes";
import { yDocStore } from "../store/yDoc";
import { runFuncSequentially } from "../helper/util";
import {
    initCursor,
    initDrawing,
    initMiniTextEditor,
    initMouse,
    initStickyNote,
    initTextCaption,
} from "./yjsUtil";
import { ITextCaption } from "../pages/admin/actions/project-board/text-caption/textCaptionTypes";

export interface ITextCaptionParams {
    yArrayTextCaption: Ref<Y.Array<ITextCaption>>;
    textCaptionHasEventSet: Set<number>;
    changeTextCaptionBodyContent: (...args: any[]) => void;
    dragTextCaption: (...args: any[]) => void;
    textCaption: Ref<ITextCaption[]>;
}

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
    miniTextEditorParam: IMiniTextEditorParams,
    textCaptionParam: ITextCaptionParams
) {
    yDocStore.loading = true;

    runFuncSequentially([
        initCursor,
        initMouse,
        initDrawing,
        initMiniTextEditor(miniTextEditorParam),
        initStickyNote(stickyNoteParam),
        initTextCaption(textCaptionParam),
    ])
        .then(() => {
            // this allows you to instantly get the (cached) documents data
            const indexeddbProvider = new IndexeddbPersistence(
                "sticky-note-y",
                yDocStore.doc
            );
            indexeddbProvider.whenSynced.then(() => {
                yDocStore.loading = false;
                console.log("loaded data from indexed db");
            });
        })
        .catch((err) => console.log(err));

    new WebsocketProvider(
        "ws://localhost:1234",
        "sticky-note-y",
        yDocStore.doc
    );
}
