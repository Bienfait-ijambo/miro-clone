import { defineStore } from 'pinia';
import * as Y from "yjs";
const useYDocStore = defineStore('y-doc', {
  state: () => ({
    doc:new Y.Doc()
  }),


});

export const yDocStore=useYDocStore()

