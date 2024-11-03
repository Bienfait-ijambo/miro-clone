import { RouteLocationNormalizedLoaded } from "vue-router";
import { makeHttpReq2 } from "../../../../../helper/makeHttpReq";
import { ref } from "vue";





export interface IProjectDetail{
    id:number
    name:string
    image:string
    projectCode:string
    userId:number
}
export function useGetProjectDetail(route: RouteLocationNormalizedLoaded){

    const project_code=route?.query?.project_code
    const loading=ref(false)

    const projectData = ref<IProjectDetail>({} as IProjectDetail)

    async function getProjectDetail() {
      try {
        loading.value = true
        const data = await makeHttpReq2<undefined, IProjectDetail|Array<any>>(`projects/detail?project_code=${project_code}`, 'GET')
       
        if(!Array.isArray(data)){
          projectData.value = data
        }else{
          window.location.href="/app/projects"
        }
       
        loading.value = false
      } catch (error) {
        console.error(error)
        loading.value = false
      }
    }
  
    return { getProjectDetail, projectData, loading }

}