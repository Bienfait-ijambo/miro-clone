<script lang="ts" setup>
const emit = defineEmits<{ (e: "createStickyNote"): void }>();
</script>
<template>
    <ul
        class="flex flex-col px-2 bg-white mt-20 mb-2 gap-2 p-2 rounded-md shadow-md"
    >
        <li
        @click="emit('createStickyNote')"
            class="flex flex-row rounded-md cursor-pointer bg-slate-100 px-2 py-2"
        >
            <span class="icon pt-1">
                <StickyNoteIcon />
            </span>
        </li>

        <li
            class="flex flex-row rounded-md cursor-pointer hover:bg-slate-100 px-2 py-2"
        >
            <span class="icon pt-1">
                <DocumentIcon />
            </span>
        </li>
    </ul>
</template>
