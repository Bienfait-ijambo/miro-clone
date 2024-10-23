<script lang="ts" setup>
import { stickyNoteStore } from "../../../../store/stickyNote";
import { IStickyNote } from "../../actions/project-board/stickynote/stickyNoteTypes";

const props = defineProps<{
    stickyNotes: IStickyNote[];
}>();

const emit = defineEmits<{
    (e: "changeStickyNoteColor", stickyId: number,color:string): void;
}>();

function changeStickyNoteBgColor(color: string) {
    const id = stickyNoteStore.stickyNote.id;
    emit("changeStickyNoteColor", id,color);
    const singleStickyNote = props.stickyNotes.filter((item) => item.id === id);

    if (singleStickyNote.length > 0) {
        const currentBgColor = singleStickyNote[0].color;

        const stickyNote = document.querySelector(
            ".sticky-note-" + id
        ) as HTMLElement;
        stickyNote.classList.remove(currentBgColor);
        stickyNote.classList.add(color);
    }
}
</script>
<template>
    <ul class="flex flex-col px-2 bg-white mb-2 gap-2 p-2 rounded-md shadow-md">
        <li
            @click="changeStickyNoteBgColor('bg-yellow-300 ')"
            class="flex hover:ring-1 flex-row rounded-md bg-yellow-300 h-8 cursor-pointer"
        ></li>
        <li
            @click="changeStickyNoteBgColor('bg-indigo-300 ')"
            class="flex flex-row hover:ring-1 rounded-md bg-indigo-300 h-8 cursor-pointer"
        ></li>
        <li
            @click="changeStickyNoteBgColor('bg-blue-300 ')"
            class="flex flex-row hover:ring-1 rounded-md bg-blue-300 h-8 cursor-pointer"
        ></li>
        <li
            @click="changeStickyNoteBgColor('bg-pink-300 ')"
            class="flex flex-row hover:ring-1 rounded-md bg-pink-300 h-8 cursor-pointer"
        ></li>
    </ul>
</template>
