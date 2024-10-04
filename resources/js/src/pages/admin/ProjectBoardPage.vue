<script lang="ts" setup>
import { App } from "../../app/app";
import AddItem from "./components/project-board/AddItem.vue";
import ColorPalette from "./components/project-board/ColorPalette.vue";
import UndoRedo from "./components/project-board/UndoRedo.vue";

import { useDragStickyNote } from "./actions/project-board/stickyNote";
import StickyNote from "./components/project-board/StickyNote.vue";
import MiniTextEditor from "./components/project-board/MiniTextEditor.vue";
import { onMounted, Ref } from "vue";
import { useDragMiniTextEditor } from "./actions/project-board/editor/miniTextEditor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import {initYjs} from '../../yjs/yjs'


const {
    dragStickyNote,
    createStickyNote,
    stickyNote,
    deleteStickyNote,

    yArrayStickyNote,
        doc ,
        stickyNoteHasEventSet,
        changeStickyNoteBodyContent,

} = useDragStickyNote();

const {
    dragMiniTextEditor,
    createMiniTextEditor,
    deleteMiniTextEditor,
    miniTextEditor,
} = useDragMiniTextEditor();

function changeStickyNoteColor(stickyNoteId: number, color: string) {
    for (let i = 0; i < stickyNote.value.length; i++) {
        if (stickyNote.value[i].id === stickyNoteId) {
            stickyNote.value[i].color = color;
        }
    }
}

function changeMiniTextEditorColor(miniTextEditorId: number, color: string) {
    for (let i = 0; i < miniTextEditor.value.length; i++) {
        if (miniTextEditor.value[i].id === miniTextEditorId) {
            miniTextEditor.value[i].color = color;
        }
    }
}


onMounted(() => {
    initYjs({
        yArrayStickyNote,
        doc ,
        stickyNoteHasEventSet,
        changeStickyNoteBodyContent,
        stickyNote,
        dragStickyNote
    },{})
});
</script>
<template>
    <div class="bg-slate-100">
        <div class="flex">
            <div class="bg-slate-200 h-screen w-[50px]">
                <!-- <div class="flex justify-center  py-4">
                <img :src="App.baseUrl+'/img/logo.png'"
                width="50"  alt="logo">
               </div> -->

                <AddItem
                    @createStickyNote="createStickyNote"
                    @createMiniTextEditor="createMiniTextEditor"
                />

                <ColorPalette
                    :stickyNotes="stickyNote"
                    @changeStickyNoteColor="changeStickyNoteColor"
                />
                <UndoRedo />
            </div>

            <div class="bg-slate-200 w-screen">
                <div class="flex justify-between p-2 mt-1">
                    <div
                        class="flex bg-white p-2 px-3 gap-2 py-2 rounded-md shadow-md"
                    >
                        <img
                            :src="App.baseUrl + '/img/logo.png'"
                            width="25"
                            alt="logo"
                        />
                        <span class="text-slate-200">|</span> Build Smart AI
                    </div>

                    <div
                        class="flex gap-2 bg-white p-2 px-2 py-2 rounded-md shadow-md"
                    >
                        <img
                            :src="App.baseUrl + '/img/avatar.webp'"
                            width="30"
                            class="rounded-full border-2 border-white"
                            alt=""
                        />

                        <button
                            class="flex gap-2 bg-blue-500 py-1 px-2 rounded-md text-white"
                        >
                            <PersonPlusIcon class="mt-1" />
                            <span class="text-sm"> Share</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                    <!-- list of ceated projects  -->
                    <StickyNote
                        @deleteStickyNote="deleteStickyNote"
                        :sticky-notes="stickyNote"
                    />
                    <MiniTextEditor
                        @changeMiniTextEditorColor="changeMiniTextEditorColor"
                        @deleteMiniTextEditor="deleteMiniTextEditor"
                        :miniTextEditors="miniTextEditor"
                    />
                </div>
                {{ stickyNote }}
            </div>
        </div>
    </div>
</template>
