import { ref } from 'vue'
import { makeHttpReq2 } from './../../../../helper/makeHttpReq';

export interface IProjectList {
  id: number
  name: string
  projectCode: string
  projectLink: string
  userId:number

}

export type ProjectListResponseType = { data: Array<IProjectList> }

export function useGetProject() {
  const loading = ref(false)
  const serverData = ref<ProjectListResponseType>({} as ProjectListResponseType)

  async function getProjects(page=1) {
    try {
      loading.value = true
      const data = await makeHttpReq2<undefined, ProjectListResponseType>(`projects?page=${page}`, 'GET')
      serverData.value = data
      loading.value = false
    } catch (error) {
      console.error(error)
      loading.value = false
    }
  }

  return { getProjects, serverData, loading }
}




