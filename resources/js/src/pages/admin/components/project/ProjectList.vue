<script lang="ts" setup>
import { IProjectList } from "../../actions/project/http/getProject";

const props = defineProps<{
    projects: IProjectList[];
}>();

const emit = defineEmits<{
    (e: "updateProject", project: IProjectList): Promise<void>;
}>();
</script>

<template>
    <div
        v-for="project in projects"
        :key="project.id"
        class="flex justify-center bg-white items-center min-h-60 shadow-md p-4 rounded-md cursor-pointer"
    >
        <div class="px-6">
            <div class="flex justify-center">
                <button
                    @click="emit('updateProject', project)"
                    class="hover:bg-slate-100 py-2 px-2 rounded-md hover:shadow-md"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                    </svg>
                </button>
            </div>
            <div class="flex justify-center">
                <p>{{ project.name }}</p>
                
            </div>
            <div class="flex text-gray-500 ml-[130px] mt-[60px] absolute  text-sm hover:text-indigo-500 font-semibold">
                <RouterLink :to="'/project-boards?project_code='+project.projectCode">Details</RouterLink>
            </div>
        </div>
    </div>
</template>
