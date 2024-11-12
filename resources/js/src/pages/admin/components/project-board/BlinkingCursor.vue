
<script lang="ts" setup>
import { yDocStore } from '../../../../store/yDoc';

const props=defineProps<{
    miniTextEditorId: number;
    x:string
    y:string
}>();

</script>
<template>
       <div 
       :style="{
        left:props.x,
        top:props.y,

       }"
       :class="'blinking-cursor blinking-cursor-'+miniTextEditorId"
    >
    {{ yDocStore.cursor.typingUser }}
    </div>
</template>
<style scoped>
.blinking-cursor{
    position: absolute;
    color:#2497c4;
     pointer-events: none;
     background-color: #2497c4;
     padding: 2px 5px;
    border-radius: 4px;
    font-size: 12px;
    color: #ffffff;
    border: 1px solid #ccc;
    display: none
}
</style>