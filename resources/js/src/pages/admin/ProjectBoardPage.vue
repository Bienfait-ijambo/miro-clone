<script lang="ts" setup>
import { App } from "../../app/app";
import AddItem from "./components/project-board/AddItem.vue";
import ColorPalette from "./components/project-board/ColorPalette.vue";
import UndoRedo from "./components/project-board/UndoRedo.vue";
import { useDragStickyNote } from "./actions/project-board/stickyNote";
import StickyNote from "./components/project-board/StickyNote.vue";
import MiniTextEditor from "./components/project-board/MiniTextEditor.vue";
import { onMounted } from "vue";
import { useDragMiniTextEditor } from "./actions/project-board/editor/miniTextEditor";
import { initYjs } from "../../yjs/yjs";
import { yDocStore } from "../../store/yDoc";
import { useShareUserCursor } from "./actions/project-board/cursor/userMouse";
import UserCursor from "./components/project-board/UserCursor.vue";
import { useCanvas } from "./actions/project-board/canvas/canvas";
import LoadingIndicator from "./components/project-board/LoadingIndicator.vue";
import TextCaption from "./components/project-board/TextCaption.vue";
import { useDragTextCaption } from "./actions//project-board/textCaption";

const { initCanvas } = useCanvas();

const { trackMousePosition } = useShareUserCursor();

const {
    dragTextCaption,
    createTextCaption,
    textCaption,

    deleteTextCaption,

    yArrayTextCaption,

    textCaptionHasEventSet,
    changeTextCaptionBodyContent,
} = useDragTextCaption();

const {
    dragStickyNote,
    createStickyNote,
    stickyNote,
    deleteStickyNote,
    yArrayStickyNote,
    stickyNoteHasEventSet,
    changeStickyNoteBodyContent,
} = useDragStickyNote();

const {
    dragMiniTextEditor,
    createMiniTextEditor,
    deleteMiniTextEditor,

    miniTextEditorHasEventSet,
    changeMiniTextEditorBodyContent,
} = useDragMiniTextEditor();

function changeStickyNoteColor(stickyNoteId: number, color: string) {
    for (let i = 0; i < stickyNote.value.length; i++) {
        if (stickyNote.value[i].id === stickyNoteId) {
            stickyNote.value[i].color = color;
        }
    }
}

function changeMiniTextEditorColor(miniTextEditorId: number, color: string) {
    for (let i = 0; i < yDocStore.miniTextEditor.length; i++) {
        if (yDocStore.miniTextEditor[i].id === miniTextEditorId) {
            yDocStore.miniTextEditor[i].color = color;
        }
    }
}

onMounted(() => {
    initYjs(
        {
            yArrayStickyNote,
            stickyNoteHasEventSet,
            changeStickyNoteBodyContent,
            stickyNote,
            dragStickyNote,
        },
        {
            miniTextEditorHasEventSet,
            changeMiniTextEditorBodyContent,
            dragMiniTextEditor,
        },

        {
            dragTextCaption,
            textCaption,
            yArrayTextCaption,
            textCaptionHasEventSet,
            changeTextCaptionBodyContent,
        }
    );
});
</script>
<template>
    <div class="" @mousemove="trackMousePosition">
        <!-- <LoadingIndicator/> -->

        <div class="flex">
            <div class="bg-slate-100 h-screen w-[50px]">
                <!-- <div class="flex justify-center  py-4">
                <img :src="App.baseUrl+'/img/logo.png'"
                width="50"  alt="logo">
               </div> -->

                <AddItem
                    @createTextCaption="createTextCaption"
                    @initDrawing="
                        async () => (await initCanvas()).drawOnCanvas()
                    "
                    @createStickyNote="createStickyNote"
                    @createMiniTextEditor="createMiniTextEditor"
                />

                <ColorPalette
                    :stickyNotes="stickyNote"
                    @changeStickyNoteColor="changeStickyNoteColor"
                />
                <UndoRedo
                    @redo="async () => (await initCanvas()).redo()"
                    @undo="async () => (await initCanvas()).undo()"
                />
            </div>

            <div class="bg-slate-100 w-screen">
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
                <canvas
                    class="w-full h-screen"
                    style="
                        background-color: #f4f4f9;

                        z-index: -1000;
                    "
                ></canvas>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                    <!-- list of ceated projects #e2e8f0; -->

                    <TextCaption
                        @deleteTextCaption="deleteTextCaption"
                        :textCaptions="textCaption"
                    />

                    <StickyNote
                        @deleteStickyNote="deleteStickyNote"
                        :sticky-notes="stickyNote"
                    />
                    <MiniTextEditor
                        @changeMiniTextEditorColor="changeMiniTextEditorColor"
                        @deleteMiniTextEditor="deleteMiniTextEditor"
                        :miniTextEditors="yDocStore.miniTextEditor"
                    />

                    <UserCursor :mouse-position="yDocStore.mousePosition" />
                </div>
                <!-- {{ stickyNote }} -->
                <!-- {{ yDocStore.arrayDrawing }} -->
            </div>
        </div>
    </div>
</template>
