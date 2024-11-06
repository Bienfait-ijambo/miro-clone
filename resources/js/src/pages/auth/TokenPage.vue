






<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAccessTokenAndRefreshToken } from './actions/getToken';

const route = useRoute()

const codeVerifier = route.query?.code_verifier as string
const userId = route.query?.user_id as string

onMounted(async () => {
  
  await getAccessTokenAndRefreshToken(codeVerifier,userId)
})
</script>

<template>
  <h1>processing... please wait...</h1>
</template>




