<script lang="ts" setup>
import { ITextCaption } from "../../actions/project-board/text-caption/textCaptionTypes";

defineProps<{
    textCaptions: ITextCaption[];
}>();

const emit = defineEmits<{
    (e: "deleteTextCaption", textCaption: ITextCaption): void;
}>();
</script>

<template>
    <div
        v-for="textCaption in textCaptions"
        :key="textCaption.id"
        :style="{
             position: 'absolute',
            top: textCaption.dragPosition.y + 'px',
            left: textCaption.dragPosition.x + 'px',
            width: textCaption.resizePosition.x + 'px',
            height: textCaption.resizePosition.y + 'px',
        }"
        :class="
            'flex flex-col  min-h-30 w-[200px] shadow-md  p-1 rounded-md cursor-pointer text-caption-' +
            textCaption.id +
            ' ' 
        "
    >
        <div class="card-header flex justify-between">
            <div
                @click="emit('deleteTextCaption', textCaption)"
                class="hover:bg-slate-100 px-1 py-1 rounded-md"
            >
                <TrashIcon></TrashIcon>
            </div>

            <div
                :class="
                    'hover:bg-slate-100 text-caption-handler px-1 py-1 rounded-md text-caption-handler-' +
                    textCaption.id
                "
            >
                <ArrowTopIcon></ArrowTopIcon>
            </div>
        </div>
        <div
            :class="
                'card-body w-full bg-white h-full border-none outline-none p-2 font-bold text-caption-body-' + textCaption.id
            "
            contenteditable="true"
        >
            <b>{{ textCaption.body }}</b>
        </div>
        <div class="flex justify-end">
            <div
                :class="'cursor-nw-resize text-caption-resizer-' + textCaption.id"
            >
                <ArrowDownIcon />
            </div>
        </div>
    </div>
</template>
