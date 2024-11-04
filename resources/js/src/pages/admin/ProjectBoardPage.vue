<script lang="ts" setup>
import { App } from "../../app/app";
import AddItem from "./components/project-board/AddItem.vue";
import ColorPalette from "./components/project-board/ColorPalette.vue";
import UndoRedo from "./components/project-board/UndoRedo.vue";
import { useDragStickyNote } from "./actions/project-board/stickynote/stickyNote";
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
import { useDragTextCaption } from "./actions/project-board/text-caption/textCaption";
import { RouterLink, useRoute } from "vue-router";
import { useGetProjectDetail } from "./actions/project-board/http/getProjectDetail";
import TopNavBar from "./components/project-board/TopNavBar.vue";
import { useSaveBoardData } from "./actions/project-board/http/saveBoardData";
import { tryLogoutUser } from "./actions/http/trylogout";
import { useGetProjectBoardData } from "./actions/project-board/http/getProjectBoardData";

const route = useRoute();
const { initCanvas } = useCanvas();

const { trackMousePosition } = useShareUserCursor();

const {
    dragTextCaption,
    createTextCaption,
    deleteTextCaption,
    textCaptionHasEventSet,
    changeTextCaptionBodyContent,
} = useDragTextCaption();

const {
    dragStickyNote,
    createStickyNote,

    deleteStickyNote,
    changeStickyNoteColor,
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

function changeMiniTextEditorColor(miniTextEditorId: number, color: string) {
    for (let i = 0; i < yDocStore.miniTextEditor.length; i++) {
        if (yDocStore.miniTextEditor[i].id === miniTextEditorId) {
            yDocStore.miniTextEditor[i].color = color;
        }
    }
}

const { projectData, getProjectDetail } = useGetProjectDetail(route);

async function saveProject() {
    const projectId = projectData.value.id;
    const { saveBoardData } = useSaveBoardData(
        yDocStore.arrayDrawing,
        yDocStore.miniTextEditor,
        yDocStore.stickyNote,
        yDocStore.textCaption,
        projectId
    );
    await saveBoardData();
}

const { getProjectBoardData,loading:loadingData } = useGetProjectBoardData(
    initCanvas,
    dragStickyNote,
    changeStickyNoteBodyContent,
    dragTextCaption,
    changeTextCaptionBodyContent,
    dragMiniTextEditor,
    changeMiniTextEditorBodyContent
);

onMounted(async () => {
    await tryLogoutUser();

    await getProjectDetail();

    await getProjectBoardData(projectData.value.id);

    initYjs(
        {
            stickyNoteHasEventSet,
            changeStickyNoteBodyContent,

            dragStickyNote,
        },
        {
            miniTextEditorHasEventSet,
            changeMiniTextEditorBodyContent,
            dragMiniTextEditor,
        },

        {
            dragTextCaption,

            textCaptionHasEventSet,
            changeTextCaptionBodyContent,
        },
        projectData.value
    );
});
</script>
<template>
    <div class="" @mousemove="trackMousePosition">
        <LoadingIndicator :loading="loadingData" />

        <div class="flex" v-show="loadingData===true?false:true">
            <div class="bg-slate-100 h-screen w-[50px]">
                <!-- <div class="flex justify-center  py-4">
                <img :src="App.baseUrl+'/img/logo.png'"
                width="50"  alt="logo">
               </div> -->

                <AddItem
                    @saveBoardData="saveProject"
                    @createTextCaption="createTextCaption"
                    @initDrawing="
                        async () => (await initCanvas()).drawOnCanvas()
                    "
                    @createStickyNote="createStickyNote"
                    @createMiniTextEditor="createMiniTextEditor"
                />

                <ColorPalette
                    :stickyNotes="yDocStore.stickyNote"
                    @changeStickyNoteColor="changeStickyNoteColor"
                />
                <UndoRedo
                    @resetCanvas="async () => (await initCanvas()).initCanvas()"
                    @redo="async () => (await initCanvas()).redo()"
                    @undo="async () => (await initCanvas()).undo()"
                />
            </div>

            <div class="bg-slate-100 w-screen" >
                <TopNavBar :project="projectData" />
                <canvas
                    class="w-full h-screen"
                    style="background-color: #f4f4f9; z-index: -1000"
                ></canvas>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                    <!-- list of ceated projects #e2e8f0; -->

                    <TextCaption
                        @deleteTextCaption="deleteTextCaption"
                        :textCaptions="yDocStore.textCaption"
                    />

                    <StickyNote
                        @deleteStickyNote="deleteStickyNote"
                        :sticky-notes="yDocStore.stickyNote"
                    />
                    <MiniTextEditor
                        @changeMiniTextEditorColor="changeMiniTextEditorColor"
                        @deleteMiniTextEditor="deleteMiniTextEditor"
                        :miniTextEditors="yDocStore.miniTextEditor"
                    />

                    <UserCursor :mouse-position="yDocStore.mousePosition" />
                </div>
                {{ yDocStore.textCaption }}-------
                {{ yDocStore.yArrayTextCaption.toArray() }}

                --------------------------------------------------------------------- <br>


                {{ yDocStore.stickyNote }}-------
                {{ yDocStore.yArrayStickyNote.toArray() }}

                --------------------------------------------------------------------- <br>
                {{ yDocStore.yArrayDrawing.toArray() }}
                --------------------------------------------------------------------- <br>

            </div>
        </div>
    </div>
</template>
