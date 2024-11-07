<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import UserCursor from "./components/project-board/UserCursor.vue";
// Define reactive variables
const mousePosition = ref({
            x: 0,
            y: 0,
        });
const yMouse = ref();



function initYjs() {

  // Create a new Yjs document
  const doc = new Y.Doc();
  
  yMouse.value = doc.getMap("y-mouse");

yMouse.value.observe((event: any) => {
  mousePosition.value.x = yMouse.value.get("x") ;
    mousePosition.value.y = yMouse.value.get("y");
});

  new WebsocketProvider("ws://localhost:1234", "my-lox-room", doc);

 


}



function trackMousePosition(event: any) {
console.log('hello')
mousePosition.value.x = event.clientX;
mousePosition.value.y = event.clientY;
yMouse.value.set("x", event.clientX);
yMouse.value.set("y", event.clientY);
}

onMounted(() => {
  initYjs()
});
</script>

<template>
  <div @mousemove="trackMousePosition" style="background-color: aliceblue;height: 200px;" >

    <!-- <h1>Array Sum: {{ sum }}</h1> -->
    <!-- <button @click="calculateSum">Calculate Sum</button> -->

    <!-- <p :style="{ marginLeft: margin.left + 'px' }">Hello</p> -->
    <UserCursor :mouse-position="mousePosition" user-name="ben" />
    <!-- <button @click="changeMargin" style="border: 1px solid blue">
      Click here to change margin
    </button> -->
  </div>
</template>
