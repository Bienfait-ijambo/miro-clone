<script lang="ts" setup>
import { useRoute } from "vue-router";
import {useAddJoinees} from './actions/addjoinee/http/addJoinee'
import LoadingIndicator from "../../components/base-components/LoadingIndicator.vue";
import { onMounted } from "vue";
import { tryLogoutUser } from "./actions/http/trylogout";
const route=useRoute()
const {addJoinees,loading}=useAddJoinees(route)


onMounted(async ()=>{
// await  tryLogoutUser()

await addJoinees()

})
</script>


<template>
    <div align="center">
        <LoadingIndicator :loading="loading"/>
        
    </div>
</template>