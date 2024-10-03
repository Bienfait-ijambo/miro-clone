<script lang="ts" setup>
import { IStickyNote } from "../../actions/project-board/stickyNoteTypes";

defineProps<{
    stickyNotes: IStickyNote[];
}>();

const emit = defineEmits<{
    (e: "deleteStickyNote", stickyNote: IStickyNote): void;
}>();
</script>

<template>
    <div
        v-for="stickyNote in stickyNotes"
        :key="stickyNote.id"
        :style="{
            top: stickyNote.dragPosition.y + 'px',
            left: stickyNote.dragPosition.x + 'px',
            width: stickyNote.resizePosition.x + 'px',
            height: stickyNote.resizePosition.y + 'px',
        }"
        :class="
            'flex flex-col min-h-40 w-[200px] shadow-md  p-1 rounded-md cursor-pointer sticky-note-' +
            stickyNote.id +
            ' ' +
            stickyNote.color
        "
    >
        <div class="card-header flex justify-between">
            <div
                @click="emit('deleteStickyNote', stickyNote)"
                class="hover:bg-slate-100 px-1 py-1 rounded-md"
            >
                <TrashIcon></TrashIcon>
            </div>

            <div
                :class="
                    'hover:bg-slate-100 sticky-note-handler px-1 py-1 rounded-md sticky-note-handler-' +
                    stickyNote.id
                "
            >
                <ArrowTopIcon></ArrowTopIcon>
            </div>
        </div>
        <div
            :class="
                'card-body w-full h-full p-2 sticky-note-body-' + stickyNote.id
            "
            contenteditable="true"
        >
            {{ stickyNote.body }}
        </div>
        <div class="flex justify-end">
            <div
                :class="'cursor-nw-resize sticky-note-resizer-' + stickyNote.id"
            >
                <ArrowDownIcon />
            </div>
        </div>
    </div>
</template>
