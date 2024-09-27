import { defineStore } from 'pinia';

const useMiniTextEditorStore= defineStore('miniTextEditor', {
  state: () => ({
    miniTextEditor:{} as {id:number}
  }),


});

export const miniTextEditorStore=useMiniTextEditorStore()