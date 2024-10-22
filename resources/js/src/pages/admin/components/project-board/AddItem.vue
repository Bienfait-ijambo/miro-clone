<script lang="ts" setup>
import { App } from "../../../../app/app";
const emit = defineEmits<{
    (e: "createTextCaption"): void;
    (e: "createStickyNote"): void;
    (e: "createMiniTextEditor"): void;
    (e: "initDrawing"): void;
}>();
</script>
<template>
    <ul
        class="flex flex-col px-2 bg-white mt-20 mb-2 gap-2 p-2 rounded-md shadow-lg animate-pulse"
    >
        <li
        @click="emit('createTextCaption')"
            class="flex flex-row rounded-md cursor-pointer bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <img :src="App.baseUrl + '/img/text.png'" alt="" />
            </span>
        </li>

        <li
            @click="emit('initDrawing')"
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <img :src="App.baseUrl + '/img/cursor.png'" alt="" />
            </span>
        </li>

        <li
            @click="emit('createStickyNote')"
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <StickyNoteIcon />
            </span>
        </li>

        <li
            @click="emit('createMiniTextEditor')"
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <DocumentIcon />
            </span>
        </li>
    </ul>
</template>
