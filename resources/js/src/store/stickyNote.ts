import { defineStore } from 'pinia';

const useStikyNoteStore = defineStore('stickyNote', {
  state: () => ({
    stickyNote:{} as {id:number}
  }),


});

export const stickyNoteStore=useStikyNoteStore()