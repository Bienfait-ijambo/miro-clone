<script lang="ts" setup>
import { App } from "../../../../app/app";
const emit = defineEmits<{
    (e: "createTextCaption"): void;
    (e: "createStickyNote"): void;
    (e: "createMiniTextEditor"): void;
    (e: "initDrawing"): void;
    (e: "saveBoardData"): void;

    
}>();
</script>
<template>
    <ul
        class="flex flex-col px-2 mt-20 bg-white mb-2 gap-2 p-2 rounded-md shadow-md"
    >


    
    <li
    @click="emit('saveBoardData')"

            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <img :src="App.baseUrl + '/img/save.png'" alt="save" />
            </span>
        </li>

        <li
            @click="emit('createTextCaption')"
            class="flex flex-row rounded-md cursor-pointer bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <img :src="App.baseUrl + '/img/text.png'" alt="text" />
            </span>
        </li>

        <li
            @click="emit('initDrawing')"
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            
            <span class="icon pt-1">
                <img :src="App.baseUrl + '/img/pen.png'" alt="cursor" />
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
