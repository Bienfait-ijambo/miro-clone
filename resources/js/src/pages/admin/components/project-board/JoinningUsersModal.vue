<script lang="ts" setup>
import BaseModal from '../../../../components/base-components/BaseModal.vue';
import { yDocStore } from '../../../../store/yDoc';
const props = defineProps<{
    showModal: boolean;
}>();


const emit = defineEmits<{
    (e: "closeModal"): void;
}>();
</script>

<template>
    <div>
        <BaseModal :show="props.showModal">
            <template #title>
                <h2 class="text-lg font-semibold">Users</h2>
            </template>

            <template #body>
                <ul
                    class="bg-slate-50 mt-5 rounded-md   py-2 px-4 divide-y divide-gray-200"
                >
                    <li class="py-2 px-4 hover:cursor-pointer" v-for="user in yDocStore.joinees" :key="user.id">
                        {{user.name}} - <a href="http://" class="text-blue-600 underline">{{user.email}}</a>
                    </li>
                    
                </ul>
            </template>

            <template #footer>
                <button
                    @click="emit('closeModal')"
                    className="border-2 border-gray-300 hover:bg-gray-300 text-sm text-gray-700 px-4 py-2 rounded"
                >
                    Close
                </button>
            </template>
        </BaseModal>
    </div>
</template>




         
