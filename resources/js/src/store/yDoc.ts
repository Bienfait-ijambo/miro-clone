import { defineStore } from 'pinia';
import * as Y from "yjs";
import { IMiniTextEditor } from '../pages/admin/actions/project-board/miniTextEditorTypes';
export interface ICursor{
  cursorPosition: number;
  x: string
  y:string
}
const useYDocStore = defineStore('y-doc', {
  state: () => ({
    doc:new Y.Doc(),
    miniTextEditor:[] as IMiniTextEditor[],
    yArrayMiniTextEditor:new  Y.Array<IMiniTextEditor>,

    mousePosition:{
      x:0,
      y:0
    },
    yMouse:new Y.Map,

    yCursor:new Y.Map,
    cursor:{
      cursorPosition:0,
      x:'',
      y:''
    }
   
  }),


});

export const yDocStore=useYDocStore()

