<script lang="ts" setup>
import ImageIcon from "../../../../components/icons/ImageIcon.vue";
import { IMiniTextEditor } from "../../actions/project-board/miniTextEditorTypes";

defineProps<{
    miniTextEditors: IMiniTextEditor[];
}>();


const emit=defineEmits<{ (e: "deleteMiniTextEditor", miniTextEditor: IMiniTextEditor): void }>();
</script>

<template>
    <div
    v-for="miniTextEditor in miniTextEditors"
    :key="miniTextEditor.id"
        :class="'flex flex-col  min-h-40 w-[350px] shadow-md p-1 rounded-md cursor-pointer text-editor-'+miniTextEditor.id"
    >
        <div class="card-header flex justify-between">
            <div @click="emit('deleteMiniTextEditor',miniTextEditor)" class="hover:bg-slate-100 px-1 py-1 rounded-md">
                <TrashIcon></TrashIcon>
            </div>

            <div
                :class="'hover:bg-slate-100 sticky-note-handler px-1 py-1 rounded-md text-editor-handler-'+miniTextEditor.id"
            >
                <ArrowTopIcon></ArrowTopIcon>
            </div>
        </div>

        <div class="bg-white   flex gap-1 p-2 toolbar">
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-bold-'+miniTextEditor.id" >
                <BoldIcon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-italic-'+miniTextEditor.id">
                <ItalicIcon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-underline-'+miniTextEditor.id">
                <UnderLineIcon />
            </button >
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-h1-'+miniTextEditor.id">
                <H1Icon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-h2-'+miniTextEditor.id">
                <H2Icon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-h3-'+miniTextEditor.id"> 
                <H3Icon />
            </button>

            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-align-left-'+miniTextEditor.id">
                <AlignLeftIcon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-align-center-'+miniTextEditor.id">
                <CenterIcon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-align-right-'+miniTextEditor.id">
                <AlignRightIcon />
            </button>

            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-list-'+miniTextEditor.id">
                <ListIcon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-link-'+miniTextEditor.id">
                <LinkIcon />
            </button>
            <button :class="'hover:bg-slate-100 py-1 px-1 rounded-md apply-image-'+miniTextEditor.id">
                <ImageIcon />
            </button>
        </div>

        <div
            class="card-body w-full h-full p-2 bg-white"
            contenteditable="true"
        >
            content here...
        </div>
        <div class="flex justify-end">
            <div :class="'cursor-nw-resize text-editor-resizer-'+miniTextEditor.id">
                <ArrowDownIcon />
            </div>
        </div>
    </div>
</template>
