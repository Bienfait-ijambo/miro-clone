<script lang="ts" setup>
const emit = defineEmits<{
    (e: "redo"): void;
    (e: "undo"): void;
    (e: "resetCanvas"): void;

}>();
</script>
<template>


    <ul class="flex flex-col px-2 bg-white mb-2 gap-2 p-2 rounded-md shadow-md">
        <li
       @click="emit('resetCanvas')"
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <ResetCanvasIcon />
            </span>
        </li>

        <li
       @click="emit('redo')"
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <RedoIcon />
            </span>
        </li>

        <li
         @click="emit('undo')"
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-1"
        >
            <span class="icon pt-1">
                <UndoIcon />
            </span>
        </li>
    </ul>
</template>
