
<script lang="ts" setup>
const props = defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    (e: "closeModal"): void;
}>();
</script>
<template>
    <div
        v-show="show"
        className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-out"
    >
        <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:w-2/3 md:w-1/2 lg:w-1/3 transform transition-transform duration-300 ease-out scale-95 opacity-0 animate-modalFadeIn"
        >
            <div className="flex justify-between items-center">
                <slot name="title"></slot>
            </div>

            <!-- modal body -->
            <div class="py-4">
                <slot name="body"></slot>
                
            </div>
            <!-- end modal body  -->

            <div className="flex gap-2 justify-end mt-4">

                <slot name="footer"></slot>

              
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
.animate-modalFadeIn {
    animation: modalFadeIn 0.3s ease-out forwards;
}
</style>



