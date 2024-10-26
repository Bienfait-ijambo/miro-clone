import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ICreateOrUpdateProject } from '../pages/admin/actions/project/createOrUpdateProject'

export const useProjectStore = defineStore('projectStore', () => {
  const input = ref<ICreateOrUpdateProject>({ id: null, name: '', userId: null })

 
  const edit = ref(false)

  return { input,edit}
})
