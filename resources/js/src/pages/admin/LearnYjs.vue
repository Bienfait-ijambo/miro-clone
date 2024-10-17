<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

// Define reactive variables
const margin = ref({ left: 0 });
const yMap = ref<Y.Map<any>>();
const yArray = ref<Y.Array<any>>();
const users = ref<string[]>([]);

function initYjs() {
  console.log("Initializing Yjs...");

  // Create a new Yjs document
  const doc = new Y.Doc();
  
  // Fetch shared Yjs structures
  yMap.value = doc.getMap("y-map");
  yArray.value = doc.getArray("y-array");

  // Set up the WebSocket connection for the Yjs room
  const provider = new WebsocketProvider("ws://localhost:1234", "my-room", doc);

  // **Efficient Update Handling**: Listen for updates and apply only the changes
  provider.on("sync", (isSynced: boolean) => {
    if (isSynced) {
      const stateVector:Uint8Array = Y.encodeStateVector(doc);
      console.log("State vector sent, syncing with remote peers:", stateVector);

      // Request the differences by sending the state vector
      provider.ws?.send(stateVector);
    }
  });

  // Apply remote updates efficiently based on state vector differences
  provider.on("message", (message: Uint8Array) => {
    const remoteStateVector = message; // Get the remote state vector
    console.log('provider on message:', message);
    const update = Y.encodeStateAsUpdate(doc, remoteStateVector);
    Y.applyUpdate(doc, update);
    console.log("Applied remote update based on state vector differences.");
  });

  // Observe changes in the Yjs Map and update local state
  yMap.value.observe((event: Y.YMapEvent<any>) => {
    if (event.keysChanged.has("margin-left")) {
      margin.value.left = yMap.value!.get("margin-left") || 0;
    }
  });


  // Handle WebSocket connection status
  provider.on("status", (status: { status: "connected" | "disconnected" }) => {
    console.log(`WebSocket Provider status: ${status.status}`);
  });
}

function changeMargin() {
  // Change margin locally and broadcast the change
  margin.value.left += 12;
  yMap.value?.set("margin-left", margin.value.left);
}

// Initialize the Yjs document on component mount
onMounted(() => {
  initYjs();
});
</script>

<template>
  <div>
    <p :style="{ marginLeft: margin.left + 'px' }">Hello</p>

    <button @click="changeMargin" style="border: 1px solid blue">
      Click here to change margin
    </button>
  </div>
</template>
