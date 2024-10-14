import { defineStore } from 'pinia';
import * as Y from "yjs";
import { IMiniTextEditor } from '../pages/admin/actions/project-board/miniTextEditorTypes';
const useYDocStore = defineStore('y-doc', {
  state: () => ({
    doc:new Y.Doc(),
    miniTextEditor:[] as IMiniTextEditor[],
    yArrayMiniTextEditor:new  Y.Array<IMiniTextEditor>,

    mousePosition:{
      x:0,
      y:0
    },
    yCursor:new Y.Map,
    cursorPosition:0
  }),


});

export const yDocStore=useYDocStore()

