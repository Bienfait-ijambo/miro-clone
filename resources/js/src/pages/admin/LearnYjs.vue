<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const margin = ref({ left: 0 });
const yMap = ref();

const users=ref<string[]>([])
const yArray = ref();



function initYjs() {
    console.log("...");

    const doc = new Y.Doc();
    yMap.value = doc.getMap("y-map");
    yArray.value = doc.getArray("y-array");


    yMap.value.observe((event: any) => {
        margin.value.left = yMap.value.get("margin-left");
        console.log("ymap was modified");
    });


    yArray.value.observe((event: any) => {
        // margin.value.left = yMap.value.get("margin-left");
        // console.log("ymap was modified");
        users.value=yArray.value.toArray();
        // console.log(yArray.value.toArray())
    });


    new WebsocketProvider("ws://localhost:1234", "my-room", doc);
}

function changeMargin() {
    margin.value.left -= 12;
    yMap.value.set("margin-left", margin.value.left);
}

function addUsers(){
    users.value.push('ben')
    yArray.value.insert(0, users.value)


}

onMounted(() => {
    initYjs();
});
</script>

<template>
    <div>
        <p :style="{ marginLeft: margin.left + 'px' }">Hello</p>
{{ users }}
        <button @click="addUsers" style="border: 1px solid blue">
            click here
        </button>
    </div>
</template>
