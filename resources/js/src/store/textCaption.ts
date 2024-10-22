import { defineStore } from 'pinia';

const useTextCaptionStore = defineStore('textCaption', {
  state: () => ({
    textCaption:{} as {id:number}
  }),


});

export const textCaptionStore=useTextCaptionStore()