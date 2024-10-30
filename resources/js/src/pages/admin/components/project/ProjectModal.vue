<script lang="ts" setup>
import BaseModal from "../../../../components/base-components/BaseModal.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ref } from "vue";
import Error from "../../../../components/base-components/Error.vue";
import BaseInput from "../../../../components/base-components/BaseInput.vue";
import { useCreateOrUpdateProject } from "../../actions/project/http/createOrUpdateProject";
import { useProjectStore } from "../../../../store/projectStore";

const props = defineProps<{
    showModal: boolean;
}>();

const emit = defineEmits<{
    (e: "closeModal"): void;
    (e: "getProjects"): Promise<void>;


}>();

const rules = {
    name: { required }, // Matches state.firstName
    // userId: { required },
};


const projectInput=useProjectStore()
const v$ = useVuelidate(rules, projectInput.input);

const {createOrUpdateProject,loading}=useCreateOrUpdateProject()


async function validate() {
    const result = await v$.value.$validate();

    if (!result) return;

    //http request
    await createOrUpdateProject(projectInput.input,projectInput.edit)
    await emit('getProjects')

    v$.value.$reset();
}
</script>

<template>
    <div>
        <BaseModal :show="props.showModal">
            <template #title>
                <h2 class="text-lg font-semibold">Create Project</h2>
            </template>

            <template #body>
                <div class="flex flex-col ">
                    <Error label="Project Name" :errors="v$.name.$errors">
                        <BaseInput v-model="projectInput.input.name" />
                    </Error>
                </div>
            </template>

            <template #footer>
                <button
                    @click="emit('closeModal')"
                    className="border-2 border-gray-300 hover:bg-gray-300 text-sm text-gray-700 px-4 py-2 rounded"
                >
                    Close
                </button>
                <button
                :disabled="loading"
                    @click="validate"
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                >
                <span v-if="loading">
                    Saving...
                </span>
                <span v-else>
                    {{  projectInput.edit ? 'Update':'Save' }}
                </span>
                </button>
            </template>
        </BaseModal>
    </div>
</template>
