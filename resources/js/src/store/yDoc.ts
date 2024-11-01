import { defineStore } from "pinia";
import * as Y from "yjs";
import { IMiniTextEditor } from "../pages/admin/actions/project-board/editor/miniTextEditorTypes";
export interface ICursor {
    cursorPosition: number;
    x: string;
    y: string;
}

export interface IReplayDrawing {
    x: number;
    y: number;
    type: "start" | "drawing";
    strokeStyle: string;
}

const useYDocStore = defineStore("y-doc", {
    state: () => ({
        doc: new Y.Doc(),
        miniTextEditor: [] as IMiniTextEditor[],
        yArrayMiniTextEditor: new Y.Array<IMiniTextEditor>(),

        mousePosition: {
            x: 0,
            y: 0,
        },
        yMouse: new Y.Map(),

        yCursor: new Y.Map(),
        cursor: {
            cursorPosition: 0,
            x: "",
            y: "",
        },

        yArrayDrawing: new Y.Array<Array<IReplayDrawing>>(),
        arrayDrawing: [] as Array<Array<IReplayDrawing>>,
        //we use it as history
        redoDrawingArray: [] as Array<Array<IReplayDrawing>>,
        loading: false,
    }),
});

export const yDocStore = useYDocStore();
