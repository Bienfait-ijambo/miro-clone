<script lang="ts" setup>
import ImageIcon from "../../../../components/icons/ImageIcon.vue";
import { yDocStore } from "../../../../store/yDoc";
import { IMiniTextEditor } from "../../actions/project-board/editor/miniTextEditorTypes";
import BlinkingCursor from "./BlinkingCursor.vue";
defineProps<{
    miniTextEditors: IMiniTextEditor[];
}>();


const emit = defineEmits<{
    (e: "deleteMiniTextEditor", miniTextEditor: IMiniTextEditor): void;
}>();
</script>

<template>
    <div
        v-for="miniTextEditor in miniTextEditors"
        :key="miniTextEditor.id"
        :style="{
            position: 'absolute',
            top: miniTextEditor.dragPosition.y + 'px',
            left: miniTextEditor.dragPosition.x + 'px',
            // width: stickyNote.resizePosition.x + 'px',
            height: miniTextEditor.resizePosition.y + 'px',
        }"
        :class="
            'flex flex-col  min-h-40 w-[390px] shadow-md p-1 rounded-md cursor-pointer text-editor-' +
            miniTextEditor.id
        "
    >
        <div class="card-header flex justify-between">
            <div
                @click="emit('deleteMiniTextEditor', miniTextEditor)"
                class="hover:bg-slate-100 px-1 py-1 rounded-md"
            >
                <TrashIcon></TrashIcon>
            </div>

            <div
                :class="
                    'hover:bg-slate-100 sticky-note-handler px-1 py-1 rounded-md text-editor-handler-' +
                    miniTextEditor.id
                "
            >
                <ArrowTopIcon></ArrowTopIcon>
            </div>
        </div>

        <div class="bg-white flex gap-1 p-2 toolbar">
            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-bold-' +
                    miniTextEditor.id
                "
                :data-name="'apply-bold-' + miniTextEditor.id"
            >
                <BoldIcon :data-name="'apply-bold-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-italic-' +
                    miniTextEditor.id
                "
                :data-name="'apply-italic-' + miniTextEditor.id"
            >
                <ItalicIcon :data-name="'apply-italic-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-underline-' +
                    miniTextEditor.id
                "
                :data-name="'apply-underline-' + miniTextEditor.id"
            >
                <UnderLineIcon
                    :data-name="'apply-underline-' + miniTextEditor.id"
                />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-h1-' +
                    miniTextEditor.id
                "
                :data-name="'apply-h1-' + miniTextEditor.id"
            >
                <H1Icon :data-name="'apply-h1-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-h2-' +
                    miniTextEditor.id
                "
                :data-name="'apply-h2-' + miniTextEditor.id"
            >
                <H2Icon :data-name="'apply-h2-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-h3-' +
                    miniTextEditor.id
                "
                :data-name="'apply-h3-' + miniTextEditor.id"
            >
                <H3Icon :data-name="'apply-h3-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-align-left-' +
                    miniTextEditor.id
                "
                :data-name="'apply-align-left-' + miniTextEditor.id"
            >
                <AlignLeftIcon
                    :data-name="'apply-align-left-' + miniTextEditor.id"
                />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-align-center-' +
                    miniTextEditor.id
                "
                :data-name="'apply-align-center-' + miniTextEditor.id"
            >
                <CenterIcon
                    :data-name="'apply-align-center-' + miniTextEditor.id"
                />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-align-right-' +
                    miniTextEditor.id
                "
                :data-name="'apply-align-right-' + miniTextEditor.id"
            >
                <AlignRightIcon
                    :data-name="'apply-align-right-' + miniTextEditor.id"
                />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-list-' +
                    miniTextEditor.id
                "
                :data-name="'apply-list-' + miniTextEditor.id"
            >
                <ListIcon :data-name="'apply-list-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-link-' +
                    miniTextEditor.id
                "
                :data-name="'apply-link-' + miniTextEditor.id"
            >
                <LinkIcon :data-name="'apply-link-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-slate-100 py-1 px-1 rounded-md apply-image-' +
                    miniTextEditor.id
                "
                :data-name="'insert-image-' + miniTextEditor.id"
            >
                <ImageIcon :data-name="'insert-image-' + miniTextEditor.id" />
            </button>

            <button
                :class="
                    'hover:bg-yellow-200 bg-yellow-300 w-6 h-4 text-xs py-1 px-1 pt-4 rounded-sm apply-hightLightText-' +
                    miniTextEditor.id
                "
                :data-name="'highlight-text-' + miniTextEditor.id"
            >
                <!-- Add Highlight Icon here -->
            </button>
        </div>

        <BlinkingCursor 
        :miniTextEditorId="miniTextEditor.id" 
        :x="yDocStore.cursor.x"
        :y="yDocStore.cursor.y"
        />

        <div
            v-html="miniTextEditor.body"
            :class="
                'card-body w-full h-full p-2 bg-white text-editor-body-' +
                miniTextEditor.id
            "
            contenteditable="true"
        ></div>
        <div class="flex justify-end">
            <div
                :class="
                    'cursor-nw-resize text-editor-resizer-' + miniTextEditor.id
                "
            >
                <ArrowDownIcon />
            </div>
        </div>
    </div>
</template>
