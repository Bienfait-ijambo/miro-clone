<script lang="ts" setup>
 import { onMounted, ref } from 'vue';
import {useYjs} from './learnyjs'

const val=ref(0)
 const {message,messages,updateData,triggerAction}=useYjs()

 const userTyping=()=>{
  window.Echo.private(`chat.${2}`)
    .whisper('typing', {
        name: "ben",
        userId:1
    }) 
 }
 onMounted(()=>{
//  await triggerAction(0)
updateData()
  messages.value=[]




 })
</script>

<template>
 <div>
  <!-- <h1>Realtime {{ message }} </h1> -->
  <input type="text" v-model="val" @keydown="userTyping" placeholder="message....">
  <button @click="triggerAction(val)">Click here bro</button>
  <br><br>


users messages:{{ messages }}
  <div>
    <!-- <input type="text" placeholder="message...."> -->
  </div>
 </div>
</template>
