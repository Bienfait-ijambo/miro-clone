<script lang="ts" setup>
const props=defineProps<{
    loading:boolean
}>()
//  
</script>
<template>
   <div>
    <!-- <div class="loading-text">Document syncing...</div> -->
    <div class="loading-text" v-show="props.loading">Loading document... </div>

    <div id="loadingSpinner" :style="props.loading ? 'display:block':'display:none'" class="loading-spinner"></div>
   </div>
</template>
<style scoped>
/* Spinner styles */
.loading-text{
    position: absolute;
    top: 46%;
    left: 48%;
    z-index: 1000;
    
}

.loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 8px solid #f3f3f3;
    z-index: 1000;
    border-radius: 50%;
    border-top: 8px solid #3498db;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
