import { ref } from "vue"
import { useProjectStore } from "../../../../store/projectStore"
import { showError, successMsg } from "../../../../helper/toastnotification"
import { getUserData } from "../../../../helper/auth"
import { makeHttpReq2 } from "../../../../helper/makeHttpReq"
import { useGetProject } from "./getProject"




export interface ICreateOrUpdateProject {
    id: number | null
    name: string
    userId: number | null
  }
  
  type ResponseType = { message: string }
  
  const projectInput = useProjectStore()
  const {getProjects}=useGetProject()

  
  export function useCreateOrUpdateProject() {
    const loading = ref(false)
  
    async function createOrUpdateProject(
      input: ICreateOrUpdateProject,
      edit: boolean
    ) {
      try {
        const userData = getUserData()
        loading.value = true
        projectInput.input.userId = parseInt(userData?.user?.userId as string)
        const data = edit ? await update('projects', input) : await create('projects', input)
        await getProjects()
        projectInput.edit=false
        projectInput.input = {} as ICreateOrUpdateProject
        
  
        successMsg(data.message)
  
        loading.value = false
      } catch (error) {
        if (typeof (error as { errors: Array<string> }).errors !== 'undefined') {
          for (const message of (error as { errors: Array<string> }).errors) {
            showError(message)
          }
        }
  
        loading.value = false
        showError((error as Error).message)
      }
    }
  
    return {createOrUpdateProject , loading }
  }
  
  async function create(url: string, input: ICreateOrUpdateProject) {
    const data = await makeHttpReq2<ICreateOrUpdateProject, ResponseType>(url, 'POST', input)
    return data
  }
  
  async function update(url: string, input: ICreateOrUpdateProject) {
    const data = await makeHttpReq2<ICreateOrUpdateProject, ResponseType>(url, 'PUT', input)
    return data
  }
  
   