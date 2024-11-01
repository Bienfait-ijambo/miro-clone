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
    Y.applyUpdateV2(doc, update);
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

 
let sum=ref(0)
const whiteArray = [1, 2, 3, 4, 5];

onMounted(() => {
  // Load the worker from the proxied URL
  const worker = new Worker('/worker/arrayWorker.js');  // Path based on the proxy
console.log('worker :',worker);
  console.log('Posting data to the worker:', whiteArray);
  worker.postMessage(whiteArray);  // Send the array to the worker

  // Set up a listener for messages from the worker
  worker.onmessage = (event) => {
    console.log('Data received from worker:', event.data);
    sum.value = event.data;  // Get the result from the worker
  };

  worker.onerror = (error) => {
    console.error('Worker encountered an error:', error);
  };
});
</script>

<template>
  <div>

    <h1>Array Sum: {{ sum }}</h1>
    <!-- <button @click="calculateSum">Calculate Sum</button> -->

    <p :style="{ marginLeft: margin.left + 'px' }">Hello</p>

    <button @click="changeMargin" style="border: 1px solid blue">
      Click here to change margin
    </button>
  </div>
</template>
